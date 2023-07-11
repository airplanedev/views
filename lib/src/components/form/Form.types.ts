import React from "react";

import { DefaultOutput } from "client";
import { CommonLayoutProps } from "components/layout/layout.types";
import { AirplaneFunc, ExecuteError, RefetchQuery } from "components/query";
import { CommonStylingProps } from "components/styling.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type State = Record<string, any>;

export type FieldOption = {
  /** The field slug. */
  slug: string;
  /** The value assigned to the field. */
  value?: string | number | boolean | Date;
  /** The default value for the field. Ignored if `value` is set. */
  defaultValue?: string | number | boolean | Date;
  /**
   * The set of allowed values for the field. Ignored if `value` is set. This
   * prop is only valid if there are at least two allowed values, so boolean
   * arrays are not supported.
   */
  allowedValues?: string[] | number[] | Date[];
  /** If true, the field will be disabled. */
  disabled?: boolean;
  /**
   * A function that validates the input value, returning an error message if
   * there is an error or undefined otherwise. Ignored if `value` is set.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate?: (value: any) => string | undefined;
};

export type TaskOptions<TOutput> = (
  | {
      /**
       * The slug of the task or runbook to execute when the form is submitted.
       * The parameters will automatically be populated from the form inputs.
       */
      slug: string;
      fn?: never;
    }
  | {
      /**
       * The task function to execute when the form is submitted.
       * The parameters will automatically be populated from the form inputs.
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fn: AirplaneFunc<any>;
      slug?: never;
    }
) & {
  /** If set, only fields that are in `shownFields` are shown. */
  shownFields?: string[];
  /**
   * If set, fields that are in `hiddenFields` are hidden. If a field is in both
   * `shownFields` and `hiddenFields`, it is hidden.
   */
  hiddenFields?: string[];
  /** Custom options for fields. Can be used to constrain the field values. */
  fieldOptions?: FieldOption[];
  /**
   * If set, the provided tasks will be refetched on successful form submission.
   *
   * This can be useful if you expect the submission to invalidate data.
   */
  refetchTasks?: RefetchQuery | RefetchQuery[];

  /**
   * Callback for when the task associated with the form is successfully executed.
   */
  onSuccess?: (output: TOutput, runID: string) => void;
  /**
   * Callback for when the task associated with the form fails.
   */
  onError?: (
    output: TOutput | undefined,
    error: ExecuteError,
    runID?: string,
  ) => void;
};

export type RunbookOptions = {
  /**
   * The slug of the task or runbook to execute when the form is submitted.
   * The parameters will automatically be populated from the form inputs.
   */
  slug: string;
  /** If set, only fields that are in `shownFields` are shown. */
  shownFields?: string[];
  /**
   * If set, fields that are in `hiddenFields` are hidden. If a field is in both
   * `shownFields` and `hiddenFields`, it is hidden.
   */
  hiddenFields?: string[];
  /** Custom options for fields. Can be used to constrain the field values. */
  fieldOptions?: FieldOption[];
};

export type FormBaseProps = {
  /**
   * The ID referenced by the global component state.
   */
  id: string;
  /**
   * The form children.
   */
  children?: React.ReactNode;
  /**
   * Label on the form's submit button.
   * @default Submit
   */
  submitText?: string;
  /**
   * Callback for when the form is submitted. The callback is passed the form's
   * input state as input.
   */
  onSubmit?: (state: State) => void;
  /**
   * Function applied to transform the form's input state before being passed to onSubmit. This will
   * affect the parameters received by the task for a task-backed form.
   */
  beforeSubmitTransform?: (values: State) => State;
  /**
   * If true, the form input state will be reset to their initial values on submit.
   * @default true
   */
  resetOnSubmit?: boolean;
  /**
   * If true, the submit button is always disabled. The submit button may disabled even if this is
   * set to false, for example if the form has errors or if the user does not have permission to
   * submit a task-backed form.
   */
  disabled?: boolean;
  /**
   * If true, the submit button is disabled and a spinner is shown.
   * This is set automatically when using a task-backed form.
   */
  submitting?: boolean;
} & CommonLayoutProps &
  CommonStylingProps;

type TaskOrRunbook<TOutput> =
  | {
      /**
       * If set, the form populates itself from the task params and runs the
       * associated task when submitted.
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      task?: string | AirplaneFunc<any> | TaskOptions<TOutput>;
      runbook?: never;
    }
  | {
      /**
       * If set, the form populates itself from the runbook params and runs the
       * associated runbook when submitted.
       */
      runbook?: string | RunbookOptions;
      task?: never;
    };

export type FormWithRunnableProps<TOutput> = FormBaseProps &
  TaskOrRunbook<TOutput>;

export type FormProps<TOutput = DefaultOutput> = Omit<FormBaseProps, "id"> &
  TaskOrRunbook<TOutput> & {
    /**
     * The ID referenced by the global component state.
     */
    id?: string;
  };
