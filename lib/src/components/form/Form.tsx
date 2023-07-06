import { HTTPError } from "@airplane/lib";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo, useState } from "react";

import { DefaultOutput } from "client";
import {
  PERMISSIONS_GET,
  RUNBOOKS_GET,
  TASKS_GET_TASK_REVIEWERS,
} from "client/endpoints";
import { executeRunbook } from "client/executeRunbook";
import { executeTask } from "client/executeTask";
import { Fetcher } from "client/fetcher";
import { TaskOrRunbookReviewersResponse } from "client/types";
import { Button } from "components/button/Button";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { Loader } from "components/loader/Loader";
import { showNotification } from "components/notification/showNotification";
import { showRunnableErrorNotification } from "components/notification/showRunnableErrorNotification";
import { ExecuteError, getFullQuery, getSlug } from "components/query";
import { RequestDialogContext } from "components/requestDialog/RequestDialogProvider";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";
import { Tooltip } from "components/tooltip/Tooltip";
import { FormProvider } from "state/components/form/FormProvider";
import { FormInputs, useFormInputs } from "state/components/form/useFormInputs";
import { useFormState } from "state/components/form/useFormState";
import { useComponentId } from "state/components/useId";
import { useRefetchTasks } from "state/tasks/useRefetchTask";

import {
  FieldOption,
  FormBaseProps,
  FormProps,
  FormWithRunnableProps,
  RunbookOptions,
  State,
  TaskOptions,
} from "./Form.types";
import { parameterToInput, validateParameterOptions } from "./parameters";

export const Form = <TOutput = DefaultOutput,>({
  id: propId,
  children,
  ...props
}: FormProps<TOutput>) => {
  const id = useComponentId(propId);
  return (
    <ComponentErrorBoundary componentName={Form.displayName}>
      <FormProvider>
        {"task" in props || "runbook" in props ? (
          <FormWithRunnable<TOutput> id={id} {...props}>
            {children}
          </FormWithRunnable>
        ) : (
          <InnerForm id={id} {...props}>
            {children}
          </InnerForm>
        )}
      </FormProvider>
    </ComponentErrorBoundary>
  );
};

Form.displayName = "Form";

