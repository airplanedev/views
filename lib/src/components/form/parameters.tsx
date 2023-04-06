import { Input } from "@mantine/core";
import dayjs from "dayjs";
import { ReactElement } from "react";

import { Parameter } from "client/types";
import { Checkbox } from "components/checkbox/Checkbox";
import { CodeInput } from "components/codeinput/CodeInput";
import { DatePicker } from "components/datepicker/DatePicker";
import { DateTimePicker } from "components/datepicker/DateTimePicker";
import { FileInput } from "components/fileinput/FileInput";
import { NumberInput } from "components/number/NumberInput";
import { Select } from "components/select/Select";
import { Textarea } from "components/textarea/Textarea";
import { TextInput } from "components/textinput/TextInput";

import { FieldOption, RunbookOptions, TaskOptions } from "./Form.types";

interface ParamConfig {
  getInput: (
    props: {
      required: boolean;
      id: string;
      label: string;
      key: number;
    },
    component?: string
  ) => ReactElement;

  validate: (
    val: string | boolean | Date | number,
    slug: string,
    constraints?: string[]
  ) => string | undefined;
}

const PARAM_CONFIG_MAP: Record<Parameter["type"], ParamConfig> = {
  boolean: {
    getInput: (props) => <Checkbox {...props} />,
    validate: (val, slug) => {
      if (typeof val !== "boolean") {
        return `Value of param ${slug} must be a boolean`;
      }
    },
  },
  upload: {
    getInput: (props) => <FileInput {...props} />,
    validate: () => {
      return "Cannot set value constraints for file params";
    },
  },
  date: {
    getInput: (props) => <DatePicker {...props} />,
    validate: (val, slug, constraints) => {
      if (
        (typeof val !== "string" && !(val instanceof Date)) ||
        (typeof val === "string" && !dayjs(val).isValid()) ||
        (constraints &&
          constraints.find(
            (v) => new Date(v).getTime() === new Date(val).getTime()
          ) === undefined)
      ) {
        return `${val} is not a valid value for ${slug}`;
      }
    },
  },
  datetime: {
    getInput: (props) => <DateTimePicker {...props} />,
    validate: (val, slug, constraints) => {
      if (
        (typeof val !== "string" && !(val instanceof Date)) ||
        (typeof val === "string" && !dayjs(val).isValid()) ||
        (constraints &&
          constraints.find(
            (v) => new Date(v).getTime() === new Date(val).getTime()
          ) === undefined)
      ) {
        return `${val} is not a valid value for ${slug}`;
      }
    },
  },
  float: {
    getInput: (props) => (
      <NumberInput precision={9} removeTrailingZeros {...props} />
    ),
    validate: (val, slug, constraints) => {
      if (typeof val !== "number") {
        return `Value of param ${slug} must be a number`;
      }
      if (
        constraints &&
        constraints.find((v) => Number(v) == val) === undefined
      ) {
        return `${val} is not a valid value for ${slug}`;
      }
    },
  },
  integer: {
    getInput: (props) => <NumberInput {...props} />,
    validate: (val, slug, constraints) => {
      if (typeof val !== "number") {
        return `Value of param ${slug} must be a number`;
      }
      if (
        constraints &&
        constraints.find((v) => Number(v) == val) === undefined
      ) {
        return `${val} is not a valid value for ${slug}`;
      }
    },
  },
  string: {
    getInput: (props, component) => {
      if (component === "textarea") {
        return <Textarea {...props} />;
      } else if (component === "editor-sql") {
        return <CodeInput {...props} language="sql" />;
      }
      return <TextInput {...props} />;
    },
    validate: (val, slug, constraints) => {
      if (typeof val !== "string") {
        return `Value of param ${slug} must be a string`;
      }
      if (constraints && !constraints.includes(val)) {
        return `${val} is not a valid value for ${slug}`;
      }
    },
  },
};

export const parameterToInput = (
  param: Parameter,
  key: number,
  idPrefix: string,
  opt?: FieldOption
) => {
  if (opt?.value !== undefined) {
    return (
      <Input.Label key={key}>{`${param.slug}: ${JSON.stringify(
        opt.value
      )}`}</Input.Label>
    );
  }
  const props = {
    required: !param.constraints.optional,
    id: idPrefix + param.slug,
    label: param.name,
    key,
    ...(param.type === "boolean"
      ? { defaultChecked: opt?.defaultValue }
      : { defaultValue: opt?.defaultValue }),
    validate: opt?.validate,
    // This is not param?.desc because we don't want to pass an empty string desc
    description: param.desc || undefined,
    disabled: opt?.disabled,
  };
  if (opt?.allowedValues) {
    let allowedValues = canonicalizeValues(opt.allowedValues, param.type);
    if (param.constraints.options) {
      allowedValues = filterValues(
        allowedValues,
        param.constraints.options,
        param.type
      );
    }
    return (
      <Select
        clearable
        {...props}
        defaultValue={
          typeof opt?.defaultValue === "boolean"
            ? undefined
            : canonicalizeValue(opt?.defaultValue, param.type)
        }
        data={allowedValues}
      />
    );
  } else if (param.constraints.options) {
    const constraintValues = param.constraints.options.map((v) => v.value);
    return (
      <Select
        clearable
        {...props}
        defaultValue={
          typeof opt?.defaultValue === "boolean"
            ? undefined
            : canonicalizeValue(opt?.defaultValue, param.type)
        }
        data={constraintValues}
      />
    );
  }
  return PARAM_CONFIG_MAP[param.type]?.getInput(props, param.component);
};

