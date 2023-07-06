import { Button as MantineButton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import type { RunStatus, SessionStatus } from "airplane/api";
import * as React from "react";
import {
  forwardRef,
  MouseEvent,
  ReactElement,
  Ref,
  useCallback,
  useEffect,
  useState,
} from "react";

import { DefaultOutput, DefaultParams, ParamValues } from "client";
import { PERMISSIONS_GET } from "client/endpoints";
import { Fetcher } from "client/fetcher";
import { ConfirmationComponent } from "components/dialog/Confirmation";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { ArrowTopRightOnSquareIconMini } from "components/icon";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { showNotification } from "components/notification/showNotification";
import { showRunnableErrorNotification } from "components/notification/showRunnableErrorNotification";
import { RequestRunnableDialog } from "components/requestDialog/RequestRunnableDialog";
import { Text } from "components/text/Text";
import { Color } from "components/theme/colors";
import { Tooltip } from "components/tooltip/Tooltip";
import { useRouter } from "routing";
import { useButtonState } from "state/components/button";
import { useComponentId } from "state/components/useId";
import {
  RunbookMutationState,
  useRunbookMutation,
} from "state/tasks/useRunbookMutation";
import { MutationState, useTaskMutation } from "state/tasks/useTaskMutation";

import { useStyles } from "./Button.styles";
import {
  ButtonComponentBaseProps,
  ButtonComponentButtonProps,
  ButtonComponentLinkProps,
  ButtonComponentProps,
  ButtonConfirmOptions,
  ButtonPreset,
  ButtonProps,
  ButtonPropsWithRunbook,
  ButtonPropsWithTask,
  ButtonVariant,
} from "./Button.types";
import {
  ExecuteError,
  getFullMutation,
  getRunbookFullMutation,
  getSlug,
} from "../query";

/**
 * ButtonC is around to support generics with React.forwardRef.
 * See https://stackoverflow.com/a/58473012 for more info
 */
const ButtonC = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  props: ButtonProps<TParams, TOutput>,
  ref: Ref<
    typeof props extends ButtonComponentLinkProps
      ? HTMLAnchorElement
      : HTMLButtonElement
  >,
) => (
  <ComponentErrorBoundary componentName={"Button"}>
    <ButtonWithoutRef {...props} innerRef={ref} />
  </ComponentErrorBoundary>
);

export const Button = forwardRef(ButtonC) as <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  props: ButtonProps<TParams, TOutput> & {
    ref?: Ref<HTMLAnchorElement | HTMLButtonElement>;
  },
) => ReactElement;

export function ButtonWithoutRef<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  props: ButtonProps<TParams, TOutput> & {
    innerRef: React.Ref<HTMLAnchorElement | HTMLButtonElement>;
  },
) {
  const id = useComponentId(props.id);
  const { setResult } = useButtonState(id);
  if (doesUseTask<TParams, TOutput>(props)) {
    return <ButtonWithTask {...props} setResult={setResult} />;
  } else if (doesUseRunbook<TParams>(props)) {
    return <ButtonWithRunbook {...props} setResult={setResult} />;
  } else {
    const { innerRef, ...restProps } = props;
    return <ButtonComponent ref={innerRef} {...restProps} />;
  }
}

/**
 * UnconnectedButton is a task-aware button that is not connected to the global component state.
 *
 * This should be used sparingly - mostly for buttons that are created dynamically within other components.
 * */
export function UnconnectedButton<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(props: ButtonProps<TParams, TOutput>) {
  if (doesUseTask<TParams, TOutput>(props)) {
    return <ButtonWithTask {...props} />;
  } else if (doesUseRunbook<TParams>(props)) {
    return <ButtonWithRunbook {...props} />;
  } else {
    return <ButtonComponent {...props} />;
  }
}

/**
 * ButtonWithTask is a button that executes a task on click.
 */
