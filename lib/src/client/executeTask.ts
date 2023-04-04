import { RunTerminationError, executeBackground } from "airplane";
import { getRun } from "airplane/api";
import type { ParamValues, Run } from "airplane/api";
import hash from "object-hash";

import { isGenericExecuteError } from "client/status";
import type { ExecuteError } from "components/query";
import { MISSING_EXECUTE_PERMISSIONS_ERROR_PREFIX } from "errors/formatErrors";
import { sendViewMessage } from "message/sendViewMessage";

import { getExecuteOptions } from "./env";

export type ExecuteTaskSuccess<TOutput = Record<string, unknown>> = {
  output: TOutput;
  runID: string;
};
export type ExecuteTaskError<TOutput = Record<string, unknown>> = {
  output?: TOutput;
  error: ExecuteError;
  runID?: string;
};
export type ExecuteTaskResult<TOutput = Record<string, unknown>> =
  | ExecuteTaskSuccess<TOutput>
  | ExecuteTaskError<TOutput>;

export { ParamValues };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultParams = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultOutput = any;

export const executeTask = async <
  TParams extends ParamValues | undefined = ParamValues,
  TOutput = Record<string, unknown>
>(
  slug: string,
  executeType: "query" | "mutation",
  params?: TParams
): Promise<ExecuteTaskResult<TOutput>> => {
  try {
    const executeOptions = getExecuteOptions(executeType);
    const runID = await executeBackground(slug, params, executeOptions);

    sendViewMessage({
      type: "start_run",
      runID,
      executeType,
    });

    const checkRun = async () => {
      const run = await getRun<DefaultParams, TOutput>(runID, executeOptions);
      if (run.status === "Failed" || run.status === "Cancelled") {
        throw new RunTerminationError(run);
      }
      if (run.status !== "Succeeded") {
        return null;
      }
      return {
        output: run.output,
        runID: run.id,
      };
    };
    // Poll until the run terminates:
    const output = await new Promise<ExecuteTaskResult<TOutput>>(
      (resolve, reject) => {
        const fnw = async () => {
          try {
            const out = await checkRun();
            if (out !== null) {
              return resolve(out);
            }
          } catch (err) {
            return reject(err);
          }

          setTimeout(fnw, 500);
        };
        fnw();
      }
    );
    return output;
  } catch (e) {
    if (isRunTerminationError<TOutput>(e)) {
      return {
        error: { message: e.message, type: "FAILED" },
        output: e.run.output,
        runID: e.run.id,
      };
    } else if (isGenericExecuteError(e)) {
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
          taskSlug: slug,
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
          taskSlug: slug,
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
        taskSlug: slug,
        hash: hash(message),
        time: Date.now(),
      });
      return {
        error: { message, type: "AIRPLANE_INTERNAL" },
      };
    }
  }
};

interface RunTerminationErrorIface<TOutput = Record<string, unknown>> {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: Run<any, TOutput>;
}

const isRunTerminationError = <TOutput = Record<string, unknown>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  x: any
): x is RunTerminationErrorIface<TOutput> => {
  return typeof x.message === "string" && "run" in x;
};

export function isExecuteTaskError<TOutput>(
  value: ExecuteTaskResult<TOutput>
): value is ExecuteTaskError<TOutput> {
  return !!(value as ExecuteTaskError).error;
}
