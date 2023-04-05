/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonInput, JsonInputProps, useMantineTheme } from "@mantine/core";
import { useCallback, useState } from "react";
import * as React from "react";
import { useEffect } from "react";
import { CellProps, Column, Row } from "react-table";

import { assertNever } from "assertNever";
import { CheckboxComponent as Checkbox } from "components/checkbox/Checkbox";
import { Code } from "components/code/Code";
import { DatePickerComponent as DatePicker } from "components/datepicker/DatePicker";
import {
  DateTimePickerComponent as DateTimePicker,
  formatDatetime,
} from "components/datepicker/DateTimePicker";
import { PencilSquareIconOutline } from "components/icon";
import { Link } from "components/link/Link";
import { NumberInputComponent as NumberInput } from "components/number/NumberInput";
import { SelectComponent as Select } from "components/select/Select";
import { TextareaComponent } from "components/textarea/Textarea";

import { useStyles } from "./Cell.styles";
import { useClickOutside } from "./useClickOutside";
import { OverflowText } from "./useIsOverflow";
import useKeyPress, { KeyPressProps } from "./useKeyPress";

export type CellType =
  | "boolean"
  | "number"
  | "date"
  | "datetime"
  | "string"
  | "json"
  | "select"
  | "link";

const CellComponent = <TRowData extends object>({
  value: initialValue,
  row,
  column: { id, canEdit, type, wrap, Component, typeOptions, EditComponent },
  updateData,
  dirtyCells,
}: CellProps<TRowData> & {
  updateData: (row: Row<TRowData>, columnId: string, value: unknown) => void;
  dirtyCells: Record<string, Set<string>>;
}) => {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const { classes, cx } = useStyles();

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = useCallback(
    (v: any, shouldUpdateTable?: boolean) => {
      setValue(v);
      // Usually we only update the external data when editing is finished.
      // We can optionally update it without this for inputs where editing
      // is always enabled like a checkbox.
      if (shouldUpdateTable) {
        updateData(row, id, v);
      }
    },
    [id, row, updateData]
  );

  const startEditing = useCallback(() => setEditing(true), [setEditing]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finishEditing = useCallback(
    (newValue: any) => {
      setEditing(false);
      updateData(row, id, newValue);
    },
    [setEditing, updateData, id, row]
  );

  if (Component && !editing) {
    return (
      <div className={cx(classes.cellPadding, classes.cell)}>
        <Component
          value={value}
          startEditing={canEdit ? startEditing : undefined}
        />
      </div>
    );
  }

  const cellType = type || getDefaultCellType(value, typeOptions);

  const cancelEdit = () => setValue(initialValue);

  if (editing || (canEdit && alwaysEditingCellTypes.includes(cellType))) {
    if (EditComponent) {
      return (
        <div className={cx(classes.cellPadding, classes.cell)}>
          <EditComponent defaultValue={value} finishEditing={finishEditing} />
        </div>
      );
    }
    return (
      <EditableCell
        value={value}
        onChange={onChange}
        type={cellType}
        typeOptions={typeOptions}
        isDirty={dirtyCells[row.id]?.has(id)}
        onStopEditing={(cancel?: boolean) => {
          setEditing(false);
          if (cancel) {
            cancelEdit();
          } else {
            updateData(row, id, value);
          }
        }}
      />
    );
  }

  return (
    <StaticCell
      value={value}
      type={cellType}
      typeOptions={typeOptions}
      wrap={wrap}
      onEdit={canEdit ? () => setEditing(true) : undefined}
      isDirty={dirtyCells[row.id]?.has(id)}
    />
  );
};

export const Cell = React.memo(
  CellComponent,
  (
    {
      value: prevValue,
      row: prevRow,
      column: prevColumn,
      updateData: prevUpdateData,
      dirtyCells: prevDirtyCells,
    },
    { value, row, column, updateData, dirtyCells }
  ) => {
    // We must check equality for all props that we are using in CellComponent.
    const { id, canEdit, type, wrap, Component } = column;
    const {
      id: prevID,
      canEdit: prevCanEdit,
      type: prevType,
      wrap: prevWrap,
      Component: PrevComponent,
    } = prevColumn;
    return (
      value === prevValue &&
      updateData === prevUpdateData &&
      id === prevID &&
      canEdit === prevCanEdit &&
      wrap === prevWrap &&
      Component === PrevComponent &&
      type === prevType &&
      row === prevRow &&
      dirtyCells === prevDirtyCells
    );
  }
);

type StaticCellProps = {
  value: any;
  type: CellType;
  typeOptions?: Column["typeOptions"];
  wrap?: boolean;
  onEdit?: () => void;
  isDirty?: boolean;
};

const StaticCell = (props: StaticCellProps) => {
  const { onEdit, isDirty } = props;
  const { classes, cx } = useStyles();

  return (
    <div
      className={cx(classes.cell, {
        [classes.dirty]: isDirty,
      })}
      data-testid={`static-cell${isDirty ? "-dirty" : ""}`}
    >
      <StaticCellValue {...props} />
      {onEdit && (
        <div className="cellEditIcon">
          <PencilSquareIconOutline
            onClick={(e) => {
              onEdit();
              e.stopPropagation();
            }}
            style={{ cursor: "pointer" }}
            data-testid="edit-icon"
          />
        </div>
      )}
    </div>
  );
};

const StaticCellValue = ({
  type,
  typeOptions,
  wrap,
  value,
  onEdit,
}: StaticCellProps) => {
  const { classes } = useStyles();
  const canEdit = !!onEdit;
  if (type === "string") {
    return (
      <OverflowText
        className={classes.cellPadding}
        wrap={wrap}
        value={value != null ? String(value) : value}
      />
    );
  } else if (type === "link") {
    if (!value) return null;
    return (
      <OverflowText
        className={classes.cellPadding}
        wrap={wrap}
        value={
          <Link size="sm" href={value} className={classes.link}>
            <span className={classes.linkSpan}>{value}</span>
          </Link>
        }
      />
    );
  } else if (type === "number") {
    return (
      <OverflowText className={classes.cellPadding} wrap={wrap} value={value} />
    );
  } else if (type === "boolean") {
    return <CheckboxCell value={value} />;
  } else if (type === "date") {
    let v;
    if (value != null) {
      const d = new Date(value);
      v = d.toLocaleDateString("en-us", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }
    return (
      <OverflowText className={classes.cellPadding} wrap={wrap} value={v} />
    );
  } else if (type === "datetime") {
    let v;
    if (value != null) {
      v = formatDatetime(value);
    }
    return (
      <OverflowText className={classes.cellPadding} wrap={wrap} value={v} />
    );
  } else if (type === "json") {
    return (
      <Code
        language="json"
        copy={!canEdit}
        theme="light"
        style={{
          width: "100%",
          cursor: "default",
        }}
        radius={0}
      >
        {formatJSON(value)}
      </Code>
    );
  } else if (type === "select") {
    if (!typeOptions?.selectData) {
      throw new Error("Missing selectData in column.typeOptions");
    }
    return (
      <Select
        className={classes.cellPadding}
        value={value}
        data={typeOptions.selectData}
        clearable={false}
        size="sm"
        readOnly
        withinPortal
        unstyled
      />
    );
  } else {
    assertNever(type);
    return null;
  }
};

const textareaEditCompleteKeys = [["Enter", "Shift"], "Tab"];
const editCompleteKeys = ["Enter", "Tab"];
const editCancelKeys = ["Escape"];
const alwaysEditingCellTypes: Column["type"][] = ["boolean"];

type EditableCellProps = {
  value: any;
  type: CellType;
  typeOptions?: Column["typeOptions"];
  onChange: (value: any, shouldUpdateTable?: boolean) => void;
  onStopEditing: (cancel?: boolean) => void;
  isDirty?: boolean;
};

const EditableCell = (props: EditableCellProps) => {
  const { value, type, typeOptions, onChange, onStopEditing, isDirty } = props;
  const { classes, cx } = useStyles();
  const ref = useClickOutside(onStopEditing);
  let targetCompleteKeys: KeyPressProps["targetKeys"] = editCompleteKeys;
  let listenToWindow = true;
  switch (type) {
    case "string":
    case "json":
    case "link":
      targetCompleteKeys = textareaEditCompleteKeys;
      listenToWindow = false;
      break;
    case "boolean":
      targetCompleteKeys = "";
      listenToWindow = false;
      break;
  }
  const editComplete = useKeyPress({
    targetKeys: targetCompleteKeys,
    listenToWindow,
  });
  const editCancelKeyPressed = useKeyPress({
    targetKeys: editCancelKeys,
    listenToWindow: true,
  });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (editComplete.keyPressed) {
      onStopEditing();
    }
  }, [type, editComplete.keyPressed, onStopEditing]);

  useEffect(() => {
    if (editCancelKeyPressed.keyPressed) {
      onStopEditing(true);
    }
  }, [editCancelKeyPressed.keyPressed, onStopEditing]);

  let cell: React.ReactNode;
  switch (type) {
    case "string":
    case "link":
      cell = (
        <TextareaComponent
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          data-cy="cell-text-input"
          size="sm"
          variant="unstyled"
          autoFocus
          onFocus={(e) => {
            // Moves cursor to end of input.
            const val = e.target.value;
            e.target.value = "";
            e.target.value = val;
          }}
          autosize
          onKeyDown={(e) => {
            const isPressed = editComplete.downHandler(e);
            if (isPressed) {
              e.preventDefault();
            }
          }}
          onKeyUp={editComplete.upHandler}
          classNames={{
            input: classes.textareaInput,
            wrapper: classes.textareaWrapper,
            root: classes.textareaRoot,
          }}
          ref={ref}
        />
      );
      break;
    case "number":
      cell = (
        <NumberInput
          value={value}
          onChange={(v) => {
            if (v != null && typeOptions?.numberMin != null) {
              v = Math.max(typeOptions.numberMin, v);
            }
            if (v != null && typeOptions?.numberMax != null) {
              v = Math.min(typeOptions.numberMax, v);
            }
            onChange(v);
          }}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          ref={ref}
          variant="unstyled"
          size="sm"
          className={classes.cellPadding}
        />
      );
      break;
    case "boolean":
      cell = (
        <CheckboxCell
          value={value}
          onChange={onChange}
          hoveringOnCell={hover}
        />
      );
      break;
    case "date":
      cell = (
        <DatePicker
          value={value == null ? new Date() : new Date(value)}
          onChange={onChange}
          initiallyOpened
          onDropdownClose={onStopEditing}
          clearable={false}
          closeCalendarOnChange={false}
          variant="unstyled"
          size="sm"
          withinPortal
          autoFocus
          className={classes.cellPadding}
        />
      );
      break;
    case "datetime":
      cell = (
        <DateTimePicker
          value={value == null ? new Date() : new Date(value)}
          onChange={onChange}
          initiallyOpened
          onDropdownClose={onStopEditing}
          clearable={false}
          variant="unstyled"
          size="sm"
          withinPortal
          autoFocus
          className={classes.cellPadding}
        />
      );
      break;
    case "json": {
      cell = (
        <EditableJSON
          onChange={onChange}
          onStopEditing={onStopEditing}
          ref={ref}
          value={value}
          onKeyDown={(e) => {
            const isPressed = editComplete.downHandler(e);
            if (isPressed) {
              e.preventDefault();
            }
          }}
          onKeyUp={editComplete.upHandler}
        />
      );
      break;
    }
    case "select":
      if (!typeOptions?.selectData) {
        throw new Error("Missing selectData in column.typeOptions");
      }
      cell = (
        <Select
          value={value}
          data={typeOptions.selectData}
          initiallyOpened
          clearable={false}
          size="sm"
          onChange={onChange}
          ref={ref}
          withinPortal
          unstyled
          classNames={{ root: classes.cellPadding }}
        />
      );
      break;
    default:
      assertNever(type);
  }

  return (
    <div
      className={cx(classes.cell, {
        [classes.editingCell]: type !== "boolean" && type !== "json",
        // Only set dirty for boolean cells because it looks weird when editing cells
        // of other types.
        [classes.dirty]: isDirty && type === "boolean",
      })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-testid={`editable-cell${isDirty ? "-dirty" : ""}`}
    >
      {cell}
    </div>
  );
};

type EditableJSONProps = {
  value: any;
  onChange: (value: any, shouldUpdateTable?: boolean) => void;
  onStopEditing: (cancel?: boolean) => void;
};

const EditableJSON = React.forwardRef<
  HTMLTextAreaElement,
  EditableJSONProps & Pick<JsonInputProps, "onKeyDown" | "onKeyUp">
>(({ value, onChange, onStopEditing: _, ...props }, ref) => {
  const [previousValue, setPreviousValue] = useState("");
  useEffect(() => {
    if (previousValue != value) {
      setPreviousValue("");
    }
  }, [value, setPreviousValue, previousValue]);

  let v = value;
  if (previousValue !== value) {
    // Only reformat when the value has changed.
    v = formatJSON(value);
  }

  return (
    // TODO: replace with Views component
    <JsonInput
      value={v}
      onChange={(v) => {
        onChange(v);
        setPreviousValue(v);
      }}
      onClick={(e) => e.stopPropagation()}
      minRows={8}
      autoFocus
      ref={ref}
      sx={{ width: "100%" }}
      {...props}
    />
  );
});
EditableJSON.displayName = "JsonInput";

type CheckboxCellProps = {
  value: any;
  onChange?: (value: any, shouldUpdateTable: boolean) => void;
  hoveringOnCell?: boolean;
};

const CheckboxCell = ({
  value,
  onChange,
  hoveringOnCell,
}: CheckboxCellProps) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  return (
    <Checkbox
      aria-label="toggle"
      checked={value === true || value === "true"}
      onChange={(checked) => onChange?.(checked, true)}
      onClick={(e) => e.stopPropagation()}
      data-cy="cell-checkbox"
      size="md"
      styles={{
        input: {
          backgroundColor: "white !important",
          border: hoveringOnCell && onChange ? undefined : "none",
          borderColor: `${theme.colors.dark[0]} !important`,
          cursor: onChange ? undefined : "default",
        },
        icon: {
          color: `${theme.colors.primary[5]} !important`,
        },
      }}
      className={classes.checkboxCellPadding}
    />
  );
};

