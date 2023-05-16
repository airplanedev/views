import { Meta, StoryFn } from "@storybook/react";

import { ErrorFallback } from "./ErrorFallback";

export default {
  title: "ErrorFallback",
  component: ErrorFallback,
} as Meta<typeof ErrorFallback>;

const Template: StoryFn<typeof ErrorFallback> = (args) => (
  <ErrorFallback {...args} />
);

const ExampleError = new Error(
  "Cannot read properties of undefined (reading 'no')"
);
ExampleError.stack = `
TypeError: Cannot read properties of undefined (reading 'no')
    at ErrorC (http://localhost:6006/src/components/errorBoundary/ErrorBoundary.stories.tsx?t=1673040504564:129:10)
    at renderWithHooks (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:11763:26)
    at mountIndeterminateComponent (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:14492:21)
    at beginWork (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:15447:22)
    at beginWork$1 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:19248:22)
    at performUnitOfWork (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:18693:20)
    at workLoopSync (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:18632:13)
    at renderRootSync (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:18611:15)
    at recoverFromConcurrentError (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:18233:28)
    at performConcurrentWorkOnRoot (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-A4HIRQUA.js?v=79514571:18181:30)
  `;
const ExampleErrorInfo = {
  componentStack: `
at ErrorC (http://localhost:6006/src/components/errorBoundary/ErrorBoundary.stories.tsx?t=1673040504564:127:3)
  at ErrorBoundary (http://localhost:6006/src/components/errorBoundary/ErrorBoundary.tsx?t=1673040504564:7:5)
  at RunnerScaleSignalProvider (http://localhost:6006/src/state/context/RunnerScaleSignalProvider.tsx:43:3)
  at RequestDialogProvider (http://localhost:6006/src/components/requestDialog/RequestDialogProvider.tsx?t=1673040504564:26:3)
  at NotificationsProvider (http://localhost:6006/node_modules/.vite-storybook/deps/@mantine_notifications.js?v=79514571:1280:5)
  at ThemeProvider2 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-65256UKS.js?v=79514571:2058:44)
  at MantineProvider (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-65256UKS.js?v=79514571:2769:3)
  at ThemeProvider (http://localhost:6006/src/components/theme/ThemeProvider.tsx:25:3)
  at QueryClientProvider2 (http://localhost:6006/node_modules/.vite-storybook/deps/react-query.js?v=79514571:2643:21)
  at QueryClientProvider (http://localhost:6006/src/state/context/QueryClientProvider.tsx:20:3)
  at ComponentStateProvider (http://localhost:6006/src/state/context/ComponentStateProvider.tsx:20:3)
  at ViewProvider (http://localhost:6006/src/provider/index.tsx?t=1673040504564:36:3)
  at unboundStoryFn2 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-BOXRSF55.js?v=79514571:1294:12)
  at ErrorBoundary2 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-KNRZGHVJ.js?v=79514571:281:5)
  at WithCallback2 (http://localhost:6006/node_modules/.vite-storybook/deps/chunk-KNRZGHVJ.js?v=79514571:182:23)`,
};

export const Simple = Template.bind({});
Simple.args = {
  error: ExampleError,
  errorInfo: ExampleErrorInfo,
  errorID: "123",
};
