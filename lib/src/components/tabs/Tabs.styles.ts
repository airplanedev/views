import { createStyles } from "@mantine/core";

import { TabsPlacement } from "./Tabs.types";

type StyleParams = {
  placement: TabsPlacement;
};

export const useStyles = createStyles((theme, params: StyleParams) => {
  // TODO: replace with design tokens
  return {
    root: { height: "100%" },
    tabIcon: { color: theme.colors.gray[6] },
    tabLabel: {
      ...theme.other.typography.headingPreset[6],
      lineHeight: "1.5rem",
      color: theme.colors.gray[7],
      marginTop: 0,
    },
    tab: {
      // Fixes the margin of the active tab
      marginTop: params.placement == "bottom" ? -1 : 0,
      marginBottom: params.placement == "top" ? -1 : 0,
      marginLeft: params.placement == "right" ? -1 : 0,
      marginRight: params.placement == "left" ? -1 : 0,
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      // Matches table header height
      height: 40,
      "&:disabled": {
        border: "hidden",
        // Hack to get tab label to align with other tabs that have a 2px border
        paddingBottom: theme.spacing.xs + 1,
      },
      alignItems: "center",
    },
    panel: {
      paddingTop: params.placement == "top" ? theme.spacing.lg : 0,
      paddingBottom: params.placement == "bottom" ? theme.spacing.lg : 0,
      paddingLeft: params.placement == "left" ? theme.spacing.lg : 0,
      paddingRight: params.placement == "right" ? theme.spacing.lg : 0,
      height: "100%",
      overflowY: "auto",
    },
    tabsList: {
      borderBottom:
        params.placement == "top" ? theme.other.borderStyles.light : "none",
      borderTop:
        params.placement == "bottom" ? theme.other.borderStyles.light : "none",
      borderRight:
        params.placement == "left" ? theme.other.borderStyles.light : "none",
      borderLeft:
        params.placement == "right" ? theme.other.borderStyles.light : "none",
    },
  };
});
