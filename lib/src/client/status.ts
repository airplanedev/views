import type { RunStatus, SessionStatus } from "airplane/api";

export const isStatusTerminal = (
  status?: RunStatus | SessionStatus,
): boolean => {
  // Note that the terminal run and session statuses happen to be the same,
  // so we can get away with this, but we should probably be careful whether
  // this continues to be true in the future.
  switch (status) {
    case "Succeeded":
    case "Failed":
    case "Cancelled":
      return true;
    default:
      return false;
  }
};

interface GenericExecuteError {
  message: string;
  statusCode: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isGenericExecuteError = (x: any): x is GenericExecuteError => {
  return typeof x.message === "string";
};