export const validateParameterOptions = <TOutput,>(
  params: Parameter[],
  opts: TaskOptions<TOutput> | RunbookOptions
) => {
  for (const param of params) {
    // Check that all required fields are set or not hidden
    if (
      !param.constraints.optional &&
      ((opts.shownFields && !opts.shownFields.includes(param.slug)) ||
        opts.hiddenFields?.includes(param.slug)) &&
      (!opts.fieldOptions ||
        opts.fieldOptions.find((o) => o.slug === param.slug)?.value ===
          undefined)
    ) {
      return "All required fields that are hidden must have a value specified";
    }
  }
  if (opts.fieldOptions) {
    for (const opt of opts.fieldOptions) {
      // Check no extraneous slugs
      const param = params.find((p) => p.slug === opt.slug);
      if (!param) {
        return `Found extraneous param in fieldOptions: ${opt.slug}`;
      }
      // Check that allowedValues has length at least 2
      if (opt.allowedValues && opt.allowedValues.length < 2) {
        return `allowedValues for param ${opt.slug} must have length at least 2`;
      }

      const constraints = param.constraints.options?.map((v) => v.value);
      // Check that all values are valid
      let valuesToCheck: (string | boolean | Date | number)[] =
        opt.allowedValues || [];
      if (opt.defaultValue !== undefined) {
        valuesToCheck = [...valuesToCheck, opt.defaultValue];
      }
      if (opt.value !== undefined) {
        valuesToCheck = [...valuesToCheck, opt.value];
      }
      for (const val of valuesToCheck) {
        const validateResult = PARAM_CONFIG_MAP[param.type]?.validate(
          val,
          opt.slug,
          constraints
        );
        if (validateResult) {
          return validateResult;
        }
      }
    }
  }
};

/**
 * Converts `value` to a string.
 */
const canonicalizeValue = (
  value: string | number | Date | undefined,
  type: string
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (type === "date") {
    // For dates, string values are allowed. We canonicalize string values by
    // getting the ISO format string. We need to check if date.getTime() has a
    // valid value, because this function runs before validation, and toISOString
    // will crash the view if the date is invalid. We take the first 10 characters
    // because the backend expects a date format that looks like "2006-01-02".
    const date = dayjs(value);
    return date.isValid() ? date.format("YYYY-MM-DD") : "";
  }
  if (type === "datetime") {
    const date = dayjs(value);
    return date.isValid() ? date.toISOString() : "";
  }
  return value;
};

/**
 * Converts `values` to a string array.
 */
const canonicalizeValues = (
  values: Date[] | string[] | number[],
  type: string
): string[] => {
  if (values[0] instanceof Date) {
    values = (values as Date[]).map((d) => d.toISOString());
  } else if (typeof values[0] === "number") {
    values = values.map((n) => String(n));
  } else if (type === "date") {
    // For dates, string values are allowed. We canonicalize string values by
    // getting the ISO format string. We need to check if date.getTime() has a
    // valid value, because this function runs before validation, and toISOString
    // will crash the view if the date is invalid. We take the first 10 characters
    // because the backend expects a date format that looks like "2006-01-02".
    values = values.map((d) => {
      const date = dayjs(d);
      return date.isValid() ? date.format("YYYY-MM-DD") : "";
    });
  } else if (type === "datetime") {
    values = values.map((d) => {
      const date = dayjs(d);
      return date.isValid() ? date.toISOString() : "";
    });
  }
  return values as string[];
};

/**
 * Returns the subset of `values` that matches a constraint in `constraints`.
 */
const filterValues = (
  values: string[],
  constraints: { label: string; value: string }[],
  type: string
): string[] => {
  if (type === "date" || type === "datetime") {
    const constraintValues = constraints.map((v) =>
      new Date(v.value).getTime()
    );
    return values.filter((v) =>
      constraintValues.includes(new Date(v).getTime())
    );
  } else {
    const constraintValues = constraints.map((v) => v.value);
    return values.filter((v) => constraintValues.includes(v));
  }
};
