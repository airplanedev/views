/**
 * Messages sent from the view to the parent frame.
 *
 * Note: any changes to these messages must be backwards-compatible - older versions
 * of the @airplane/views library may send older versions of these messages.
 *
 * Keep in sync with web/lib/views/ViewMessage.ts
 */
type ViewInitMessage = {
  type: "view_init";
  version: string;
};

type StartRunMessage = {
  type: "start_run";
  runID: string;
  executeType?: "query" | "mutation";
};

type StartSessionMessage = {
  type: "start_session";
  sessionID: string;
};

type ToggleDebugPanelMessageBase = {
  type: "debug_panel";
  open: boolean;
};

type ToggleDebugPanelActivityTabMessage = ToggleDebugPanelMessageBase & {
  activeTab: "activity";
  runID?: string;
  sessionID?: string;
};

type ToggleDebugPanelMessage = ToggleDebugPanelActivityTabMessage;

type UpdateQueryParamsMessage = {
  type: "update_query_params";
  params?: Record<string, string>;
};

type ComponentStateMessage = {
  type: "component_state";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: Record<string, Record<string, any>>;
  error?: string;
};

type ConsoleMessageBase = {
  type: "console";
  hash: string;
  // unix timestamp in milliseconds
  time: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionalParams?: any[];
};

type LogConsoleMessage = {
  messageType: "log";
} & ConsoleMessageBase;

type WarnConsoleMessage = {
  messageType: "warn";
} & ConsoleMessageBase;

type ErrorConsoleMessage = {
  messageType: "error";
  id?: string;
  component?: string;
  stack?: string;
} & ConsoleMessageBase;

export type ConsoleMessage =
  | ErrorConsoleMessage
  | LogConsoleMessage
  | WarnConsoleMessage;

export type PeekMessage = {
  type: "peek";
  peekType: "view" | "task";
  slug: string;
};

export type ComponentMountedMessage = {
  type: "component_mounted";
  componentName: string;
};

export type ViewMessage =
  | StartRunMessage
  | StartSessionMessage
  | ViewInitMessage
  | ToggleDebugPanelMessage
  | UpdateQueryParamsMessage
  | ComponentStateMessage
  | ConsoleMessage
  | PeekMessage
  | ComponentMountedMessage;
