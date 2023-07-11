/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  //   UseColumnOrderInstanceProps,
  //   UseColumnOrderState,
  //   UseExpandedHooks,
  //   UseExpandedInstanceProps,
  //   UseExpandedOptions,
  //   UseExpandedRowProps,
  //   UseExpandedState,
  //   UseFiltersColumnOptions,
  //   UseFiltersColumnProps,
  //   UseFiltersInstanceProps,
  //   UseFiltersOptions,
  //   UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  //   UseGroupByCellProps,
  //   UseGroupByColumnOptions,
  //   UseGroupByColumnProps,
  //   UseGroupByHooks,
  //   UseGroupByInstanceProps,
  //   UseGroupByOptions,
  //   UseGroupByRowProps,
  //   UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseRowStateCellProps,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateRowProps,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from "react-table";

import { UseCustomCellProps } from "./react-table-config.types";

declare module "react-table" {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<D extends Record<string, unknown>>
    extends UseExpandedOptions<D>,
      //   UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      //   UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D>,
      // note that having Record here allows you to add anything to the options, this matches the spirit of the
      // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
      // feature set, this is a safe default.
      Record<string, any> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Hooks<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UseSortByHooks<D>,
      //   UseExpandedHooks<D>,
      //   UseGroupByHooks<D>,
      UseRowSelectHooks<D> {}

  export interface TableInstance<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UsePaginationInstanceProps<D>,
      //   UseExpandedInstanceProps<D>,
      //   UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      //   UseGroupByInstanceProps<D>,
      //   UseColumnOrderInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UsePaginationState<D>,
      //   UseExpandedState<D>,
      //   UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      //   UseGroupByState<D>,
      //   UseColumnOrderState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {}

  export interface ColumnInterface<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UseResizeColumnsColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      //   UseGroupByColumnOptions<D>,
      //   UseFiltersColumnOptions<D>,
      UseCustomCellProps,
      UseSortByColumnOptions<D> {}

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UseResizeColumnsColumnProps<D>,
      UseCustomCellProps,
      //   UseGroupByColumnProps<D>,
      //   UseFiltersColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Cell<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UseRowStateCellProps<D> {}
  // UseGroupByCellProps<D> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Row<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UseRowSelectRowProps<D>,
      //   UseExpandedRowProps<D>,
      //   UseGroupByRowProps<D>,
      UseRowStateRowProps<D> {}
}
