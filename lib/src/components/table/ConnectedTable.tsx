import type { RunStatus } from "airplane/api";
import { useCallback, useMemo, useRef } from "react";

import { DefaultParams } from "client";
import { UnconnectedButton } from "components/button/Button";
import { getFullMutation, getSlug } from "components/query";
import { fontFamily } from "components/theme/typography";
import { useTableState } from "state/components/table";
import { useComponentId } from "state/components/useId";
import { MutationState } from "state/tasks/useTaskMutation";

import {
  BasicRowAction,
  Column,
  ComponentRowAction,
  ConnectedTableProps,
  TaskRowAction,
} from "./Table.types";
import { TableComponent, TableComponentElement } from "./TableComponent";

const DEFAULT_ROW_MENU_ICON_WIDTH = 24;

/**
 * ConnectedTable is a table that's connected to the global component state.
 */
export const ConnectedTable = <TRowData extends object>(
  props: ConnectedTableProps<TRowData>
) => {
  const tableComponentRef = useRef<TableComponentElement>(null);
  const clearSelection = useCallback(
    () => tableComponentRef.current!.toggleAllRowsSelected(false),
    [tableComponentRef]
  );
  const id = useComponentId(props.id);
  const { changeRowSelection, setRowActionResult } = useTableState<TRowData>(
    id,
    {
      singleSelect: props.rowSelection === "single",
      clearSelection,
    }
  );

  // Used to approximate the width of text on screen
  const canvas = useMemo(() => document.createElement("canvas"), []);

  const rowActions = getRowActions(props.rowActions, setRowActionResult);
  const rowActionsMenu = getRowActions(
    props.rowActionsMenu,
    setRowActionResult,
    true
  );
  let rowActionsComputedWidth = getRowActionsWidth(
    props.rowActions,
    canvas,
    false
  );
  if (rowActionsComputedWidth !== undefined && rowActionsMenu) {
    rowActionsComputedWidth += DEFAULT_ROW_MENU_ICON_WIDTH;
  }
  const rowActionsMenuWidth = getRowActionsWidth(
    props.rowActionsMenu,
    canvas,
    true
  );

  const columns = useColumns(props.data, props.columns, props.columnsTransform);

  return (
    <TableComponent
      {...props}
      columns={columns}
      rowActions={rowActions}
      rowActionsComputedWidth={rowActionsComputedWidth}
      rowActionsMenu={rowActionsMenu}
      rowActionsMenuWidth={rowActionsMenuWidth}
      onRowSelectionChanged={changeRowSelection}
      tableRef={tableComponentRef}
    />
  );
};

function getRowActions<TRowData extends object>(
  rowActions: ConnectedTableProps<TRowData>["rowActions"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setRowActionResult: (mutation: MutationState<any>) => void,
  inMenu?: boolean
): ComponentRowAction<TRowData>[] | undefined {
  if (rowActions === undefined) {
    return undefined;
  }
  const arrayRowActions = Array.isArray(rowActions) ? rowActions : [rowActions];

  return arrayRowActions.map((rowAction) => {
    if (typeof rowAction === "function") {
      return rowAction;
    }
    if (
      typeof rowAction !== "string" &&
      !("slug" in rowAction) &&
      !("fn" in rowAction)
    ) {
      const WrappedButton: ComponentRowAction<TRowData> = ({ row }) => {
        return (
          <RowActionButton<TRowData>
            rowAction={rowAction}
            row={row}
            inMenu={inMenu}
          />
        );
      };
      return WrappedButton;
    }
    const WrappedButton: ComponentRowAction<TRowData> = ({ row }) => {
      return (
        <RowActionButtonWithTask<TRowData>
          rowAction={rowAction}
          setRowActionResult={setRowActionResult}
          row={row}
          inMenu={inMenu}
        />
      );
    };
    return WrappedButton;
  });
}

function getRowActionsWidth<TRowData extends object>(
  rowActions: ConnectedTableProps<TRowData>["rowActions"],
  canvas: HTMLCanvasElement,
  inMenu: boolean
): number | undefined {
  if (rowActions === undefined) {
    return 0;
  }
  const arrayRowActions = Array.isArray(rowActions) ? rowActions : [rowActions];

  if (arrayRowActions.some((rowAction) => typeof rowAction === "function")) {
    return undefined;
  }

  const context = canvas.getContext("2d");
  if (context) {
    context.font = `14px ${fontFamily}`;
  }

  const getTextWidth = (text: string) => {
    if (context) {
      return context.measureText(text).width;
    }
    // This shouldn't happen, but fall back to a default width per character
    return 10 * text.length;
  };

  const widths = arrayRowActions.map((rowAction) => {
    if (typeof rowAction === "function") {
      throw new Error("component row action has no width");
    }
    let label = "";
    if (
      typeof rowAction !== "string" &&
      !("slug" in rowAction) &&
      !("fn" in rowAction)
    ) {
      label = rowAction.label;
    } else {
      const fullMutation = getFullMutation(rowAction);
      const slug = getSlug(fullMutation);
      label = rowAction.label ?? slug;
    }
    // Account for 10px of padding on the left and right, and 5% error margin
    return (
      getTextWidth(label) * 1.05 +
      (typeof rowAction !== "string" && "href" in rowAction ? 45 : 20)
    );
  });
  if (inMenu) {
    // maximum width plus padding
    return widths.reduce((a, b) => Math.max(a, b)) + 8;
  } else {
    // total width plus padding
    return widths.reduce((a, b) => a + b, 16);
  }
}

const RowActionButton = <TRowData extends object>({
  rowAction,
  row,
  inMenu,
}: {
  rowAction: BasicRowAction<TRowData>;
  row: TRowData;
  inMenu?: boolean;
}) => {
  const label = rowAction.label;
  const buttonDisplayProps = getButtonDisplayProps(rowAction, inMenu);

  if ("href" in rowAction && rowAction.href) {
    return (
      <UnconnectedButton
        href={rowAction.href(row)}
        newTab={rowAction.newTab}
        stopPropagation
        {...buttonDisplayProps}
      >
        {label}
      </UnconnectedButton>
    );
  } else {
    return (
      <UnconnectedButton
        confirm={
          typeof rowAction.confirm === "function"
            ? rowAction.confirm(row)
            : rowAction.confirm
        }
        onClick={() => {
          rowAction.onClick(row);
        }}
        stopPropagation
        {...buttonDisplayProps}
      >
        {label}
      </UnconnectedButton>
    );
  }
};

const RowActionButtonWithTask = <TRowData extends object>({
  rowAction,
  setRowActionResult,
  row,
  inMenu,
}: {
  rowAction: TaskRowAction<TRowData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setRowActionResult: (mutation: MutationState<any>) => void;
  row: TRowData;
  inMenu?: boolean;
}) => {
  const fullMutation = getFullMutation(rowAction);
  const slug = getSlug(fullMutation);
  const label = rowAction.label ?? slug;
  const { onSuccess: fullMutationOnSuccess, onError: fullMutationOnError } =
    fullMutation;
  const onSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output: any, runID: string) => {
      setRowActionResult({
        output,
      });
      fullMutationOnSuccess?.(output, runID);
    },
    [setRowActionResult, fullMutationOnSuccess]
  );
  const onError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output: any, error: any, runID?: string, status?: RunStatus) => {
      setRowActionResult({
        output,
        error,
      });
      fullMutationOnError?.(output, error, runID);
    },
    [setRowActionResult, fullMutationOnError]
  );
  let getParamsFromRow = (row: TRowData): DefaultParams => row;
  if (rowAction.getParamsFromRow) {
    getParamsFromRow = rowAction.getParamsFromRow;
  } else if (rowAction.rowTransform) {
    // rowTransform is the deprecated version of getParamsFromRow.
    getParamsFromRow = rowAction.rowTransform;
  }
  const r = getParamsFromRow(row);
  const m: typeof fullMutation = {
    ...fullMutation,
    params: {
      ...r,
      ...fullMutation?.params,
    },
    onSuccess,
    onError,
  };
  const buttonDisplayProps = getButtonDisplayProps(rowAction, inMenu);
  return (
    <UnconnectedButton
      task={m}
      confirm={
        typeof rowAction.confirm === "function"
          ? rowAction.confirm(row)
          : rowAction.confirm
      }
      stopPropagation
      {...buttonDisplayProps}
    >
      {label}
    </UnconnectedButton>
  );
};

