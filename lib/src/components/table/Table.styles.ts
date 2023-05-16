import { createStyles } from "@mantine/core";

import { getEditIconStyle } from "./getEditIconStyle";

export const useStyles = createStyles((theme) => {
  const rowHeight = "2.25rem";
  const headerBgColor = theme.colors.gray[0];
  const hoverRowBgColor = theme.colors.gray[0];
  const selectedRowBgColor = theme.colors.gray[1];
  return {
    // Resizing style borrowed from https://codesandbox.io/s/react-table-full-width-resizable-0146k
    tableContainer: {
      overflow: "auto",
      borderRadius: theme.radius.md,
      border: theme.other.borderStyles.default,
      ".table": {
        overflow: "auto",
        ...theme.fn.fontStyles(),
        fontSize: theme.other.typography.textPreset["sm"].fontSize, // NOTE: This seems to be a catch all, I'm not sure if it does anything but matching to be new body size for the table (14px). We can remove this if it's not needed (and maybe even the line above — not sure what that does).
        display: "block",
        borderSpacing: 0,

        ".tr": {
          minWidth: "fit-content !important",
          "&:hover, &:hover [data-sticky-td]": {
            background: hoverRowBgColor,
          },
        },

        ".tbody .tr": {
          borderTop: theme.other.borderStyles.light,
        },

        ".th, .th[data-sticky-td]": {
          background: headerBgColor,
        },

        ".th": {
          background: headerBgColor,
          borderRight: theme.other.borderStyles.light,
          whiteSpace: "nowrap",

          // To align the sort icons within the <th>
          display: "flex",
          alignItems: "center",

          ".sortIcon": {
            display: "flex",
            alignItems: "center",
            color: theme.colors.gray[5],
          },

          "&:last-child": {
            borderRight: "none",

            ".resizer": {
              display: "none",
            },
          },

          // For the absolutely positioned resizer div
          position: "relative",

          // To make the resizer divs clickable from either side of the column line
          overflowX: "visible",

          ".isResizing": {
            userSelect: "none",
          },

          ".resizer": {
            position: "absolute",
            width: "16px",
            right: "-8px",
            top: 0,
            zIndex: 1,
            display: "inline-flex",
            alignItems: "center",
            height: "100%",
            touchAction: "none",
            color: theme.colors.gray[6],

            "&:hover::before, &.isResizing::before": {
              background: theme.colors.gray[3],
            },

            "&::before": {
              position: "absolute",
              content: '""',
              width: "5px",
              height: "calc(100% - 12px)",
              borderRadius: "4px",
              left: "6px",
            },
          },
        },

        ".td": {
          borderRight: theme.other.borderStyles.light,
          overflow: "hidden",

          "&:last-child": {
            borderRight: "none",
          },
        },

        ".th, .td": {
          display: "flex",

          margin: 0,
          textOverflow: "ellipsis",
          minHeight: rowHeight,
        },

        "[data-sticky-td]": {
          background: "#fff",
          boxShadow: `-1px 0px ${theme.colors.gray[2]}`,
        },
      },
    },
    noData: {
      borderTop: theme.other.borderStyles.light,
      ...theme.other.typography.textPreset["sm"],
      height: "2.5rem",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.colors.gray[5],
    },
    selectableRow: {
      cursor: "pointer",
      ".staticCell": {
        cursor: "pointer !important",
      },
    },
    selectedRow: {
      background: `${selectedRowBgColor} !important`,
      position: "relative",

      "&::before": {
        position: "absolute",
        content: '""',
        width: "2px",
        height: "100%",
        background: theme.colors.gray[3],
      },

      ".td": {
        borderRightColor: `${theme.colors.gray[2]} !important`,
      },

      "[data-sticky-td]": {
        background: `${theme.colors.gray[1]} !important`,
      },
    },
    paginationContainer: {
      display: "flex",
    },
    actionContainer: {
      display: "flex",
      alignItems: "flex-start",
      padding: "calc(0.5rem - 1px)", // calc of -1px is a temporary fix since the rowAction button is 26px tall (as opposed to 24px)
      "> *:not(:last-child)": {
        marginRight: theme.spacing.xs,
      },
      width: "100%",
    },

    tableChrome: {
      background: theme.colors.gray[1],
      fontWeight: 600,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.xs,
      minHeight: "2.5rem",
      borderBottom: theme.other.borderStyles.light,
    },

    tableActions: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.md,
      minHeight: "32px", // Standardizes the height of the action bar area such that it doesn't shift if no filter is present
    },

    tableFooter: {
      background: headerBgColor,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.xs,
      paddingRight: theme.spacing.sm,
      paddingLeft: theme.spacing.sm,
      borderTop: theme.other.borderStyles.light,
      minHeight: rowHeight,
    },

    checkbox: {
      margin: "auto",
      lineHeight: 0,
    },
    headerWithLabel: {
      padding: "0 1rem",
    },
    headerEditIcon: {
      ...getEditIconStyle(theme, headerBgColor),
      lineHeight: "initial",
    },
    ellipsisMenuButton: {
      padding: 0,
      "&:hover": {
        backgroundColor: theme.colors.gray[1],
        borderRadius: theme.radius.sm,
      },
    },
    dropdown: {
      marginTop: -theme.spacing.sm,
      boxShadow: theme.shadows.sm,
    },

    cellEditIcon: {
      ".cellEditIcon": {
        ...getEditIconStyle(theme, hoverRowBgColor),
        marginTop: "8px", // To align the edit icon with the text
      },
    },
    cellEditIconSelected: {
      ".cellEditIcon": {
        ...getEditIconStyle(theme, selectedRowBgColor),
        marginTop: "8px",
      },
    },
  };
});
