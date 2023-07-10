import { useState } from "react";

import { DialogComponent } from "components/dialog/Dialog";
import { HeadingComponent } from "components/heading/Heading";
import { getIsLocalDev } from "getIsLocalDev";
import { useToggleModal } from "message/useToggleModal";

import { useStyles } from "./ErrorModal.styles";
import { ErrorStackTraceProps, ErrorStackTrace } from "./ErrorStackTrace";

export type ErrorFallbackProps = {
  errorID: string;
} & ErrorStackTraceProps;

export const ErrorFallback = ({
  error,
  errorInfo,
  errorID,
}: ErrorFallbackProps) => {
  const isLocalDev = getIsLocalDev();
  const [opened, setOpened] = useState(isLocalDev);
  useToggleModal(setOpened, errorID);

  const { classes } = useStyles();
  return (
    <DialogComponent
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <HeadingComponent level={4} className={classes.title}>
          Something went wrong
        </HeadingComponent>
      }
      size="100%"
      classNames={{ modal: classes.modal }}
      trapFocus={false}
    >
      <ErrorStackTrace error={error} errorInfo={errorInfo} />
    </DialogComponent>
  );
};