function formatJSON(value: any): string {
  let v = value;
  if (typeof value === "string") {
    try {
      v = JSON.stringify(JSON.parse(value), null, 2);
    } catch (e) {
      // Nothing
    }
  } else if (value == null) {
    return "";
  } else {
    try {
      v = JSON.stringify(value, null, 2);
    } catch (e) {
      // Nothing
    }
  }
  return String(v);
}

// https://stackoverflow.com/a/37563868
const ISO_8601_FULL =
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

export function getDefaultCellType(
  value: unknown,
  typeOptions: Column["typeOptions"]
): CellType {
  if (typeof value === "boolean") {
    return "boolean";
  } else if (typeof value === "number") {
    return "number";
  } else if (value instanceof Date) {
    return "datetime";
  } else if (value && typeof value === "object") {
    return "json";
  } else if (typeof value === "string" && ISO_8601_FULL.test(value)) {
    return "datetime";
  } else if (typeOptions?.selectData) {
    return "select";
  }
  return "string";
}

export const dateTimeSort = (
  rowA: Row<any>,
  rowB: Row<any>,
  columnID: string
) => {
  const diff =
    new Date(rowA.values[columnID]).getTime() -
    new Date(rowB.values[columnID]).getTime();
  if (!diff) return 0;
  return diff > 0 ? 1 : -1;
};
