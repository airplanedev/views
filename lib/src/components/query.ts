/* eslint-disable @typescript-eslint/no-explicit-any */
import { Run } from "airplane/api";

import { DefaultOutput, DefaultParams, ParamValues } from "client";
import { MutationHookOptions } from "state";
import { RunbookMutationHookOptions } from "state/tasks/useRunbookMutation";
import { UseTaskQueryOptions } from "state/tasks/useTaskQuery";

export type AirplaneFunc<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = (paramValues: TParams) => Promise<Run<any, TOutput>>;
type AirplaneFuncMetadata = { __airplane: { config: { slug: string } } };

// Query

/**
 * FullQuery is a query that uses an airplane function or a slug. It is always
 * an object and does not include the shorthands of just slug or just function.
 */
export type FullQuery<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = FunctionQuery<TParams, TOutput> | SlugQuery<TParams, TOutput>;

/** FunctionQuery is a query that takes an airplane function and params. */
export type FunctionQuery<
  TParams extends ParamValues | undefined,
  TOutput = DefaultOutput,
> = (Record<string, never> extends TParams
  ? {
      /**
       * A function returned by airplane.task to execute.
       * @example
       * // myTask can be used as fn.
       * const myTask = airplane.task(async (params) => {...
       */
      fn: AirplaneFunc<TParams, TOutput>;
      params?: TParams;
      slug?: never;
    }
  : {
      /**
       * A function returned by airplane.task to execute.
       * @example
       * // myTask can be used as fn.
       * const myTask = airplane.task(async (params) => {...
       */
      fn: AirplaneFunc<TParams, TOutput>;
      params: TParams;
      slug?: never;
    }) &
  UseTaskQueryOptions<TParams, TOutput>;

/** SlugQuery is a query that takes a slug and params. */
export type SlugQuery<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = {
  /** The slug of the task to execute. */
  slug: string;
  fn?: never;
} & UseTaskQueryOptions<TParams, TOutput>;

/**
 * TaskQuery is a query that uses an airplane function or a slug. If the task's
 * parameters are optional then it can take a shorthand of a string slug or a function.
 */
export type TaskQuery<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> =
  | SlugQuery<TParams, TOutput>
  | string
  | FunctionQuery<TParams, TOutput>
  | (Record<string, never> extends TParams
      ? AirplaneFunc<TParams, TOutput>
      : never);

/**
 * getFullQuery gets a FullQuery given a TaskQuery. It converts shorthands (just string or function)
 * to their full form.
 */
export function getFullQuery<
  TParams extends ParamValues | undefined = DefaultParams,
>(q: TaskQuery<TParams>): FullQuery<TParams> {
  if (typeof q === "string") {
    return { slug: q };
  }
  if (typeof q === "function") {
    if (!(q as unknown as AirplaneFuncMetadata)?.__airplane?.config?.slug) {
      throw new Error("function is not an Airplane task function");
    }
    return { fn: q } as unknown as FunctionQuery<TParams>;
  }
  return q as FullQuery<TParams>;
}

// Mutation

/**
 * FullMutation is a mutation that uses an airplane function or a slug. It is always
 * an object and does not include the shorthands of just slug or just function.
 */
export type FullMutation<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = FunctionMutation<TParams, TOutput> | SlugMutation<TParams, TOutput>;

/** FunctionMutation is a mutation that takes an airplane function and params. */
export type FunctionMutation<
  TParams extends ParamValues | undefined,
  TOutput = DefaultOutput,
> = (Record<string, never> extends TParams
  ? {
      /**
       * A function returned by airplane.task to execute.
       * @example
       * // myTask can be used as fn.
       * const myTask = airplane.task(async (params) => {...
       */
      fn: AirplaneFunc<TParams, TOutput>;
      params?: TParams;
      slug?: never;
    }
  : {
      /**
       * A function returned by airplane.task to execute.
       * @example
       * // myTask can be used as fn.
       * const myTask = airplane.task(async (params) => {...
       */
      fn: AirplaneFunc<TParams, TOutput>;
      params: TParams;
      slug?: never;
    }) &
  MutationHookOptions<TParams, TOutput>;

/** SlugMutation is a mutation that takes a slug and params. */
export type SlugMutation<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = {
  /** The slug of the task to execute. */
  slug: string;
} & MutationHookOptions<TParams, TOutput>;

/**
 * TaskMutation is a mutation that uses an airplane function or a slug. If the task's
 * parameters are optional then it can take a shorthand of a string slug or a function.
 */
export type TaskMutation<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> =
  | SlugMutation<TParams, TOutput>
  | string
  | FunctionMutation<TParams, TOutput>
  | (Record<string, never> extends TParams
      ? AirplaneFunc<TParams, TOutput>
      : never);

/**
 * getFullMutation gets a FullMutation given a TaskMutation.
 * It converts shorthands (just string or function) to their full form.
 */
export function getFullMutation<
  TParams extends ParamValues | undefined = DefaultParams,
>(m: TaskMutation<TParams>): FullMutation<TParams> {
  if (typeof m === "string") {
    return { slug: m };
  }
  if (typeof m === "function") {
    if (!(m as unknown as AirplaneFuncMetadata)?.__airplane?.config?.slug) {
      throw new Error("function is not an Airplane task function");
    }
    return { fn: m } as unknown as FunctionMutation<TParams>;
  }
  return m as FullMutation<TParams>;
}

/**
 * getSlug takes a full query or mutation and returns the task slug.
 */
export function getSlug<
  TParams extends ParamValues | undefined = DefaultParams,
>(fullQuery: FullQuery<TParams> | FullMutation<TParams>): string {
  if ("slug" in fullQuery && fullQuery.slug != null) {
    return fullQuery.slug;
  }
  const fn = fullQuery.fn;
  if (!(fn as unknown as AirplaneFuncMetadata)?.__airplane?.config?.slug) {
    throw new Error("function is not an Airplane task function");
  }
  return (fn as unknown as AirplaneFuncMetadata).__airplane.config.slug;
}

/**
 * getRunbookFullMutation gets a RunbookFullMutation given a RunbookMutation.
 * It converts a shorthand string slug into the full runbook form.
 */
export function getRunbookFullMutation<
  TParams extends ParamValues | undefined = DefaultParams,
>(m: RunbookMutation<TParams>): RunbookFullMutation<TParams> {
  if (typeof m === "string") {
    return { slug: m };
  }
  return m as RunbookFullMutation<TParams>;
}

/** 4XX errors from executing task or runbook (except for 403 missing execute permissions) */
type ClientExecuteError = {
  message: string;
  type: "CLIENT_ERROR";
};

/** All other API errors (403 and 5XX errors) */
type InternalExecuteError = {
  message: string;
  type: "AIRPLANE_INTERNAL";
};

/** Run/session failure errors */
type FailedExecuteError = {
  message: string;
  type: "FAILED";
};

export type ExecuteError =
  | ClientExecuteError
  | InternalExecuteError
  | FailedExecuteError;

export type RunbookSlugMutation<
  TParams extends ParamValues | undefined = DefaultParams,
> = {
  slug: string;
} & RunbookMutationHookOptions<TParams>;

export type RunbookFullMutation<
  TParams extends ParamValues | undefined = DefaultParams,
> = RunbookSlugMutation<TParams>;

export type RunbookMutation<
  TParams extends ParamValues | undefined = DefaultParams,
> = RunbookSlugMutation<TParams> | string;

export type RefetchQuery =
  | { slug: string; params?: ParamValues }
  | string
  | { fn: AirplaneFunc<any>; params?: ParamValues }
  | AirplaneFunc<any>;