const getButtonDisplayProps = <TRowData extends object>(
  rowAction: TaskRowAction<TRowData, DefaultParams> | BasicRowAction<TRowData>,
  inMenu: boolean | undefined
) => {
  const buttonProps: Record<string, unknown> = {
    compact: true,
    size: "sm",
    preset: rowAction.preset,
    variant: rowAction.variant || (rowAction.preset ? undefined : "subtle"),
    color: rowAction.color,
  };
  if (rowAction.disabled !== undefined) {
    buttonProps.disabled = rowAction.disabled;
  }
  if (inMenu) {
    buttonProps.fullWidth = true;
    buttonProps.leftAlign = true;
    buttonProps.disableFocusRing = true;
    buttonProps.radius = "sm";
  }
  return buttonProps;
};

/**
 * useColumns is a hook that intelligently gets the columns for the table.
 *
 * This hook...
 * 1. Infers columns from the data
 * 2. Applies column transforms
 */
const useColumns = <TRowData extends object>(
  data: TRowData[],
  columns?: (Column<TRowData> | keyof TRowData)[],
  columnsTransform?: ConnectedTableProps<TRowData>["columnsTransform"]
) => {
  return useMemo(() => {
    const outputColumns = columns
      ? createColumns(columns)
      : tryInferColumns(data);
    if (columnsTransform) {
      return columnsTransform(outputColumns);
    }
    return outputColumns;
  }, [data, columns, columnsTransform]);
};

const createColumns = <TRowData extends object>(
  columns: (Column<TRowData> | keyof TRowData)[]
): Column<TRowData>[] => {
  return columns.map((colOrAccessor) => {
    if (isColumn(colOrAccessor)) {
      return {
        ...colOrAccessor,
        label:
          colOrAccessor.label === undefined
            ? colOrAccessor.accessor.toString()
            : colOrAccessor.label,
      };
    } else {
      return {
        accessor: colOrAccessor,
        label: colOrAccessor.toString(),
      };
    }
  });
};

const isColumn = <TRowData extends object>(
  colOrAccessor: Column<TRowData> | keyof TRowData
): colOrAccessor is Column<TRowData> => {
  return typeof colOrAccessor === "object";
};

const tryInferColumns = <TRowData extends object>(
  data: ConnectedTableProps<TRowData>["data"]
): Column<TRowData>[] => {
  if (data.length) {
    const keySet = new Set<keyof TRowData>();
    const keys: (keyof TRowData)[] = [];
    for (const row of data) {
      // The type assertion assumes that the data generic type
      // is an exact type (i.e. no extra properties) of the generic.
      for (const key of Object.keys(row) as Array<keyof TRowData>) {
        if (!keySet.has(key)) {
          keys.push(key);
          keySet.add(key);
        }
      }
    }
    return keys.map((key) => ({
      label: key.toString(),
      accessor: key,
    }));
  }
  return [];
};