const FormWithRunnable = <TOutput,>({
  children,
  onSubmit,
  beforeSubmitTransform,
  disabled,
  task,
  runbook,
  ...props
}: FormWithRunnableProps<TOutput>) => {
  if (task && runbook) {
    throw new Error("form cannot be backed by both task and runbook");
  }
  const runnableDef = task || runbook!;
  const opts: TaskOptions<TOutput> | RunbookOptions = useMemo(
    () =>
      typeof runnableDef === "string"
        ? { slug: runnableDef }
        : typeof runnableDef === "function"
        ? { slug: getSlug(getFullQuery(runnableDef)) }
        : "fn" in runnableDef
        ? { ...runnableDef, slug: getSlug(getFullQuery(runnableDef.fn)) }
        : runnableDef,
    [runnableDef],
  );
  const prefix = `${props.id}.`;
  const requestDialogContext = useContext(RequestDialogContext);
  const getRunnableEndpoint = task ? TASKS_GET_TASK_REVIEWERS : RUNBOOKS_GET;
  const [loading, setLoading] = useState(false);
  const refetchTasks = useRefetchTasks();

  const { data: permissionsData, status: permissionsStatus } = useQuery(
    [PERMISSIONS_GET, opts.slug],
    async () => {
      const fetcher = new Fetcher();
      return await fetcher.get<{ resource: Record<string, boolean> }>(
        PERMISSIONS_GET,
        {
          task_slug: task && opts.slug,
          runbook_slug: runbook && opts.slug,
          actions: task
            ? ["tasks.execute", "tasks.request_run"]
            : ["runbooks.execute", "trigger_requests.create"],
        },
      );
    },
  );

  const {
    data: runnableData,
    isLoading: runnableDataIsLoading,
    error: runnableDataError,
  } = useQuery<TaskOrRunbookReviewersResponse, HTTPError>(
    [getRunnableEndpoint, opts.slug],
    async () => {
      const fetcher = new Fetcher();
      return await fetcher.get<TaskOrRunbookReviewersResponse>(
        getRunnableEndpoint,
        {
          taskSlug: task && opts.slug,
          runbookSlug: runbook && opts.slug,
        },
      );
    },
  );

  const params =
    runnableData?.task?.parameters.parameters ||
    runnableData?.runbook?.parameters.parameters;

  const components = useMemo(() => {
    const visibleParams = params?.filter(
      (v) =>
        (!opts.shownFields || opts.shownFields.includes(v.slug)) &&
        (!opts.hiddenFields || !opts.hiddenFields.includes(v.slug)),
    );
    return visibleParams?.map((param, index) => {
      return parameterToInput(
        param,
        index,
        prefix,
        opts.fieldOptions?.find((opt: FieldOption) => param.slug === opt.slug),
      );
    });
  }, [params, opts, prefix]);

  if (runnableDataError) {
    return (
      <InnerForm {...props} disabled>
        <Text color="error">{runnableDataError.message}</Text>
        {children}
      </InnerForm>
    );
  }
  if (
    runnableDataIsLoading ||
    !runnableData ||
    permissionsStatus === "loading" ||
    !params
  ) {
    return (
      <InnerForm {...props} disabled>
        <Loader />
        {children}
      </InnerForm>
    );
  }

  const error = validateParameterOptions<TOutput>(params, opts);
  if (error) {
    return (
      <InnerForm {...props}>
        <Text color="error">{error}</Text>
        {children}
      </InnerForm>
    );
  }

  const paramMetadata = Object.fromEntries(
    params.map((v, i) => {
      return [v.slug, v.type];
    }),
  );

  const { canExecute, canRequest } = task
    ? processPermissionsQueryResult(
        permissionsStatus,
        permissionsData!.resource["tasks.execute"],
        permissionsData!.resource["tasks.request_run"],
      )
    : processPermissionsQueryResult(
        permissionsStatus,
        permissionsData!.resource["runbooks.execute"],
        permissionsData!.resource["trigger_requests.create"],
      );

  const newOnSubmit = (formValues: State) => {
    // Make shallow copy of formValues
    formValues = { ...formValues };

    // Add back fixed value options
    if (opts.fieldOptions) {
      for (const option of opts.fieldOptions) {
        if (option.value !== undefined) {
          formValues[option.slug] = option.value;
        }
      }
    }
    const paramValues = Object.fromEntries(
      Object.entries(formValues)
        // Get rid of extraneous entries
        .filter(([key, _]) => {
          return key in paramMetadata;
        })
        // Extract the first element of file inputs
        .map(([key, val]) => {
          if (paramMetadata[key] === "upload") {
            const fileVal = val as File | File[];
            return [key, Array.isArray(fileVal) ? fileVal[0] : fileVal];
          } else {
            return [key, val];
          }
        }),
    );

    const executeRunnable = async () => {
      setLoading(true);
      const executeResult: {
        output?: TOutput;
        error?: ExecuteError;
        runID?: string;
        sessionID?: string;
      } = task
        ? await executeTask(opts.slug, "mutation", paramValues)
        : await executeRunbook(opts.slug, "mutation", paramValues);
      if (executeResult.error) {
        showRunnableErrorNotification({
          ...executeResult,
          error: executeResult.error,
          slug: opts.slug,
        });
        setLoading(false);
        if ("onError" in opts) {
          opts.onError?.(
            executeResult.output,
            executeResult.error,
            executeResult.runID,
          );
        }
      } else {
        showNotification({
          title: `Successful ${task ? "run" : "session"}`,
          message: opts.slug,
          type: "success",
        });
        setLoading(false);
        if ("refetchTasks" in opts && opts.refetchTasks) {
          refetchTasks(opts.refetchTasks);
        }
        if (
          "onSuccess" in opts &&
          executeResult.runID &&
          executeResult.output !== undefined
        ) {
          opts.onSuccess?.(executeResult.output, executeResult.runID);
        }
      }
    };
    if (canExecute) {
      executeRunnable();
    } else if (canRequest) {
      requestDialogContext.setState({
        params: paramValues,
        taskSlug: task && opts.slug,
        runbookSlug: runbook && opts.slug,
        opened: true,
      });
    }
    onSubmit?.(formValues);
  };

  const newBeforeSubmitTransform = (rawFormValues: State) => {
    const maybeRemovePrefix = (k: string) =>
      k.startsWith(prefix) ? k.substring(prefix.length) : k;

    const valuesWithoutPrefix = Object.fromEntries(
      Object.entries(rawFormValues).map(([k, v]) => [maybeRemovePrefix(k), v]),
    );

    return beforeSubmitTransform
      ? beforeSubmitTransform(valuesWithoutPrefix)
      : valuesWithoutPrefix;
  };

  const disabledBecauseOfPermissions = !canRequest && !canExecute;
  const isDisabled = disabled || disabledBecauseOfPermissions;
  return (
    <InnerForm
      submitting={loading}
      disabled={isDisabled}
      disabledMessage={
        disabledBecauseOfPermissions
          ? "Missing request and execute permissions"
          : undefined
      }
      onSubmit={newOnSubmit}
      beforeSubmitTransform={newBeforeSubmitTransform}
      {...props}
    >
      {components}
      {children}
    </InnerForm>
  );
};

