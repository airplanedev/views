import { ActionIcon, createStyles, Menu } from "@mantine/core";
import { isEqual } from "lodash-es";
import {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Hooks,
  Row,
  useFlexLayout,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
  Column as ReactTableColumn,
  TableHeaderProps,
  TableCellProps,
} from "react-table";
import { useSticky } from "react-table-sticky";

import { Button } from "components/button/Button";
import { CheckboxComponent as Checkbox } from "components/checkbox/Checkbox";
import { Heading } from "components/heading/Heading";
import {
  PencilSquareIconOutline,
  ArrowUpIconMini,
  ArrowDownIconMini,
  ArrowDownTrayIconMini,
  EllipsisVerticalIconSolid,
} from "components/icon";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { Skeleton } from "components/Skeleton";
import { Stack } from "components/stack/Stack";
import { Tooltip } from "components/tooltip/Tooltip";

import { Cell, dateTimeSort, getDefaultCellType } from "./Cell";
import { dataToCSVLink } from "./csvUtils";
import Filter from "./Filter";
import { Pagination } from "./Pagination";
import { useStyles } from "./Table.styles";
import { Column, ComponentRowAction, TableComponentProps } from "./Table.types";
import { OverflowText } from "./useIsOverflow";
import { useResizeColumns } from "./useResizeColumns";

const LOADING_ROW_COUNT = 10;
const LOADING_COL_COUNT = 4;
const DEFAULT_ROW_MENU_WIDTH = 160;
const ACTION_COLUMN_ID = "_action";

export type TableComponentElement = {
  toggleAllRowsSelected: (select?: boolean) => void;
};

