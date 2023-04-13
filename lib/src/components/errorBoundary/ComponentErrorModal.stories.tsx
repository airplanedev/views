import { Meta, StoryFn } from "@storybook/react";
import { useState } from "react";

import {
  ComponentErrorModal,
  ComponentErrorFallbackProps,
} from "./ComponentErrorFallback";

export default {
  title: "ComponentErrorModal",
  component: ComponentErrorModal,
} as Meta<typeof ComponentErrorModal>;

const Template: StoryFn<ComponentErrorFallbackProps> = (args: any) => {
  const [opened, setOpened] = useState(true);
  return (
    <ComponentErrorModal {...args} opened={opened} setOpened={setOpened} />
  );
};

const ExampleError = new Error(
  "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."
);
ExampleError.stack = `
  Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
      at createFiberFromTypeAndProps (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:19938:25)
      at createFiberFromElement (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:19959:23)
      at reconcileSingleElement (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:11410:31)
      at reconcileChildFibers2 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:11447:43)
      at reconcileChildren (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:13873:37)
      at updateHostComponent (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:14375:11)
      at beginWork (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:15468:22)
      at beginWork$1 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:19248:22)
      at performUnitOfWork (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:18693:20)
      at workLoopSync (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:18632:13)
  `;
const ExampleErrorInfo = {
  componentStack: `at div
      at http://localhost:6006/node_modules/.vite-storybook/deps/chunk-EYF2PURV.js?v=79514571:958:18
      at http://localhost:6006/node_modules/.vite-storybook/deps/chunk-EYF2PURV.js?v=79514571:25807:14
      at div
      at http://localhost:6006/node_modules/.vite-storybook/deps/chunk-EYF2PURV.js?v=79514571:958:18
      at Provider (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-EYF2PURV.js?v=79514571:196:23)
      at TabsProvider (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-EYF2PURV.js?v=79514571:26092:3)
      at http://localhost:6006/node_modules/.vite-storybook/deps/chunk-EYF2PURV.js?v=79514571:26195:14
      at TabsComponent (http://localhost:6006/src/components/tabs/Tabs.tsx?t=1673039562010:35:3)
      at ComponentErrorBoundary (http://localhost:6006/src/components/errorBoundary/ComponentErrorBoundary.tsx?t=1673039562010:7:5)
      at Tabs (http://localhost:6006/src/components/tabs/Tabs.tsx?t=1673039562010:118:3)
      at div
      at RunnerScaleSignalProvider (http://localhost:6006/src/state/context/RunnerScaleSignalProvider.tsx:43:3)
      at RequestDialogProvider (http://localhost:6006/src/components/requestDialog/RequestDialogProvider.tsx?t=1673039562010:26:3)
      at NotificationsProvider (http://localhost:6006/node_modules/.vite-storybook/deps/@mantine_notifications.js?v=79514571:1280:5)
      at ThemeProvider2 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-65256UKS.js?v=79514571:2058:44)
      at MantineProvider (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-65256UKS.js?v=79514571:2769:3)
      at ThemeProvider (http://localhost:6006/src/components/theme/ThemeProvider.tsx:25:3)
      at QueryClientProvider2 (http://localhost:6006/node_modules/.vite-storybook/deps/react-query.js?v=79514571:2643:21)
      at QueryClientProvider (http://localhost:6006/src/state/context/QueryClientProvider.tsx:20:3)
      at ComponentStateProvider (http://localhost:6006/src/state/context/ComponentStateProvider.tsx:20:3)
      at ViewProvider (http://localhost:6006/src/provider/index.tsx?t=1673039562010:36:3)
      at unboundStoryFn2 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-BOXRSF55.js?v=79514571:1294:12)
      at ErrorBoundary2 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-KNRZGHVJ.js?v=79514571:281:5)
      at WithCallback2 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-KNRZGHVJ.js?v=79514571:182:23)
  `,
};

export const Simple = Template.bind({});
Simple.args = {
  error: ExampleError,
  errorInfo: ExampleErrorInfo,
  componentName: "Table",
};

export const WithLatestRun = Template.bind({});
WithLatestRun.args = {
  error: ExampleError,
  errorInfo: ExampleErrorInfo,
  componentName: "Table",
  latestRun: {
    runID: "devrun8wo4n79nk4",
    output: {
      Q1: [
        {
          id: 0,
          company_name: "Future Golf Partners",
          country: "Brazil",
          signup_date: "2020-03-21T04:48:23.532Z",
        },
        {
          id: 1,
          company_name: "Amalgamated Star LLC",
          country: "Canada",
          signup_date: "2020-07-16T00:40:30.103Z",
        },
      ],
    },
  },
};