const ButtonWithTask = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>({
  innerRef,
  setResult,
  confirm,
  onClick,
  ...restProps
}: ButtonPropsWithTask<TParams, TOutput> & {
  setResult?: (result: MutationState<TOutput>) => void;
} & {
  innerRef?: React.Ref<HTMLButtonElement>;
}) => {
  const fullMutation = getFullMutation<TParams>(restProps.task);
  const slug = getSlug(fullMutation);
  const [dialogOpened, setDialogOpened] = React.useState(false);

  const { onSuccess: fullMutationOnSuccess, onError: fullMutationOnError } =
    fullMutation ?? {};

  const onSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output: any, runID: string) => {
      setResult?.({ output, runID });
      fullMutationOnSuccess?.(output, runID);
      showNotification({
        title: `Successful run`,
        message: slug,
        type: "success",
      });
    },
    [setResult, fullMutationOnSuccess, slug],
  );
  const onError = useCallback(
    (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      output: any,
      error: ExecuteError,
      runID?: string,
      status?: RunStatus,
    ) => {
      setResult?.({ output, error, runID });
      fullMutationOnError?.(output, error, runID);
      showRunnableErrorNotification({ error, runID, slug });
    },
    [setResult, fullMutationOnError, slug],
  );

  const { mutate, loading } = useTaskMutation<TParams, TOutput>({
    ...fullMutation,
    onSuccess,
    onError,
  });

  const { data, status } = useQuery([PERMISSIONS_GET, slug], async () => {
    const fetcher = new Fetcher();
    return await fetcher.get<{ resource: Record<string, boolean> }>(
      PERMISSIONS_GET,
      {
        task_slug: slug,
        actions: ["tasks.execute", "tasks.request_run"],
      },
    );
  });
  const { canExecute, canRequest, disabled } = processPermissionsQueryResult(
    status,
    data?.resource["tasks.execute"],
    data?.resource["tasks.request_run"],
  );
  const confirmOptions = processConfirm(confirm, slug);

  const newOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (status === "error" || canExecute) {
        mutate();
      } else if (canRequest) {
        setDialogOpened(true);
      }
      onClick?.(e);
    },
    [status, canExecute, canRequest, mutate, onClick],
  );

  return (
    <>
      <Tooltip
        label={
          status === "success"
            ? "Missing request and execute permissions"
            : "Loading permissions..."
        }
        wrapper="div"
        position="bottom-start"
        disabled={!disabled}
      >
        <ButtonComponent
          ref={innerRef}
          disabled={disabled}
          loading={loading}
          onClick={newOnClick}
          confirm={canExecute && confirmOptions}
          {...restProps}
        />
      </Tooltip>
      <RequestRunnableDialog
        opened={dialogOpened}
        onSubmit={() => setDialogOpened(false)}
        onClose={() => setDialogOpened(false)}
        taskSlug={slug}
        paramValues={fullMutation.params || {}}
      />
    </>
  );
};

/**
 * ButtonWithRunbook is a button that executes a runbook on click.
 */
const ButtonWithRunbook = <
  TParams extends ParamValues | undefined = DefaultParams,
>({
  innerRef,
  setResult,
  confirm,
  onClick,
  ...restProps
}: ButtonPropsWithRunbook<TParams> & {
  setResult?: (result: RunbookMutationState) => void;
} & {
  innerRef?: React.Ref<HTMLButtonElement>;
}) => {
  const fullMutation = getRunbookFullMutation<TParams>(restProps.runbook);
  const slug = fullMutation.slug;
  const [dialogOpened, setDialogOpened] = React.useState(false);

  const { onSuccess: fullMutationOnSuccess, onError: fullMutationOnError } =
    fullMutation ?? {};

  const onSuccess = useCallback(
    (sessionID: string) => {
      setResult?.({
        sessionID,
      });
      fullMutationOnSuccess?.(sessionID);
      showNotification({
        title: `Successful session`,
        message: slug,
        type: "success",
      });
    },
    [setResult, fullMutationOnSuccess, slug],
  );
  const onError = useCallback(
    (error: ExecuteError, sessionID?: string, status?: SessionStatus) => {
      setResult?.({ error, sessionID });
      fullMutationOnError?.(error, sessionID);
      showRunnableErrorNotification({ error, sessionID, slug });
    },
    [setResult, fullMutationOnError, slug],
  );

  const { mutate, loading } = useRunbookMutation<TParams>({
    ...fullMutation,
    onSuccess,
    onError,
  });

  const { data, status } = useQuery([PERMISSIONS_GET, slug], async () => {
    const fetcher = new Fetcher();
    return await fetcher.get<{ resource: Record<string, boolean> }>(
      PERMISSIONS_GET,
      {
        runbook_slug: slug,
        actions: ["runbooks.execute", "trigger_requests.create"],
      },
    );
  });
  const { canExecute, canRequest, disabled } = processPermissionsQueryResult(
    status,
    data?.resource["runbooks.execute"],
    data?.resource["trigger_requests.create"],
  );
  const confirmOptions = processConfirm(confirm, slug);

  const newOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (status === "error" || canExecute) {
        mutate();
      } else if (canRequest) {
        setDialogOpened(true);
      }
      onClick?.(e);
    },
    [status, canExecute, canRequest, mutate, onClick],
  );

  return (
    <>
      <Tooltip
        label={
          status === "success"
            ? "Missing request and execute permissions"
            : "Loading permissions..."
        }
        wrapper="div"
        position="bottom-start"
        disabled={!disabled}
      >
        <ButtonComponent
          ref={innerRef}
          disabled={disabled}
          loading={loading}
          onClick={newOnClick}
          confirm={canExecute && confirmOptions}
          {...restProps}
        />
      </Tooltip>
      <RequestRunnableDialog
        opened={dialogOpened}
        onSubmit={() => setDialogOpened(false)}
        onClose={() => setDialogOpened(false)}
        runbookSlug={slug}
        paramValues={fullMutation.params || {}}
      />
    </>
  );
};

