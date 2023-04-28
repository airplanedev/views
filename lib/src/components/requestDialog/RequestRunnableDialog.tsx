import { Button, MultiSelect } from "@mantine/core";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useState, useRef } from "react";
import * as React from "react";

import { DefaultParams, ParamValues } from "client";
import {
  ENTITIES_SEARCH,
  GROUPS_GET,
  REQUESTS_CREATE,
  RUNBOOKS_GET,
  TASKS_GET_TASK_REVIEWERS,
  USERS_GET,
} from "client/endpoints";
import { Fetcher } from "client/fetcher";
import {
  EntitiesResponse,
  Group,
  TaskOrRunbookReviewersResponse,
  User,
  UserGroup,
} from "client/types";
import { Avatar, getInitials } from "components/avatar/Avatar";
import { Dialog } from "components/dialog/Dialog";
import { UserGroupIcon } from "components/icon";
import { Loader } from "components/loader/Loader";
import { showNotification } from "components/notification/showNotification";
import { Stack } from "components/stack/Stack";
import { useAsyncDebounce } from "components/table/useAsyncDebounce";
import { Text } from "components/text/Text";
import { Textarea } from "components/textarea/Textarea";

export type RequestRunnableDialogProps<TParams> = {
  opened: boolean;
  onSubmit: () => void;
  onClose: () => void;
  taskSlug?: string;
  runbookSlug?: string;
  paramValues: TParams;
};

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  ug: UserGroup;
}

const ResultRow = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ug, ...others }: ItemProps, ref) => {
    return (
      <div ref={ref} {...others}>
        {ug.user && (
          <Stack spacing="sm" direction="row" align="center">
            <Avatar size="sm" src={ug.user.avatarURL}>
              {getInitials(label)}
            </Avatar>
            <Text disableMarkdown>{label}</Text>
          </Stack>
        )}
        {ug.group && (
          <Stack spacing="sm" direction="row" align="center">
            <Avatar size="sm">
              <UserGroupIcon />
            </Avatar>
            <Text disableMarkdown>{label}</Text>
          </Stack>
        )}
      </div>
    );
  }
);
ResultRow.displayName = "ResultRow";

type UserOrGroup = { groupID?: string; userID?: string };
type ReviewerForSelect = {
  label: string;
  value: string;
  ug: UserGroup;
};
type HydratedReviewers = UseQueryResult<
  { user: User } | { group: Group },
  unknown
>[];

export function RequestRunnableDialog<
  TParams extends ParamValues | undefined = DefaultParams
