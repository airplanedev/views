import { useState } from "react";

import { DialogComponent } from "components/dialog/Dialog";
import { HeadingComponent } from "components/heading/Heading";
import { StackComponent } from "components/stack/Stack";
import { getIsLocalDev } from "getIsLocalDev";
import { useToggleModal } from "message/useToggleModal";

import { ComponentErrorState } from "./ComponentErrorState";
import { useStyles as useErrorModalStyles } from "./ErrorModal.styles";
import { ErrorStackTraceProps, ErrorStackTrace } from "./ErrorStackTrace";
import { LatestRunDetails, LatestRun } from "./LatestRunDetails";

export type ComponentErrorFallbackProps = {
  componentName?: string;
  latestRun?: LatestRun;
  errorID: string;
} & ErrorStackTraceProps;

export const ComponentErrorFallback = ({
  error,
  errorInfo,
  componentName,
  latestRun,
  errorID,
}: ComponentErrorFallbackProps) => {
  const isLocalDev = getIsLocalDev();
  const [opened, setOpened] = useState(isLocalDev);
  useToggleModal(setOpened, errorID);

  return (
    <>
      <ComponentErrorModal
        error={error}
        errorInfo={errorInfo}
        componentName={componentName}
        latestRun={latestRun}
        opened={opened}
        setOpened={setOpened}
      />
      <ComponentErrorState
        componentName={componentName}
        onClick={() => setOpened(true)}
      />
    </>
  );
};

type ComponentErrorModalProps = {
  componentName?: string;
  latestRun?: LatestRun;
  opened: boolean;
  setOpened: (opened: boolean) => void;
} & ErrorStackTraceProps;

export const ComponentErrorModal = ({
  error,
  errorInfo,
  componentName,
  latestRun,
  opened,
  setOpened,
}: ComponentErrorModalProps) => {
  const { classes } = useErrorModalStyles();
  return (
    <DialogComponent
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <HeadingComponent level={4} className={classes.title}>
          Something went wrong{" "}
          {componentName ? ` in the ${componentName} component` : ""}
        </HeadingComponent>
      }
      size="100%"
      classNames={{ modal: classes.modal }}
      trapFocus={false}
    >
      <StackComponent>
        <ErrorStackTrace error={error} errorInfo={errorInfo} />
        {latestRun && <LatestRunDetails {...latestRun} />}
      </StackComponent>
    </DialogComponent>
  );
};