export function TableComponent<TRowData extends object>({
  columns,
  data,
  onRowSelectionChanged,
  onToggleAllRows,
  onToggleRow,
  loading,
  error,
  noData = "No data",
  rowSelection,
  rowActions,
  rowActionsMenu,
  rowActionsWidth,
  rowActionsMenuWidth,
  defaultPageSize = 10,
  title,
  hiddenColumns,
  tableRef,
  showFilter = true,
  selectAll = true,
  rowID,
  isSelectedRow,
  isDefaultSelectedRow,
  freezeRowActions = true,
  enableCSVDownload,
  className,
  style,
  width,
  height,
  grow,
}: TableComponentProps<TRowData> & { tableRef: Ref<TableComponentElement> }) {
  const rowActionRef = useRef<HTMLDivElement>(null);
  const { classes, cx } = useStyles();
  // dirtyCells is a map of row IDs to a set of column IDs that have been edited.
  const [dirtyCells, setDirtyCells] = useState<Record<string, Set<string>>>({});
  const { classes: layoutClasses } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  const [tableData, setData] = useState<typeof data>([]);
  const [columnTypes, setColumnTypes] = useState<
    Record<string, Column["type"]>
  >({});
  useEffect(() => {
    if (loading) {
      setData(Array(LOADING_ROW_COUNT).fill({}));
    } else {
      setData(data);
    }
  }, [loading, data]);
  const [skipDirtyColumnIDReset, setSkipDirtyColumnIDReset] = useState(false);
  // After data changes, we turn this flag back off
  // so that if data actually changes when we're not
  // editing it, the state is reset.
  useEffect(() => {
    setSkipDirtyColumnIDReset(false);
  }, [tableData]);

  const [tableColumns, setTableColumns] = useState<
    ReactTableColumn<TRowData>[]
  >([]);
  useEffect(() => {
    const hiddenSet = new Set(hiddenColumns);
    const newTableColumns = columns
      .filter(
        (c) => typeof c.accessor === "string" && !hiddenSet.has(c.accessor)
      )
      .map((c) => {
        const id = c.accessor as string;
        let type = c.type;
        if (!type && id && columnTypes[id]) {
          type = columnTypes[id];
        }

        const col: ReactTableColumn<TRowData> = {
          ...c,
          id,
          type,
          // Pass in the accessor as a string to know if the columns have changed
          _accessor: c.accessor,
          accessor: (data) => data[c.accessor],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Component: c.Component as any,
        };

        if (type === "boolean") {
          col.sortType = "basic";
        } else if (type === "date" || type === "datetime") {
          col.sortType = dateTimeSort;
        }

        return col;
      });
    if (loading || error || !columns.length) {
      const cs = columns.length
        ? newTableColumns
        : Array.from({ length: LOADING_COL_COUNT }, (_, i) => ({
            id: String(i),
          }));
      const loadingColumns = cs.map((column) => ({
        ...column,
        Cell: <Skeleton height={8} mt={16} mx={16} width="25%" radius="sm" />,
      }));
      setTableColumns(loadingColumns);
    } else if (didColumnsChange(newTableColumns, tableColumns)) {
      setTableColumns(newTableColumns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, columns, error, columnTypes, hiddenColumns]); // Don't include tableColumns to avoid an unnecessary re-render

  const getRowId = useCallback(
    (row: TRowData, relativeIndex: number): string => {
      const id = rowID ?? "id";
      if (id in row) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return String((row as any)[id]);
      } else if (rowID) {
        // eslint-disable-next-line no-console
        console.warn(
          `Row ID ${rowID} not found in row data. Falling back to the row's index.`
        );
      }
      return relativeIndex.toString();
    },
    [rowID]
  );

  const updateData = useCallback(
    (row: Row<TRowData>, columnId: string, value: unknown) => {
      const rowIndex = row.index;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialValue = (data[rowIndex] as any)[columnId];
      let dirty = !isEqual(value, initialValue);
      if (typeof value === "boolean" && !value && !initialValue) {
        // For boolean values, treat all falsy values the same.
        dirty = false;
      }
      const dirtyCellsCopy = new Set(dirtyCells[row.id] ?? []);
      if (dirty) {
        dirtyCellsCopy.add(columnId);
      } else {
        dirtyCellsCopy.delete(columnId);
      }
      setDirtyCells({ ...dirtyCells, [row.id]: dirtyCellsCopy });
      setSkipDirtyColumnIDReset(true);

      setData((old) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentVal = (old[rowIndex] as any)[columnId];
        if (currentVal === value) {
          // Nothing changed
          return old;
        }
        const oldCopy = [...old];
        oldCopy[rowIndex] = {
          ...oldCopy[rowIndex],
          [columnId]: value,
        };
        return oldCopy;
      });
    },
    [data, dirtyCells]
  );
  const defaultColumn = useMemo(
    () => ({
      Cell,
      minWidth: 50, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 300, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  function addCheckboxSelection(hooks: Hooks<TRowData>) {
    if (rowSelection === "checkbox" && !loading) {
      hooks.visibleColumns.push((columns) => [
        {
          id: "_selection",
          width: "auto",
          disableResizing: true,
          Header: ({ getToggleAllRowsSelectedProps, onToggleAllRows, rows }) =>
            selectAll && (!isSelectedRow || onToggleAllRows) ? (
              <Checkbox
                {...getToggleAllRowsSelectedProps()}
                onChange={(value: boolean) => {
                  toggleAllRowsSelected(value);
                  if (onToggleAllRows) {
                    onToggleAllRows(value);
                  }
                }}
                className={classes.checkbox}
              />
            ) : null,
          Cell: ({
            row,
            onToggleRow,
          }: {
            row: Row<TRowData>;
            onToggleRow?: (row: TRowData, idx: number) => void;
          }) => {
            const toggleRowSelectedProps = row.getToggleRowSelectedProps();
            return (
              <Checkbox
                {...toggleRowSelectedProps}
                onChange={(checked) => {
                  row.toggleRowSelected(checked);
                  onToggleRow?.(row.original, row.index);
                }}
                className={classes.checkbox}
              />
            );
          },
        },
        ...columns,
      ]);
    }
  }

  function addActions(hooks: Hooks<TRowData>) {
    if (rowActions?.length || (rowActionsMenu?.length && !loading)) {
      const contentWidth = rowActionRef.current?.offsetWidth;
      const actionsColumn = {
        id: ACTION_COLUMN_ID,
        width: rowActionsWidth || contentWidth,
        sticky: freezeRowActions ? "right" : undefined,
        // Overwrite maxWidth for actions column with arbitrarily large value
        maxWidth: 10000,
        Cell: ({ row }: { row: Row<TRowData> }) => {
          return (
            <div className={classes.actionContainer} ref={rowActionRef}>
              {rowActions?.map((RowActionComponent, i) => (
                <RowActionComponent key={i} row={row.original} />
              ))}
              {rowActionsMenu && (
                <RowActionsMenu
                  width={Math.max(
                    DEFAULT_ROW_MENU_WIDTH,
                    rowActionsMenuWidth || 0
                  )}
                  rowActionsMenu={rowActionsMenu}
                  row={row}
                />
              )}
            </div>
          );
        },
      };
      hooks.visibleColumns.push((columns) => [...columns, actionsColumn]);
    }
  }

  function rowSelectorToRowIds(
    data: TRowData[],
    rowSelector?: (row: TRowData, rowIndex: number) => boolean
  ): Record<string, boolean> {
    if (rowSelector === undefined) {
      return {};
    }

    const rowIds = data
      .map((row, idx): [TRowData, number] => [row, idx])
      .filter(([row, idx]) => rowSelector(row, idx))
      .map(([row, idx]) => getRowId(row, idx));

    const ret: Record<string, boolean> = {};
    if (rowSelection === "single" && rowIds.length) {
      ret[rowIds[0]] = true;
    } else {
      rowIds.forEach((rowId) => {
        ret[rowId] = true;
      });
    }
    return ret;
  }

  const defaultSelectedRowIds = useMemo(() => {
    if (loading) {
      return {};
    }
    return rowSelectorToRowIds(data, isDefaultSelectedRow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]); // We only want to update the row selection state when the table stops loading.

  const headerGroupOffsetWidths = useRef<Array<number>>([]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    prepareRow,
    rows: allRows,
    // pagination
    page: rows,
    gotoPage,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    // filtering
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
    // row selection
    selectedFlatRows,
    toggleAllRowsSelected,
    visibleColumns,
  } = useTable<TRowData>(
    {
      columns: tableColumns,
      data: tableData,
      initialState: {
        pageIndex: 0,
        pageSize: defaultPageSize,
        selectedRowIds: defaultSelectedRowIds,
      },
      defaultColumn,
      autoResetPage: false,
      autoResetSortBy: false,
      autoResetGlobalFilter: false,
      autoResetSelectedRows: false,
      getRowId,
      // updateData and dirtyCells aren't part of the API, but anything we put into these options will
      // be available to call on our cell renderer
      updateData,
      dirtyCells,
      rowOffsetWidth:
        headerGroupOffsetWidths.current?.reduce(
          (sum, width) => sum + width,
          0
        ) ?? 0,
      // onToggleRow and onToggleAllRows are passed so that checkbox-based
      // row selection can use them if needed.
      onToggleRow,
      onToggleAllRows,
      useControlledState: (state) =>
        useMemo(() => {
          if (!isSelectedRow) {
            return state;
          }

          return {
            ...state,
            selectedRowIds: rowSelectorToRowIds(data, isSelectedRow),
          };
          // Here, react-table's documentation suggests doing it this way, even though the
          // linter complains that data and isSelectedRow are not locally in the hook.
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [state, data, isSelectedRow]),
    },
    useFlexLayout,
    useResizeColumns,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useSticky,
    (hooks) => {
      addCheckboxSelection(hooks);
      addActions(hooks);
    }
  );

  const setFilter = useCallback(
    (val: unknown) => {
      setGlobalFilter(val);
      gotoPage(0);
    },
    [setGlobalFilter, gotoPage]
  );

  useEffect(() => {
    // Infer column types from the row data.
    let cTypes = columnTypes; // Set cTypes to columnTypes so that if no types change, the reference is the same.
    allRows.forEach((r) => {
      r.allCells?.forEach((c) => {
        const cid = c.column.id;
        let cellType =
          c.column.type || getDefaultCellType(c.value, c.column.typeOptions);
        if (cid in cTypes && cellType !== cTypes[cid]) {
          // The columnType is mismatched. Default it to string as we don't know
          // what type the column is.
          cellType = "string";
        }

        if (cTypes[cid] !== cellType) {
          // The column type changed.
          cTypes = { ...cTypes, [cid]: cellType };
        }
      });
    });

    setColumnTypes(cTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRows]); // Don't include columnTypes to avoid an unnecessary re-render

  useEffect(() => {
    if (onRowSelectionChanged) {
      onRowSelectionChanged(selectedFlatRows.map((r) => r.original));
    }
  }, [selectedFlatRows, onRowSelectionChanged]);

  useImperativeHandle(tableRef, () => ({
    toggleAllRowsSelected,
  }));

  const dataAsCSVLink = useMemo(() => {
    if (!enableCSVDownload) {
      return "";
    }
    const rowToData = (row: Row<TRowData>) => {
      return visibleColumns.map((column) => row.values[column.id]);
    };
    const cols = tableColumns.map((c) => String(c.label || c.id || ""));

    return dataToCSVLink(cols, allRows.map(rowToData));
  }, [allRows, visibleColumns, enableCSVDownload, tableColumns]);

  // We shrink the list of header group offsetWidths here, just in case the number
  // of header groups reduces (e.g. if data changes and the number of inferred
  // header groups shrinks).
  useEffect(() => {
    headerGroupOffsetWidths.current = headerGroupOffsetWidths.current.slice(
      0,
      headerGroups.length
    );
  }, [headerGroups.length]);

  useEffect(() => {
    // When the table data updates, reset the dirtyCells.
    // We do this because edits are wiped away when the table data changes.
    // We may want to change this behavior to avoid blowing away edits
    // when the data changes—this would require tracking the editted data separately
    // and providing a way to merge the two.
    if (!skipDirtyColumnIDReset) {
      setDirtyCells({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run this when tableData changes.
  }, [tableData]);

  const hasPagination = canNextPage || canPreviousPage;
  return (
    <div
      style={style}
      className={cx(classes.tableContainer, layoutClasses.style, className)}
    >
      {(title || showFilter) && (
        <div className={classes.tableChrome}>
          <Heading level={6} style={{ fontWeight: 600 }}>
            {title}
          </Heading>
          <div className={classes.tableActions}>
            {showFilter && (
              <Filter initialValue={globalFilter} setValue={setFilter} />
            )}
          </div>
        </div>
      )}
      <div
        {...getTableProps((props) => ({
          ...props,
          // Override the calculated minWidth to prevent double scroll bars. See AIR-4272 for more details.
          style: { ...props.style, minWidth: 0 },
        }))}
        className="table"
      >
        <div className="thead">
          {headerGroups.map((headerGroup, headerGroupIdx) => (
            // eslint-disable-next-line react/jsx-key
            <div
              {...headerGroup.getHeaderGroupProps({})}
              className="tr"
              ref={(elem) =>
                (headerGroupOffsetWidths.current[headerGroupIdx] =
                  elem?.offsetWidth ?? 0)
              }
            >
              {headerGroup.headers.map((column, i) => {
                const columnProps = fixActionCol(
                  column.getHeaderProps(
                    column.getSortByToggleProps({ title: undefined })
                  )
                );
                const nextColumn = headerGroup.headers[i + 1];
                return (
                  // eslint-disable-next-line react/jsx-key
                  <div
                    {...columnProps}
                    className={cx("th", {
                      [classes.headerWithLabel]: !!column.label,
                    })}
                  >
                    <OverflowText weight="medium" value={column.label} />
                    {column.isSorted && (
                      <div className="sortIcon">
                        {column.isSortedDesc ? (
                          <ArrowDownIconMini />
                        ) : (
                          <ArrowUpIconMini />
                        )}
                      </div>
                    )}
                    {column.canEdit && <EditIcon />}
                    {column.canResize &&
                      nextColumn?.id !== ACTION_COLUMN_ID && (
                        <div
                          {...column.getResizerProps()}
                          className={cx("resizer", {
                            isResizing: column.isResizing,
                          })}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      )}
                    {!column.label && column.render("Header")}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="tbody">
          {!error && allRows.length === 0 && !loading && (
            <div className={classes.noData}>{noData}</div>
          )}
          {error && <div className={classes.noData}>{error}</div>}
          {rows.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <div
                {...row.getRowProps()}
                onClick={() => {
                  if (rowSelection === "single") {
                    const wasRowSelected = row.isSelected;
                    toggleAllRowsSelected(false);
                    if (!wasRowSelected) {
                      row.toggleRowSelected();
                    }
                    onToggleRow?.(row.original, row.index);
                  }
                }}
                className={cx("tr", {
                  [classes.selectableRow]: rowSelection === "single",
                  [classes.selectedRow]: row.isSelected,
                })}
              >
                {row.cells.map((cell) => {
                  const cellProps = fixActionCol(cell.getCellProps());
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <div
                      {...cellProps}
                      className={cx("td", {
                        [classes.cellEditIcon]: !row.isSelected,
                        [classes.cellEditIconSelected]: row.isSelected,
                      })}
                    >
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {(hasPagination || enableCSVDownload) && (
        <div className={classes.tableFooter}>
          <div>
            {enableCSVDownload && (
              <a
                href={dataAsCSVLink}
                download="table_data.csv"
                data-testid="csvDownload"
              >
                <ActionIcon size="sm">
                  <ArrowDownTrayIconMini />
                </ActionIcon>
              </a>
            )}
          </div>
          <div className={classes.paginationContainer}>
            {hasPagination && (
              <Pagination
                hasPrevPage={canPreviousPage}
                hasNextPage={canNextPage}
                onNext={nextPage}
                onPrev={previousPage}
                pageIndex={pageIndex}
                total={allRows.length}
                pageSize={pageSize}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const EditIcon = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.headerEditIcon}>
      <Tooltip position="right" label={<EditTooltip />}>
        <PencilSquareIconOutline />
      </Tooltip>
    </div>
  );
};

const useTooltipStyles = createStyles((theme) => {
  return {
    info: {
      color: theme.colors.dark[2],
    },
    header: {
      background: theme.colors.dark[7],
      // Negative margin to compensate for the padding on the tooltip
      margin: "-4px -8px 0 -8px",
      padding: "4px 8px",
    },
    shortcut: {
      display: "flex",
      justifyContent: "space-between",
    },
    command: {
      backgroundColor: theme.colors.gray[6],
      borderRadius: 2,
      padding: "0 4px",
    },
  };
});

const EditTooltip = () => {
  const { classes } = useTooltipStyles();
  return (
    <Stack spacing="xs">
      <span className={classes.header}>This column is editable</span>
      <div className={classes.shortcut}>
        <span>Save</span>
        <span className={classes.command}>⇧ + ⏎</span>
      </div>
      <div className={classes.shortcut}>
        <span>Cancel</span>
        <kbd className={classes.command}>Esc</kbd>
      </div>
    </Stack>
  );
};

const RowActionsMenu = <TRowData extends object>({
  width,
  rowActionsMenu,
  row,
}: {
  width: number;
  rowActionsMenu: ComponentRowAction<TRowData>[];
  row: Row<TRowData>;
}) => {
  const { classes } = useStyles();
  return (
    <Menu
      width={width}
      position="bottom-end"
      classNames={{ dropdown: classes.dropdown }}
      zIndex={150}
      withinPortal
    >
      <Menu.Target>
        <Button
          variant="subtle"
          compact
          radius="xs"
          disableFocusRing
          className={classes.ellipsisMenuButton}
          stopPropagation
        >
          <EllipsisVerticalIconSolid size="lg" color="gray.4" />
        </Button>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        {rowActionsMenu?.map((RowActionComponent, i) => (
          <div role="button" key={i}>
            <RowActionComponent row={row.original} />
          </div>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

const didColumnsChange = <TRowData extends object>(
  currColumns: ReactTableColumn<TRowData>[],
  newColumns: ReactTableColumn<TRowData>[]
) => {
  if (currColumns.length !== newColumns.length) {
    return true;
  }
  for (let i = 0; i < currColumns.length; i++) {
    const currColumn = { ...currColumns[i] };
    const newColumn = { ...newColumns[i] };
    // Don't compare the accessor function since that will always be different.
    delete currColumn.accessor;
    delete newColumn.accessor;
    if (!isEqual(currColumn, newColumn)) {
      return true;
    }
  }
  return false;
};

/**
 * fixActionCol prevents the action column from being resized.
 *
 * This is a hack to override the flex grow set by useFlexLayout.
 */
const fixActionCol = (props: TableHeaderProps | TableCellProps) => {
  if (props.key.toString().endsWith(ACTION_COLUMN_ID) && props.style) {
    // useFlexLayout sets the flex grow in proportion to its width.
    // This prevents the action column from growing.
    props.style.flex = "0 0 auto";
  }
  return props;
};
