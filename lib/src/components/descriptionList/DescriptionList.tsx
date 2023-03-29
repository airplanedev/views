import { createStyles } from "@mantine/core";
import type { ParamValues } from "airplane/api";
import React, { useState } from "react";

import { DefaultOutput, DefaultParams } from "client";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import {
  LatestRun,
  SetLatestRunProps,
  useSetLatestRunInTaskQuery,
} from "components/errorBoundary/LatestRunDetails";
import { Skeleton } from "components/Skeleton";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";
import { displayTaskBackedError } from "errors/displayTaskBackedError";
import { useTaskQuery } from "state";

import {
  DescriptionListComponentProps,
  DescriptionListPropsWithTask,
  DescriptionListProps,
} from "./DescriptionList.types";

export const useStyles = createStyles((theme) => ({
  item: {
    borderTop: theme.other.borderStyles.light,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    "&:first-child": {
      borderTop: "none",
      paddingTop: 0,
    },
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  term: {
    fontWeight: 500,
    color: theme.colors.gray[5],
    paddingRight: theme.spacing.sm,
  },
  description: {
    paddingLeft: theme.spacing.sm,
  },
}));

export const DescriptionListComponent = ({
  items,
  align = "start",
  loading,
  ...restProps
}: DescriptionListComponentProps) => {
  const { classes } = useStyles();
  const itemsToRender = loading ? [...Array(4)] : items;
  return (
    <Stack {...restProps} spacing={0}>
      {itemsToRender.map((item, idx) => (
        <Stack
          direction="row"
          key={idx}
          spacing={0}
          className={classes.item}
          align={align}
        >
          {loading ? (
            <>
              <Skeleton height={16} mx={16} width="33%" radius="sm" />
              <Skeleton height={16} mx={16} width="33%" radius="sm" />
            </>
          ) : (
            <>
              <Text className={classes.term} width="1/3">
                {item.term}
              </Text>
              <Text className={classes.description} width="2/3">
                {item.description}
              </Text>
            </>
          )}
        </Stack>
      ))}
    </Stack>
  );
};

export const DescriptionListWithTask = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput
>({
  task,
  outputTransform,
  setLatestRun,
  ...restProps
}: DescriptionListPropsWithTask<TParams, TOutput> & SetLatestRunProps) => {
  const fullQuery = useSetLatestRunInTaskQuery<TParams>(task, setLatestRun);
  const { error, loading, output, runID } = useTaskQuery<TParams, TOutput>(
    fullQuery
  );

  const items = output
    ? outputToItems<TParams, TOutput>(output, outputTransform)
    : [];

  if (error) {
    return displayTaskBackedError({
      error,
      taskSlug: fullQuery.slug,
      runID,
      componentName: "DescriptionList",
    });
  } else {
    return (
      <DescriptionListComponent
        loading={loading}
        items={items}
        {...restProps}
      />
    );
  }
};

export const DescriptionList = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput
>(
  props: DescriptionListProps<TParams, TOutput>
) => {
  const [latestRun, setLatestRun] = useState<LatestRun>();
  if (doesUseTask<TParams, TOutput>(props)) {
    return (
      <ComponentErrorBoundary
        componentName={DescriptionList.displayName}
        latestRun={latestRun}
      >
        <DescriptionListWithTask {...props} setLatestRun={setLatestRun} />
      </ComponentErrorBoundary>
    );
  } else {
    return (
      <ComponentErrorBoundary componentName={DescriptionList.displayName}>
        <DescriptionListComponent {...props} />
      </ComponentErrorBoundary>
    );
  }
};

DescriptionList.displayName = "DescriptionList";

/**
 * outputToItems converts task output to DescriptionList items.
 */
function outputToItems<TParams extends ParamValues | undefined, TOutput>(
  output: TOutput,
  outputTransform?: DescriptionListPropsWithTask<
    TParams,
    TOutput
  >["outputTransform"]
): DescriptionListComponentProps["items"] {
  if (!output) {
    return [];
  }
  const unwrappedOutput = unwrapOutput<TOutput>(output);
  let items = outputTransform
    ? outputTransform(unwrappedOutput)
    : unwrappedOutput;

  // If items is an object, convert it to an array of {term, description} objects.
  // e.g. {foo: "bar"} -> [{term: "foo", description: "bar"}]
  if (items && typeof items === "object" && !Array.isArray(items)) {
    items = Object.keys(items).map((key) => ({
      term: key,
      description: (items as Record<string, React.ReactNode>)[key],
    }));
  }
  if (!validateItems(items)) {
    throw new Error(`Task output must be type Array<{
      term: React.ReactNode;
      description: React.ReactNode;
    }>. Got ${JSON.stringify(items)}`);
  }
  return items;
}

/**
 * Unwrap object with one object entry, e.g. {key: [{"a": "A", "b": "B"}]}.
 * @returns The unwrapped object or undefined if the object is not unwrappable
 */
function unwrapOutput<TOutput>(data: unknown): TOutput {
  if (data && !Array.isArray(data) && typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      const value = (data as Record<string, unknown>)[keys[0]];
      if (Array.isArray(value)) {
        return value as TOutput;
      }
    }
  }
  return data as TOutput;
}

function doesUseTask<TParams extends ParamValues | undefined, TOutput>(
  props: DescriptionListProps<TParams, TOutput>
): props is DescriptionListPropsWithTask<TParams, TOutput> {
  return Boolean(
    (props as DescriptionListPropsWithTask<TParams, TOutput>).task
  );
}

function validateItems(
  items: unknown[] | unknown
): items is DescriptionListComponentProps["items"] {
  if (!Array.isArray(items)) return false;
  return items.every((item) => {
    if (!item || typeof item !== "object") return false;
    return "term" in item && "description" in item;
  });
}
