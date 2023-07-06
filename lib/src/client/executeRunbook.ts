import { executeRunbookBackground } from "airplane";
import { SessionTerminationError } from "airplane";
import { getSession } from "airplane/api";
import type { ParamValues } from "airplane/api";
import hash from "object-hash";

import { isGenericExecuteError } from "client/status";
import type { ExecuteError } from "components/query";
import { MISSING_EXECUTE_PERMISSIONS_ERROR_PREFIX } from "errors/formatErrors";
import { sendViewMessage } from "message/sendViewMessage";

import { getExecuteOptions } from "./env";
import { DefaultParams } from "./executeTask";

export type ExecuteRunbookSuccess = {
  sessionID: string;
};
export type ExecuteRunbookError = {
  error: ExecuteError;
  sessionID?: string;
};
export type ExecuteRunbookResult = ExecuteRunbookSuccess | ExecuteRunbookError;

export const executeRunbook = async <
  TParams extends ParamValues | undefined = ParamValues,
>(
  slug: string,
  executeType: "query" | "mutation" = "mutation",
  params?: TParams,
): Promise<ExecuteRunbookResult> => {
  try {
    const executeOptions = getExecuteOptions(executeType);
    const sessionID = await executeRunbookBackground(
      slug,
      params,
      executeOptions,
    );

    sendViewMessage({
      type: "start_session",
      sessionID,
    });

    const checkSession = async () => {
      const session = await getSession<DefaultParams>(
        sessionID,
        executeOptions,
      );
      if (session.status === "Failed" || session.status === "Cancelled") {
        throw new SessionTerminationError(session);
      }
      if (session.status !== "Succeeded") {
        return null;
      }
      return {
        sessionID: session.id,
      };
    };
    // Poll until the session terminates:
    const output = await new Promise<ExecuteRunbookResult>(
      (resolve, reject) => {
        const fnw = async () => {
          try {
            const out = await checkSession();
            if (out !== null) {
              return resolve(out);
            }
          } catch (err) {
            return reject(err);
          }

          setTimeout(fnw, 500);
        };
        fnw();
      },
    );
    return output;
  } catch (e) {
    if (isSessionTerminationError(e)) {
      return {
        error: { message: e.message, type: "FAILED" },
        sessionID: e.session.id,
      };
    }
    if (isGenericExecuteError(e)) {
      if (e.statusCode === 403) {
        return {
          error: {
            message: `${MISSING_EXECUTE_PERMISSIONS_ERROR_PREFIX} ${slug}`,
            type: "AIRPLANE_INTERNAL",
          },
        };
      } else if (e.statusCode >= 400 && e.statusCode < 500) {
        sendViewMessage({
          type: "console",
          messageType: "error",
          message: e.message,
          runbookSlug: slug,
          hash: hash(e),
          time: Date.now(),
        });
        return {
          error: {
            message: e.message,
            type: "CLIENT_ERROR",
          },
        };
      } else {
        sendViewMessage({
          type: "console",
          messageType: "error",
          message: e.message,
          runbookSlug: slug,
          hash: hash(e),
          time: Date.now(),
        });
        return {
          error: { message: e.message, type: "AIRPLANE_INTERNAL" },
        };
      }
    } else {
      const message = "An error occured";
      sendViewMessage({
        type: "console",
        messageType: "error",
        message,
        runbookSlug: slug,
        hash: hash(message),
        time: Date.now(),
      });
      return {
        error: { message, type: "AIRPLANE_INTERNAL" },
      };
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSessionTerminationError = (x: any): x is SessionTerminationError => {
  return typeof x.message === "string" && "session" in x;
};

export function isExecuteRunbookError(
  value: ExecuteRunbookResult,
): value is ExecuteRunbookError {
  return !!(value as ExecuteRunbookError).error;
}
