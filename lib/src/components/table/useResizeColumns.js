// Based on src/plugin-hooks/useResizeColumn.js in github.com/TanStack/table (v7 branch)
//
// The main approach is that we store the total offsetWidth (i.e. actual pixel width) of
// the row (in rowOffsetWidth) and the total flex width of the row (i.e. sum of flex
// widths of each column, in totalFlexWidth). Then, given how many pixels the mouse has
// moved while dragging the resizer, we can compute how much the flex width of a column
// needs to change for the column pixel width to be set to the correct amount.
//
// Changes from the original are marked with CHANGE comments.
import React from "react";
import {
  actions,
  defaultColumn,
  makePropGetter,
  useGetLatest,
  ensurePluginOrder,
  useMountedLayoutEffect,
} from "react-table";

// Default Column
defaultColumn.canResize = true;

// Actions
actions.columnStartResizing = "columnStartResizing";
actions.columnResizing = "columnResizing";
actions.columnDoneResizing = "columnDoneResizing";
actions.resetResize = "resetResize";

export const useResizeColumns = (hooks) => {
  hooks.getResizerProps = [defaultGetResizerProps];
  hooks.getHeaderProps.push({
    style: {
      position: "relative",
    },
  });
  hooks.stateReducers.push(reducer);
  hooks.useInstance.push(useInstance);
  hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions);
};

// CHANGE: getFirstDefined and passiveEventSupported are from table/src/utils.js in the above repo.
function getFirstDefined(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== "undefined") {
      return args[i];
    }
  }
}

let passiveSupported = null;
function passiveEventSupported() {
  // memoize support to avoid adding multiple test events
  if (typeof passiveSupported === "boolean") return passiveSupported;

  let supported = false;
  try {
    const options = {
      get passive() {
        supported = true;
        return false;
      },
    };

    window.addEventListener("test", null, options);
    window.removeEventListener("test", null, options);
  } catch (err) {
    supported = false;
  }
  passiveSupported = supported;
  return passiveSupported;
}

const defaultGetResizerProps = (props, { instance, header }) => {
  // CHANGE: rowOffsetWidth (i.e. the actual row width) is expected to be passed into `instance`,
  // so is pulled out here.
  const { dispatch, visibleColumns, rowOffsetWidth } = instance;

  const onResizeStart = (e, header) => {
    let isTouchEvent = false;
    if (e.type === "touchstart") {
      // lets not respond to multiple touches (e.g. 2 or 3 fingers)
      if (e.touches && e.touches.length > 1) {
        return;
      }
      isTouchEvent = true;
    }
    const headersToResize = getLeafHeaders(header);
    const headerIdWidths = headersToResize.map((d) => [d.id, d.totalWidth]);

    const clientX = isTouchEvent ? Math.round(e.touches[0].clientX) : e.clientX;

    let raf;
    let mostRecentClientX;

    const dispatchEnd = () => {
      window.cancelAnimationFrame(raf);
      raf = null;
      dispatch({ type: actions.columnDoneResizing });
    };
    const dispatchMove = () => {
      window.cancelAnimationFrame(raf);
      raf = null;
      dispatch({ type: actions.columnResizing, clientX: mostRecentClientX });
    };

    const scheduleDispatchMoveOnNextAnimationFrame = (clientXPos) => {
      mostRecentClientX = clientXPos;
      if (!raf) {
        raf = window.requestAnimationFrame(dispatchMove);
      }
    };

    const handlersAndEvents = {
      mouse: {
        moveEvent: "mousemove",
        moveHandler: (e) => scheduleDispatchMoveOnNextAnimationFrame(e.clientX),
        upEvent: "mouseup",
        upHandler: (e) => {
          document.removeEventListener(
            "mousemove",
            handlersAndEvents.mouse.moveHandler,
          );
          document.removeEventListener(
            "mouseup",
            handlersAndEvents.mouse.upHandler,
          );
          dispatchEnd();
        },
      },
      touch: {
        moveEvent: "touchmove",
        moveHandler: (e) => {
          if (e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
          }
          scheduleDispatchMoveOnNextAnimationFrame(e.touches[0].clientX);
          return false;
        },
        upEvent: "touchend",
        upHandler: (e) => {
          document.removeEventListener(
            handlersAndEvents.touch.moveEvent,
            handlersAndEvents.touch.moveHandler,
          );
          document.removeEventListener(
            handlersAndEvents.touch.upEvent,
            handlersAndEvents.touch.moveHandler,
          );
          dispatchEnd();
        },
      },
    };

    const events = isTouchEvent
      ? handlersAndEvents.touch
      : handlersAndEvents.mouse;
    const passiveIfSupported = passiveEventSupported()
      ? { passive: false }
      : false;
    document.addEventListener(
      events.moveEvent,
      events.moveHandler,
      passiveIfSupported,
    );
    document.addEventListener(
      events.upEvent,
      events.upHandler,
      passiveIfSupported,
    );

    dispatch({
      type: actions.columnStartResizing,
      columnId: header.id,
      columnWidth: header.totalWidth,
      headerIdWidths,
      clientX,
      // CHANGE: we dispatch the start-resizing event including both the real
      // row width, as well as the sum of the flex width (to compute the ratio between them).
      rowOffsetWidth,
      totalFlexWidth: visibleColumns.reduce(
        (sum, col) => sum + col.totalFlexWidth,
        0,
      ),
    });
  };

  return [
    props,
    {
      onMouseDown: (e) => e.persist() || onResizeStart(e, header),
      onTouchStart: (e) => e.persist() || onResizeStart(e, header),
      style: {
        cursor: "col-resize",
      },
      draggable: false,
      role: "separator",
    },
  ];
};

