// Copied from https://github.com/TanStack/table/blob/b77ed829917ab3254be48bff2aac7602b9133982/src/publicUtils.js#L163
// Importing from react-table produces an error.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react";

function useGetLatest(obj: any): any {
  const ref = useRef();
  ref.current = obj;

  return useCallback(() => ref.current, []);
}

export function useAsyncDebounce(defaultFn: any, defaultWait = 0) {
  const debounceRef = useRef<any>({});

  const getDefaultFn = useGetLatest(defaultFn);
  const getDefaultWait = useGetLatest(defaultWait);

  return useCallback(
    async (...args: any) => {
      if (!debounceRef.current.promise) {
        debounceRef.current.promise = new Promise((resolve, reject) => {
          debounceRef.current.resolve = resolve;
          debounceRef.current.reject = reject;
        });
      }

      if (debounceRef.current.timeout) {
        clearTimeout(debounceRef.current.timeout);
      }

      debounceRef.current.timeout = setTimeout(async () => {
        delete debounceRef.current.timeout;
        try {
          debounceRef.current.resolve(await getDefaultFn()(...args));
        } catch (err) {
          debounceRef.current.reject(err);
        } finally {
          delete debounceRef.current.promise;
        }
      }, getDefaultWait());

      return debounceRef.current.promise;
    },
    [getDefaultFn, getDefaultWait],
  );
}
