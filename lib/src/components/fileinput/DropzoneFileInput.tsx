import { createStyles, Input, Progress } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { AirplaneFile } from "airplane";
import prettyBytes from "pretty-bytes";
import { forwardRef, Ref } from "react";

import { Card } from "components/card/Card";
import {
  ArrowUpTrayIcon,
  DocumentCheckIconOutline,
  XMarkIcon,
} from "components/icon";
import { showNotification } from "components/notification/showNotification";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";
import { COLORS } from "components/theme/colors";

import { FileInputComponentProps } from "./FileInput.types";
import { useUploadAirplaneFiles } from "./useUploadAirplaneFiles";

const useStyles = createStyles((theme) => ({
  disabled: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[2],
    cursor: "not-allowed",

    "& *": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[5],
    },
  },
  error: {
    borderColor: "red",
  },
}));

const Preview = (props: {
  fname: string;
  fsize: number;
  progress?: number;
}) => {
  return (
    <Card p={0}>
      <Stack align="center" spacing="sm" direction="row" sx={{ padding: 8 }}>
        <Stack align="center">
          <DocumentCheckIconOutline size="lg" />
        </Stack>
        <Text lineClamp={1}>{props.fname}</Text>
        <Text>{`(${prettyBytes(props.fsize)})`}</Text>
      </Stack>
      {props.progress !== undefined && (
        <Progress value={props.progress} size="xs" />
      )}
    </Card>
  );
};

export const DropzoneFileInputComponent = forwardRef(
  (
    {
      disableDragAndDrop,
      clearable,
      multiple = false,
      label,
      placeholder,
      description,
      error,
      value,
      id,
      onChange,
      required,
      getUploadURL,
      className,
      style,
      ...restProps
    }: FileInputComponentProps & {
      id?: string;
      required?: boolean;
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    const { classes, cx } = useStyles();

    const canonicalValue = value instanceof AirplaneFile ? [value] : value;

    const { onDrop, uploads } = useUploadAirplaneFiles({
      onChange,
      onLoad: (file) =>
        showNotification({
          title: "Upload successful",
          message: `${file.name} uploaded successfully`,
          type: "success",
        }),
      onError: (file, e) =>
        showNotification({
          title: "Upload failed",
          message: `${file.name} upload failed: ${
            (e as { message: string }).message
          }`,
          type: "error",
        }),
      getUploadURL,
    });
    const effectiveFiles = uploads.length ? uploads : canonicalValue || uploads;
    const dropzoneClassName = restProps.disabled
      ? classes.disabled
      : error
      ? classes.error
      : undefined;
    // Omit clearable to avoid React warning on non-boolean attribute.
    return (
      <Stack spacing="xs" sx={{ fontSize: 14 }}>
        <Stack direction="row" grow>
          <Stack
            direction="row"
            spacing="xs"
            sx={{ fontWeight: 500, color: COLORS.gray[7] }}
          >
            {typeof label === "string" ? (
              <Input.Label htmlFor={id}>{label}</Input.Label>
            ) : (
              label
            )}
            {required && (
              <Text color="red" disableMarkdown>
                *
              </Text>
            )}
          </Stack>
          <Stack align="end">
            {clearable && effectiveFiles.length > 0 && (
              <XMarkIcon
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onChange([]);
                }}
              />
            )}
          </Stack>
        </Stack>
        <Dropzone
          className={cx(className, dropzoneClassName)}
          style={style}
          onDrop={onDrop}
          activateOnDrag={!disableDragAndDrop}
          multiple={multiple}
          ref={ref}
          {...restProps}
        >
          <Stack align="center">
            <Dropzone.Accept>
              <Stack align="center">
                <ArrowUpTrayIcon size="xl" color="blue" />
              </Stack>
              <Text color="blue">{placeholder || "Drop to upload"}</Text>
            </Dropzone.Accept>
            <Dropzone.Reject>
              <Stack align="center">
                <XMarkIcon size="xl" color="red" />
              </Stack>
              <Text color="red">{placeholder || "Drop to upload"}</Text>
            </Dropzone.Reject>
            <Dropzone.Idle>
              {effectiveFiles.length ? (
                <Stack>
                  {effectiveFiles.map(
                    (
                      f: AirplaneFile | { percent: number; file: AirplaneFile },
                      i,
                    ) =>
                      f instanceof AirplaneFile ? (
                        <Preview key={i} fname={f.name} fsize={f.size} />
                      ) : (
                        <Preview
                          key={i}
                          fname={f.file.name}
                          fsize={f.file.size}
                          progress={f.percent}
                        />
                      ),
                  )}
                </Stack>
              ) : (
                <>
                  <Stack align="center">
                    <ArrowUpTrayIcon size="xl" />
                  </Stack>
                  <Text>{placeholder || "Click or drag to upload"}</Text>
                </>
              )}
            </Dropzone.Idle>
          </Stack>
        </Dropzone>
        {typeof description === "string" ? (
          <Text sx={{ color: COLORS.gray[6] }}>{description}</Text>
        ) : (
          description
        )}
        {typeof error === "string" ? <Text color="red">{error}</Text> : error}
      </Stack>
    );
  },
);

DropzoneFileInputComponent.displayName = "FileInputComponent";
