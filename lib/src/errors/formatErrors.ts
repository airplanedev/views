export const MISSING_EXECUTE_PERMISSIONS_ERROR_PREFIX =
  "Missing execute permissions on";
const CLIENT_ERROR_TASK_BACKED_PREFIX = "Error while rendering task-backed";

export const getClientErrorMessageForTaskBackedComponent = (
  errorMessage: string,
  componentName: string,
) => {
  return `${CLIENT_ERROR_TASK_BACKED_PREFIX} ${componentName}: ${errorMessage}`;
};

const INTERNAL_ERROR_TASK_BACKED_PREFIX =
  "Internal error occurred in task-backed";

export const getInternalErrorMessageForTaskBackedComponent = (
  errorMessage: string,
  componentName: string,
) => {
  const strippedErrorMessage = errorMessage.replace(
    "An internal error occurred: ",
    "",
  );
  return `${INTERNAL_ERROR_TASK_BACKED_PREFIX} ${componentName}: ${strippedErrorMessage}`;
};
