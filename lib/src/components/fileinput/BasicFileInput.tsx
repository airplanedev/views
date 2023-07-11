import { FileInput as MantineFileInput, LoadingOverlay } from "@mantine/core";
import { AirplaneFile } from "airplane";
import { forwardRef, ReactNode, useCallback, useState } from "react";

import { showNotification } from "components/notification/showNotification";
import { FileInputTValue } from "state/components/file-input/reducer";

import { FileInputComponentProps } from "./FileInput.types";
import { useUploadAirplaneFiles } from "./useUploadAirplaneFiles";

export const BasicFileInputComponent = forwardRef<
  HTMLButtonElement,
  FileInputComponentProps
>(
  (
    {
      accept,
      getUploadURL,
      value,
      onChange,
      ...restProps
    }: FileInputComponentProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const [loading, setLoading] = useState(false);
    const { onDrop } = useUploadAirplaneFiles({
      onChange,
      onLoad: (file) => {
        setLoading(false);
        showNotification({
          title: "Upload successful",
          message: `${file.name} uploaded successfully`,
          type: "success",
        });
      },
      onError: (file, e) => {
        setLoading(false);
        showNotification({
          title: "Upload failed",
          message: `${file.name} upload failed: ${
            (e as { message: string }).message
          }`,
          type: "error",
        });
      },
      getUploadURL,
    });
    const onMantineChange = (f: File[] | File | null) => {
      if (f === null) {
        onDrop([]);
      } else if (f instanceof File) {
        setLoading(true);
        onDrop([f]);
      } else {
        setLoading(true);
        onDrop(f);
      }
    };
    const container = useCallback(
      (children: ReactNode) => {
        return (
          <div style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} /> {children}
          </div>
        );
      },
      [loading],
    );
    return (
      <MantineFileInput
        accept={accept?.join(",")}
        value={componentValueToMantineValue(value)}
        onChange={onMantineChange}
        inputContainer={container}
        {...restProps}
        ref={ref}
      />
    );
  },
);

const componentValueToMantineValue = (
  v: FileInputTValue,
): File[] | File | null => {
  if (v === undefined) {
    return null;
  } else if (v instanceof AirplaneFile) {
    return new File([], v.name);
  } else {
    return v.map((f) => new File([], f.name));
  }
};

BasicFileInputComponent.displayName = "BasicFileInputComponent";
