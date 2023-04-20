import {
  Tabs as MantineTabs,
  TabsOrientation as MantineTabsOrientation,
} from "@mantine/core";
import { isValidElement, ReactElement, useEffect, useMemo } from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { Text } from "components/text/Text";
import { useTabsRouting } from "routing/useTabsRouting";
import { useTabsState } from "state/components/tabs";
import { useComponentId } from "state/components/useId";

import { TabsContext } from "./Context";
import flattenChildren from "./flattenchildren";
import { useStyles } from "./Tabs.styles";
import {
  TabProps,
  TabsComponentProps,
  TabsPosition,
  TabsProps,
} from "./Tabs.types";

const DEFAULT_PLACEMENT = "top";
const DEFAULT_POSITION = "start";
const DEFAULT_GROW = false;

const POSITION_TO_MANTINE_POSITION: Record<TabsPosition, MantineTabsPosition> =
  {
    start: "left",
    end: "right",
    apart: "apart",
    center: "center",
  };

// Mantine doesn't export these types so we define them to get rid of type errors
type MantineTabsPosition = "right" | "left" | "apart" | "center";
type MantineTabsPlacement = "left" | "right";

export const TabsComponent = ({
  placement = DEFAULT_PLACEMENT,
  position = DEFAULT_POSITION,
  grow = DEFAULT_GROW,
  children,
  ...props
}: TabsComponentProps) => {
  const { classes } = useStyles({ placement });

  // Get contents for the panel from the children of the Tabs.Tab components after flattening fragments
  const panelContents = useMemo(
    () =>
      flattenChildren(children)
        .filter(
          (c) =>
            isValidElement(c) &&
            (c as ReactElement).props.value &&
            (c as ReactElement).props.children
        )
        .map((c) => ({
          value: (c as ReactElement).props.value,
          contents: (c as ReactElement).props.children,
        })),
    [children]
  );

  const TabsList = useMemo(
    () => (
      <MantineTabs.List
        position={POSITION_TO_MANTINE_POSITION[position]}
        grow={grow}
      >
        {children}
      </MantineTabs.List>
    ),
    [children, grow, position]
  );

  let orientation: MantineTabsOrientation;
  let inverted = false;
  let mantinePlacement: MantineTabsPlacement | undefined;
  switch (placement) {
    case "top":
      orientation = "horizontal";
      break;
    case "bottom":
      orientation = "horizontal";
      inverted = true;
      break;
    case "left":
      orientation = "vertical";
      mantinePlacement = "left";
      break;
    case "right":
      orientation = "vertical";
      mantinePlacement = "right";
      break;
  }
  return (
    <MantineTabs
      {...props}
      inverted={inverted}
      orientation={orientation}
      placement={mantinePlacement}
      classNames={{
        root: classes.root,
        tabLabel: classes.tabLabel,
        tabIcon: classes.tabIcon,
        tab: classes.tab,
        tabsList: classes.tabsList,
      }}
    >
      {placement !== "bottom" && TabsList}

      {panelContents.map((p) => (
        <MantineTabs.Panel
          key={p.value}
          value={p.value}
          className={classes.panel}
        >
          <TabsContext.Provider
            value={{
              activeTab: props.value,
              tab: p.value,
              isActive: p.value != null && p.value === props.value,
            }}
          >
            <Text>{p.contents}</Text>
          </TabsContext.Provider>
        </MantineTabs.Panel>
      ))}

      {placement === "bottom" && TabsList}
    </MantineTabs>
  );
};

export const Tabs = ({
  defaultValue = null,
  id: propId,
  onTabChange: propsOnTabChange,
  value: controlledValue,
  routingKey = null,
  ...props
}: TabsProps) => {
  const id = useComponentId(propId);
  const { routerValue, navigateTab } = useTabsRouting(routingKey);
  const { value, setValue } = useTabsState(id, {
    initialState: {
      value: controlledValue || routerValue || defaultValue,
    },
  });
  useEffect(() => {
    if (routingKey !== null) {
      if (routerValue !== undefined) {
        setValue(routerValue);
      } else {
        setValue(defaultValue);
      }
    }
  }, [routingKey, routerValue, defaultValue, setValue]);

  return (
    <ComponentErrorBoundary componentName={Tabs.displayName}>
      <TabsComponent
        value={controlledValue !== undefined ? controlledValue : value}
        onTabChange={(v) => {
          setValue(v);
          if (propsOnTabChange) {
            propsOnTabChange(v);
          }
          navigateTab(v);
        }}
        {...props}
      />
    </ComponentErrorBoundary>
  );
};

export const TabComponent = ({
  children,
  value,
  label = value,
  ...props
}: TabProps) => {
  return (
    <MantineTabs.Tab value={value} {...props}>
      {label}
    </MantineTabs.Tab>
  );
};

export const Tab = ({ ...props }: TabProps) => {
  return (
    <ComponentErrorBoundary componentName={Tab.displayName}>
      <TabComponent {...props} />
    </ComponentErrorBoundary>
  );
};

Tabs.displayName = "Tabs";
Tab.displayName = "Tabs.Tab";
Tabs.Tab = Tab;