const InnerForm = ({
  id,
  children,
  submitText = "Submit",
  onSubmit,
  beforeSubmitTransform,
  resetOnSubmit = true,
  disabled,
  disabledMessage,
  submitting,
  className,
  style,
  width,
  height,
  grow,
}: FormBaseProps & {
  disabledMessage?: string;
}) => {
  const formInputs = useFormInputs();
  const { values } = useFormState(id);
  const { classes: layoutClasses, cx } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  return (
    <form
      style={style}
      className={cx(layoutClasses.style, className)}
      onSubmit={(e) => {
        if (!hasErrors(formInputs)) {
          if (resetOnSubmit) {
            resetInputs(formInputs);
          }
          setShowErrors(formInputs, false);
          onSubmit?.(
            beforeSubmitTransform ? beforeSubmitTransform(values) : values,
          );
        } else {
          setShowErrors(formInputs, true);
        }
        e.preventDefault();
      }}
      noValidate
    >
      <Stack>
        {children}
        <Stack direction="row" justify="end">
          <Tooltip
            label={disabledMessage}
            wrapper="div"
            disabled={!disabledMessage}
          >
            <Button
              type="submit"
              loading={submitting}
              disabled={
                disabled || !!disabledMessage || isButtonDisabled(formInputs)
              }
            >
              {submitText}
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </form>
  );
};

const setShowErrors = (formInputs: FormInputs, showErrors: boolean) => {
  for (const { state } of Object.values(formInputs)) {
    state.setShowErrors(showErrors);
  }
};

const resetInputs = (formInputs: FormInputs) => {
  for (const { state } of Object.values(formInputs)) {
    state.reset();
  }
};

const hasErrors = (formInputs: FormInputs) =>
  Object.values(formInputs).some((state) => state.state.errors.length > 0);

const isButtonDisabled = (formInputs: FormInputs) =>
  Object.values(formInputs).some(
    (state) => state.state.errors.length > 0 && state.state.showErrors,
  );

function processPermissionsQueryResult(
  status: string,
  apiCanExecute: boolean,
  apiCanRequest: boolean,
): { canExecute: boolean; canRequest: boolean } {
  let canExecute = true;
  let canRequest = false;
  if (status === "success") {
    canExecute = apiCanExecute;
    canRequest = apiCanRequest;
  }
  return { canExecute, canRequest };
}