>(props: RequestRunnableDialogProps<TParams>) {
  const [selections, setSelections] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const reviewersForSelect = useRef<ReviewerForSelect[]>([]);

  if (props.runbookSlug && props.taskSlug) {
    throw new Error("cannot specify both runbookSlug and taskSlug");
  }
  const slug = props.runbookSlug ?? props.taskSlug;
  if (slug === undefined) {
    throw new Error("must specify runbookSlug or taskSlug");
  }

  const getRunnableEndpoint = props.runbookSlug
    ? RUNBOOKS_GET
    : TASKS_GET_TASK_REVIEWERS;

  const { data: runnableData, isLoading: runnableDataIsLoading } = useQuery(
    [getRunnableEndpoint, slug],
    async () => {
      const fetcher = new Fetcher();
      return await fetcher.get<TaskOrRunbookReviewersResponse>(
        getRunnableEndpoint,
        {
          taskSlug: props.taskSlug,
          runbookSlug: props.runbookSlug,
        }
      );
    }
  );

  const { data: entities } = useQuery(
    [ENTITIES_SEARCH, searchQuery],
    async () => {
      const fetcher = new Fetcher();
      return await fetcher.get<EntitiesResponse>(ENTITIES_SEARCH, {
        q: searchQuery,
        scope: "all",
      });
    },
    { staleTime: Infinity, enabled: !hasExplicitPermissions(runnableData) }
  );

  const hydratedReviewers = useQueries({
    queries: (runnableData?.reviewers || []).map((reviewer) => {
      if (reviewer.userID) {
        return {
          queryKey: [USERS_GET, reviewer.userID],
          queryFn: async () => {
            const fetcher = new Fetcher();
            return await fetcher.get<{ user: User }>(USERS_GET, {
              userID: reviewer.userID,
            });
          },
        };
      }
      if (reviewer.groupID) {
        return {
          queryKey: [GROUPS_GET, reviewer.groupID],
          queryFn: async () => {
            const fetcher = new Fetcher();
            return await fetcher.get<{ group: Group }>(GROUPS_GET, {
              groupID: reviewer.groupID,
            });
          },
        };
      }
      throw new Error("expected userID or groupID");
    }),
  });
  const reviewersLoading =
    runnableDataIsLoading || hydratedReviewers.some((res) => res.isLoading);

  const { triggerID, reviewersForSelect: newReviewersForSelect } =
    processQueryOutputs(hydratedReviewers, runnableData, entities);
  // Add to the list of reviewers that we've already fetched instead of replacing.
  const reviewersToAdd = newReviewersForSelect.filter(
    (newReviewer) =>
      !reviewersForSelect.current.some(
        (reviewer) => reviewer.value === newReviewer.value
      )
  );
  reviewersForSelect.current.push(...reviewersToAdd);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!triggerID) {
      throw new Error("no trigger to execute");
    }
    setSubmitting(true);
    const reviewers: UserOrGroup[] = selections.map(getUserOrGroupFromValue);
    try {
      const fetcher = new Fetcher();
      await fetcher.post<{ triggerRequestID: string }>(REQUESTS_CREATE, {
        triggerID,
        requestData: {
          ...(props.taskSlug && {
            taskData: {
              paramValues: props.paramValues,
            },
          }),
          ...(props.runbookSlug && {
            runbookData: {
              paramValues: props.paramValues,
            },
          }),
        },
        reason,
        reviewers,
      });
      showNotification({
        message: "Request successful",
        type: "success",
      });
      props.onSubmit();
      setSelections([]);
      setReason("");
    } catch (e) {
      showNotification({
        title: "Request unsuccessful",
        message: e instanceof Error ? e.message : "",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const onSearchChange = useAsyncDebounce((value: string) => {
    setSearchQuery(value);
  }, 200);

  return (
    <Dialog
      title={
        "Request execution of " +
        (runnableData?.task?.name ||
          runnableData?.runbook?.name ||
          props.taskSlug ||
          props.runbookSlug)
      }
      padding={20}
      opened={props.opened}
      onClose={props.onClose}
    >
      <form onSubmit={onSubmit}>
        <Stack>
          <Textarea
            label="Reason"
            value={reason}
            onChange={(event) => setReason(event.currentTarget.value)}
            description="Extra context sent to the reviewers below"
          />

          {/* Once we have our own MultiSelect, this should be swapped out */}
          {!reviewersLoading && (
            <MultiSelect
              data={reviewersForSelect.current}
              placeholder="Select users or groups"
              label="Reviewers"
              itemComponent={ResultRow}
              searchable
              value={selections}
              onChange={setSelections}
              onSearchChange={onSearchChange}
              description="Request approval from users or groups"
            />
          )}

          {reviewersLoading && <Loader variant="dots" />}

          <Stack direction="row" justify="end">
            <Button
              type="submit"
              disabled={reviewersLoading}
              loading={submitting}
            >
              Request
            </Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
}

/**
 * Transforms raw reviewer data into the format the components expect
 */
function processQueryOutputs(
  hydratedReviewers: HydratedReviewers,
  runnableData: TaskOrRunbookReviewersResponse | undefined,
  entities: EntitiesResponse | undefined
) {
  let triggerID = "";
  let reviewersForSelect: { label: string; value: string; ug: UserGroup }[] =
    [];

  if (runnableData != null) {
    const allUsersAndGroupsFetched = hydratedReviewers.every(
      (res) => res.status === "success"
    );

    const triggers =
      runnableData.task?.triggers ?? runnableData.runbook?.triggers;
    const formTrigger = triggers?.find((t) => t.kind === "form");
    if (!formTrigger) {
      throw new Error("unexpected api response: missing form trigger");
    }
    triggerID = formTrigger.triggerID;

    if (hasExplicitPermissions(runnableData)) {
      if (allUsersAndGroupsFetched) {
        reviewersForSelect = hydratedReviewers.map((queryResult, i) => {
          const ret: { label: string; value: string; ug: UserGroup } = {
            label: "",
            value: "",
            ug: {},
          };
          if ("user" in queryResult.data!) {
            ret.ug.user = queryResult.data.user;
            ret.label = getUserLabel(queryResult.data.user);
            ret.value = getUserValue(queryResult.data.user);
          }
          if ("group" in queryResult.data!) {
            ret.ug.group = queryResult.data.group;
            ret.label = getGroupLabel(queryResult.data.group);
            ret.value = getGroupValue(queryResult.data.group);
          }
          return ret;
        });
      }
    } else {
      if (entities != null) {
        reviewersForSelect = entities.results.map((ug, i) => {
          if (ug.user) {
            return {
              label: getUserLabel(ug.user),
              value: getUserValue(ug.user),
              ug,
            };
          }
          if (ug.group) {
            return {
              label: getGroupLabel(ug.group),
              value: getGroupValue(ug.group),
              ug,
            };
          }
          return { label: "", value: "", ug: {} };
        });
      }
    }
  }
  return { triggerID, reviewersForSelect };
}

function getUserLabel(user: User) {
  return user.name || user.email || user.userID;
}
function getGroupLabel(group: Group) {
  return group.name || group.id;
}
function getUserValue(user: User) {
  return `usr_${user.userID}`;
}
function getGroupValue(group: Group) {
  return `grp_${group.id}`;
}
function getUserOrGroupFromValue(value: string): UserOrGroup {
  if (value.startsWith("usr_")) {
    return { userID: value.substring(4) };
  }
  if (value.startsWith("grp_")) {
    return { groupID: value.substring(4) };
  }
  throw new Error("unexpected value: " + value);
}
function hasExplicitPermissions(
  taskOrRunbook?: TaskOrRunbookReviewersResponse
): boolean {
  return !!(
    taskOrRunbook?.task?.requireExplicitPermissions ||
    taskOrRunbook?.runbook?.isPrivate
  );
}
