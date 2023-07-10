import { Modal as MantineModal, useMantineTheme } from "@mantine/core";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { Heading } from "components/heading/Heading";
import { Text } from "components/text/Text";
import { useDialogState } from "state/components/dialog";
import { useComponentId } from "state/components/useId";

import { ComponentProps, Props } from "./Dialog.types";

export const Dialog = ({ defaultOpened, id: propId, ...props }: Props) => {
  const id = useComponentId(propId);
  const { opened, close } = useDialogState(id, {
    initialState: {
      opened: props.opened ?? defaultOpened,
    },
  });
  return (
    <ComponentErrorBoundary componentName={Dialog.displayName}>
      <DialogComponent opened={opened} onClose={close} {...props} />
    </ComponentErrorBoundary>
  );
};

Dialog.displayName = "Dialog";

export const DialogComponent = ({
  padding = "lg",
  size = "md",
  radius = "lg",
  title,
  children,
  trapFocus = true,
  ...props
}: ComponentProps) => {
  const theme = useMantineTheme();
  let t = title;
  if (typeof t === "string") {
    t = (
      <Heading level={5} style={{ margin: 0 }}>
        {t}
      </Heading>
    );
  }

  let body = children;
  if (typeof body === "string") {
    body = <Text>{body}</Text>;
  }

  return (
    <MantineModal
      padding={padding}
      size={size}
      radius={radius}
      title={t}
      overlayOpacity={0.75}
      overlayColor={theme.colors.gray[5]}
      trapFocus={trapFocus}
      {...props}
    >
      {body}
    </MantineModal>
  );
};