useResizeColumns.pluginName = "useResizeColumns";

function reducer(state, action) {
  if (action.type === actions.init) {
    return {
      columnResizing: {
        columnWidths: {},
      },
      ...state,
    };
  }

  if (action.type === actions.resetResize) {
    return {
      ...state,
      columnResizing: {
        columnWidths: {},
      },
    };
  }

  if (action.type === actions.columnStartResizing) {
    const {
      clientX,
      columnId,
      columnWidth,
      headerIdWidths,
      rowOffsetWidth,
      totalFlexWidth,
    } = action;

    return {
      ...state,
      columnResizing: {
        ...state.columnResizing,
        startX: clientX,
        headerIdWidths,
        columnWidth,
        isResizingColumn: columnId,
        rowOffsetWidth,
        totalFlexWidth,
      },
    };
  }

  if (action.type === actions.columnResizing) {
    const { clientX } = action;
    const {
      startX,
      columnWidth,
      headerIdWidths = [],
      rowOffsetWidth,
    } = state.columnResizing;

    // CHANGE: here, we do a different computation to figure out the new column width (see below)
    // so that the resizer moves by deltaX pixels.
    const deltaX = clientX - startX;
    const actualColumnWidth =
      state.columnResizing.totalFlexWidth !== 0
        ? (columnWidth * rowOffsetWidth) / state.columnResizing.totalFlexWidth
        : columnWidth;

    const targetColumnWidth = deltaX + actualColumnWidth;

    // Solution to the equation:
    // real column width + delta X = real row width (flex width + d) / (total flex width + d)
    // d = ...
    const columnWidthDelta =
      rowOffsetWidth !== targetColumnWidth
        ? (targetColumnWidth * state.columnResizing.totalFlexWidth -
            rowOffsetWidth * columnWidth) /
          (rowOffsetWidth - targetColumnWidth)
        : deltaX;

    const newColumnWidths = {};

    headerIdWidths.forEach(([headerId, headerWidth]) => {
      newColumnWidths[headerId] = Math.max(headerWidth + columnWidthDelta, 0);
    });

    return {
      ...state,
      columnResizing: {
        ...state.columnResizing,
        columnWidths: {
          ...state.columnResizing.columnWidths,
          ...newColumnWidths,
        },
      },
    };
  }

  if (action.type === actions.columnDoneResizing) {
    return {
      ...state,
      columnResizing: {
        ...state.columnResizing,
        startX: null,
        isResizingColumn: null,
      },
    };
  }
}

const useInstanceBeforeDimensions = (instance) => {
  const {
    flatHeaders,
    disableResizing,
    getHooks,
    state: { columnResizing },
  } = instance;

  const getInstance = useGetLatest(instance);

  flatHeaders.forEach((header) => {
    const canResize = getFirstDefined(
      header.disableResizing === true ? false : undefined,
      disableResizing === true ? false : undefined,
      true,
    );

    header.canResize = canResize;
    // CHANGE: here we differentiate between trying to set a column width to
    // 0 (in which case we should try the minimum width) versus having an
    // undefined resize-width (which means we haven't tried resizing this
    // column, so we shouldn't try min-width).
    if (columnResizing.columnWidths[header.id] > 0) {
      header.width = columnResizing.columnWidths[header.id];
    } else if (columnResizing.columnWidths[header.id] === 0) {
      header.width = header.minWidth || header.originalWidth || header.width;
    } else {
      header.width = header.originalWidth || header.width;
    }
    header.isResizing = columnResizing.isResizingColumn === header.id;

    if (canResize) {
      header.getResizerProps = makePropGetter(getHooks().getResizerProps, {
        instance: getInstance(),
        header,
      });
    }
  });
};

function useInstance(instance) {
  const { plugins, dispatch, autoResetResize = true, columns } = instance;

  ensurePluginOrder(plugins, ["useAbsoluteLayout"], "useResizeColumns");

  const getAutoResetResize = useGetLatest(autoResetResize);
  useMountedLayoutEffect(() => {
    if (getAutoResetResize()) {
      dispatch({ type: actions.resetResize });
    }
  }, [columns]);

  const resetResizing = React.useCallback(
    () => dispatch({ type: actions.resetResize }),
    [dispatch],
  );

  Object.assign(instance, {
    resetResizing,
  });
}

function getLeafHeaders(header) {
  const leafHeaders = [];
  const recurseHeader = (header) => {
    if (header.columns && header.columns.length) {
      header.columns.map(recurseHeader);
    }
    leafHeaders.push(header);
  };
  recurseHeader(header);
  return leafHeaders;
}