/**
 * Presentational button component
 */
export const ButtonComponent = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonComponentProps
>(
  (
    {
      preset = "primary",
      leftAlign,
      disableFocusRing,
      width,
      height,
      grow,
      className,
      style,
      ...props
    }: ButtonComponentProps,
    ref,
  ) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [clickEvent, setClickEvent] = useState<
      MouseEvent<HTMLButtonElement> | undefined
    >();

    const presetStyle = buttonPreset[preset];
    const variant = props.variant || presetStyle.variant;
    const color = props.color || presetStyle.color;
    const { classes, cx } = useStyles({ color, variant });
    const { classes: layoutClasses } = useCommonLayoutStyle({
      width,
      height,
      grow,
    });

    const onClickWithConfirmation = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (!isButton(props)) {
          return;
        }
        const onClick = props.onClick;
        if (props.confirm) {
          setShowConfirmation(true);
          setClickEvent(e);
          const confirmOptions =
            typeof props.confirm === "boolean" ? {} : props.confirm;
          confirmOptions.onClick?.(e);
        } else {
          onClick?.(e);
        }
        if (props.stopPropagation) {
          e.stopPropagation();
        }
      },
      [props],
    );

    if (isAnchor(props)) {
      return (
        <LinkButtonComponent
          ref={ref as React.Ref<HTMLAnchorElement>}
          leftAlign={leftAlign}
          disableFocusRing={disableFocusRing}
          width={width}
          height={height}
          grow={grow}
          className={className}
          style={style}
          {...props}
          color={color}
          variant={variant}
        />
      );
    } else if (isButton(props)) {
      const { confirm, ...rest } = props;
      const confirmOptions = typeof confirm === "boolean" ? {} : confirm;
      if (confirmOptions && !confirmOptions.body && !confirmOptions.title) {
        confirmOptions.title = "Are you sure?";
      }
      return (
        <>
          <MantineButton
            component="button"
            ref={ref as React.Ref<HTMLButtonElement>}
            {...rest}
            loaderPosition="center"
            onClick={onClickWithConfirmation}
            color={color}
            variant={variant}
            className={cx(layoutClasses.style, className)}
            style={style}
            classNames={{
              root: cx({
                [classes.disableFocusRing]: disableFocusRing,
                [classes.recolorRoot]: !disableFocusRing,
              }),
              inner: cx({ [classes.leftAlign]: leftAlign }),
            }}
          />
          <ConfirmationComponent
            opened={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={() => {
              setShowConfirmation(false);
              props.onClick?.(clickEvent!);
              setClickEvent(undefined);
            }}
            cancelText={confirmOptions?.cancelText}
            confirmText={confirmOptions?.confirmText}
            title={confirmOptions?.title}
          >
            {confirmOptions?.body ?? null}
          </ConfirmationComponent>
        </>
      );
    }
    return null;
  },
);
ButtonComponent.displayName = "ButtonComponent";

/**
 * Link Presentational button component
 */
const LinkButtonComponent = forwardRef<
  HTMLAnchorElement,
  ButtonComponentLinkProps
