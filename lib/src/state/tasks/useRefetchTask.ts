import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  getFullQuery,
  getSlug,
  RefetchQuery,
  TaskQuery,
} from "components/query";

/**
 * Returns a function that refetches the provided task(s) in the background. Any code using these tasks
 * will be automatically updated when the refetch is complete.
 *
 * Tasks can be refetched by slug, slug + params, or by the task function.
 * If no params are provided, all tasks matching the slug or function will be refetched.
 *
 * @example
 * useRefetchTask()('my_task'); // Refetches all executions of `my_task` regardless of parameters.
 *
 * @example
 * useRefetchTask()({ slug: 'my_task', params: { id: 1 } }); // Refetches executions of `my_task` with `id` = 1.
 *
 * @example
 * useRefetchTask()({ fn: myTask }); // Refetches all executions of the `myTask` function.
 */
export const useRefetchTasks = () => {
  const queryClient = useQueryClient();

  const refetchTasks = useCallback(
    (refetchTasks: RefetchQuery | RefetchQuery[]) => {
      const refetches = Array.isArray(refetchTasks)
        ? refetchTasks
        : [refetchTasks];
      refetches
        .map((r) => getFullQuery(r as TaskQuery))
        .map((q) => (q.params ? [getSlug(q), q.params] : [getSlug(q)]))
        .forEach((key) => queryClient.invalidateQueries(key));
    },
    [queryClient],
  );

  return refetchTasks;
};
