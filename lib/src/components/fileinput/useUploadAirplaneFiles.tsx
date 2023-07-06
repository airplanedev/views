import { AirplaneFile } from "airplane";
import { useCallback, useState } from "react";

import { UPLOADS_CREATE } from "client/endpoints";
import { Fetcher } from "client/fetcher";

/**
 * This hook manages the state of a set of file uploads. It returns an object
 * containing `onDrop`, which accepts a list of `File`, and `uploads`, which
 * contains information about the upload progress and the resulting `AirplaneFile`
 * objects. Callbacks that fire during different stages of the upload can be
 * passed as arguments to the hook.
 */
export const useUploadAirplaneFiles = ({
  onChange,
  onLoad,
  onLoadEnd,
  onError,
  getUploadURL,
}: {
  onChange: (v: AirplaneFile[]) => void;
  onLoad?: (f: File) => void;
  onLoadEnd?: (f: File) => void;
  onError?: (f: File, e: unknown) => void;
  getUploadURL?: (
    filename: string,
    sizeBytes: number,
  ) => Promise<{ uploadID: string; readURL: string; writeURL: string }>;
}): {
  onDrop: (files: File[]) => void;
  uploads: { percent: number; file: AirplaneFile }[];
} => {
  const [uploads, setUploads] = useState<
    { percent: number; file: AirplaneFile }[]
  >([]);

  const onDrop = useCallback(
    async (files: File[]) => {
      setUploads(
        files.map((file) => {
          return {
            percent: 0,
            file: new AirplaneFile(file, {
              id: "",
              url: "",
              name: file.name,
            }),
          };
        }),
      );
      const fetcher = new Fetcher();
      const onChangeInput = await Promise.all(
        files.map(async (file, i) => {
          try {
            let uploadID, readOnlyURL, writeOnlyURL: string;
            if (getUploadURL) {
              ({
                uploadID,
                readURL: readOnlyURL,
                writeURL: writeOnlyURL,
              } = await getUploadURL(file.name, file.size));
            } else {
              ({
                upload: { id: uploadID },
                readOnlyURL,
                writeOnlyURL,
              } = await fetcher.post<{
                upload: { id: string };
                readOnlyURL: string;
                writeOnlyURL: string;
              }>(UPLOADS_CREATE, {
                fileName: file.name,
                sizeBytes: file.size,
              }));
            }
            await new Promise<void>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.addEventListener("load", (e) => {
                setUploads((u) => [
                  ...u.slice(0, i),
                  { percent: 100, file: u[i].file },
                  ...u.slice(i + 1),
                ]);
                onLoad?.(file);
                resolve();
              });
              // Kludge for testing. xhr.upload is {} for MSW
              if (xhr.upload.addEventListener) {
                xhr.upload.addEventListener("progress", (e) => {
                  setUploads((u) => [
                    ...u.slice(0, i),
                    {
                      percent: Math.trunc((e.loaded / file.size) * 1000) / 10,
                      file: u[i].file,
                    },
                    ...u.slice(i + 1),
                  ]);
                });
              }
              xhr.addEventListener("error", (e) => {
                reject();
              });
              xhr.addEventListener("abort", (e) => {
                resolve();
              });
              xhr.addEventListener("loadend", (e) => {
                onLoadEnd?.(file);
              });
              xhr.open("PUT", writeOnlyURL);
              xhr.setRequestHeader(
                "X-Goog-Content-Length-Range",
                `0,${file.size}`,
              );
              xhr.send(file);
            });

            const airplaneFile = new AirplaneFile(file, {
              id: uploadID,
              url: readOnlyURL,
              name: file.name,
            });
            setUploads((u) => [
              ...u.slice(0, i),
              { percent: u[i].percent, file: airplaneFile },
              ...u.slice(i + 1),
            ]);
            return airplaneFile;
          } catch (e) {
            onError?.(file, e);
            return new AirplaneFile(file, {
              id: "",
              url: "",
              name: file.name,
            });
          }
        }),
      );
      onChange(onChangeInput);
      setUploads([]);
    },
    [onChange, onLoad, onLoadEnd, onError, getUploadURL],
  );

  return {
    onDrop,
    uploads,
  };
};