>(
  (
    {
      href,
      newTab,
      target: userTarget,
      disabled,
      color,
      variant,
      leftAlign,
      disableFocusRing,
      width,
      height,
      grow,
      className,
      style,
      ...props
    }: ButtonComponentLinkProps,
    ref,
  ) => {
    const { classes, cx } = useStyles({ color, variant });
    const { classes: layoutClasses } = useCommonLayoutStyle({
      width,
      height,
      grow,
    });

    const [buttonHref, setButtonHref] = useState(() =>
      typeof href === "string" ? href : "",
    );
    const { getHref } = useRouter();
    useEffect(() => {
      const getButtonHref = async () => {
        if (typeof href !== "string") {
          const rhr = await getHref(href);
          setButtonHref(rhr);
        } else {
          setButtonHref(href);
        }
      };
      getButtonHref();
    }, [href, getHref]);

    const targetNewTab = newTab == null ? true : newTab;
    const target = userTarget ?? targetNewTab ? "_blank" : "_top";

    return (
      <MantineButton
        className={cx(layoutClasses.style, className)}
        style={style}
        classNames={{
          root: cx({
            [classes.disableFocusRing]: disableFocusRing,
            [classes.recolorRoot]: !disableFocusRing,
          }),
          inner: cx({ [classes.leftAlign]: leftAlign }),
        }}
        variant={variant}
        color={color}
        component="a"
        ref={ref}
        target={target}
        rightIcon={
          target === "_blank" ? <ArrowTopRightOnSquareIconMini /> : undefined
        }
        href={buttonHref}
        disabled={!buttonHref || disabled}
        {...props}
        loaderPosition="center"
      />
    );
  },
);
LinkButtonComponent.displayName = "LinkButtonComponent";

const isAnchor = (
  props: ButtonComponentProps,
): props is ButtonComponentBaseProps &
  ButtonComponentLinkProps & {
    innerRef?: React.Ref<HTMLAnchorElement>;
  } => {
  return !!(props as ButtonComponentLinkProps).href;
};

const isButton = (
  props: ButtonComponentProps,
): props is ButtonComponentBaseProps &
  ButtonComponentButtonProps & {
    innerRef?: React.Ref<HTMLButtonElement>;
  } => {
  return !(props as ButtonComponentLinkProps).href;
};

function doesUseTask<TParams extends ParamValues | undefined, TOutput>(
  props: ButtonProps<TParams, TOutput>,
): props is ButtonPropsWithTask<TParams, TOutput> & {
  innerRef: React.Ref<HTMLButtonElement>;
} {
  return Boolean((props as ButtonPropsWithTask<TParams, TOutput>).task);
}

function doesUseRunbook<TParams extends ParamValues | undefined>(
  props: ButtonProps<TParams>,
): props is ButtonPropsWithRunbook<TParams> & {
  innerRef: React.Ref<HTMLButtonElement>;
} {
  return Boolean((props as ButtonPropsWithRunbook<TParams>).runbook);
}

function processConfirm(
  confirm: undefined | boolean | ButtonConfirmOptions,
  slug: string,
): undefined | ButtonConfirmOptions {
  const confirmOptions = typeof confirm === "boolean" ? {} : confirm;
  if (confirmOptions) {
    if (confirmOptions.body === undefined) {
      confirmOptions.body = (
        <Text>
          Are you sure you want to run <b>{slug}?</b>
        </Text>
      );
    }
    if (confirmOptions.title === undefined) {
      confirmOptions.title = slug;
    }
    confirmOptions.confirmText = confirmOptions?.confirmText ?? "Run";
  }
  return confirmOptions;
}

function processPermissionsQueryResult(
  status: string,
  apiCanExecute: boolean | undefined,
  apiCanRequest: boolean | undefined,
): { canExecute: boolean; canRequest: boolean; disabled: boolean } {
  let canExecute = false;
  let canRequest = false;
  if (status === "success") {
    canExecute = apiCanExecute!;
    canRequest = apiCanRequest!;
  }
  const disabled =
    status === "loading" ||
    (status === "success" && !canExecute && !canRequest);
  return { canExecute, canRequest, disabled };
}

const buttonPreset: Record<
  ButtonPreset,
  { variant: ButtonVariant; color: Color }
> = {
  primary: { variant: "filled", color: "primary" },
  danger: { variant: "filled", color: "error" },
  secondary: { variant: "light", color: "primary" },
  tertiary: { variant: "outline", color: "secondary" },
};
