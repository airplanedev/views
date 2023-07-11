import { uniqueId } from "lodash-es";
import hash from "object-hash";

import { ComponentAirplaneInternalErrorFallback } from "components/errorBoundary/ComponentAirplaneInternalErrorFallback";
import { RunErrorComponentErrorState } from "components/errorBoundary/ComponentErrorState";
import { ExecuteError } from "components/query";
import { sendViewMessage } from "message/sendViewMessage";

import {
  getClientErrorMessageForTaskBackedComponent,
  getInternalErrorMessageForTaskBackedComponent,
} from "./formatErrors";

export const displayTaskBackedError = ({
  error,
  taskSlug,
  runID,
  componentName,
}: {
  error: ExecuteError;
  taskSlug?: string;
  runID?: string;
  componentName: string;
}) => {
  if (error.type === "FAILED") {
    return (
      <RunErrorComponentErrorState
        taskSlug={taskSlug}
        componentName={componentName}
        runID={runID}
      />
    );
  } else if (error.type === "CLIENT_ERROR") {
    throw new Error(
      getClientErrorMessageForTaskBackedComponent(error.message, componentName),
    );
    // AIRPLANE_INTERNAL error
  } else {
    const errorID = uniqueId();
    const message = getInternalErrorMessageForTaskBackedComponent(
      error.message,
      componentName,
    );
    sendViewMessage({
      type: "console",
      id: errorID,
      messageType: "error",
      message,
      hash: hash(error),
      time: Date.now(),
    });
    return (
      <ComponentAirplaneInternalErrorFallback
        errorMessage={message}
        errorID={errorID}
        componentName={componentName}
      />
    );
  }
};
