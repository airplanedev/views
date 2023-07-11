export let AIRPLANE_API_HOST =
  import.meta.env?.AIRPLANE_API_HOST ?? "https://api.airplane.dev";
export let AIRPLANE_TOKEN = import.meta.env?.AIRPLANE_TOKEN ?? "";
export let AIRPLANE_API_KEY = import.meta.env?.AIRPLANE_API_KEY ?? "";
export let AIRPLANE_VIEW_TOKEN = import.meta.env?.AIRPLANE_VIEW_TOKEN ?? "";
export let AIRPLANE_ENV_SLUG = import.meta.env?.AIRPLANE_ENV_SLUG ?? "";
export let AIRPLANE_WEB_HOST =
  import.meta.env?.AIRPLANE_WEB_HOST ?? "https://app.airplane.dev";
export let AIRPLANE_TUNNEL_TOKEN = import.meta.env?.AIRPLANE_TUNNEL_TOKEN ?? "";
export let AIRPLANE_SANDBOX_TOKEN =
  import.meta.env?.AIRPLANE_SANDBOX_TOKEN ?? "";
export let AIRPLANE_API_HEADERS = import.meta.env?.AIRPLANE_API_HEADERS ?? "{}";

// Additional environment variables we want to plumb into the views package.
type AdditionalEnvVars = {
  // AIRPLANE_TUNNEL_TOKEN is used only by local dev to authenticate with the dev server when
  // proxying from an ngrok tunnel.
  AIRPLANE_TUNNEL_TOKEN?: string;
  // AIRPLANE_SANDBOX_TOKEN is used to authenticate requests with the sandbox router for remote
  // studio.
  AIRPLANE_SANDBOX_TOKEN?: string;
  AIRPLANE_API_HEADERS?: string;
  // AIRPLANE_VIEW_TOKEN is used to identify the view to the API.
  AIRPLANE_VIEW_TOKEN?: string;
};

export const setEnvVars = (
  apiHost: string,
  token: string,
  apiKey: string,
  envSlug: string,
  additionalEnvVars?: AdditionalEnvVars,
) => {
  AIRPLANE_API_HOST = apiHost;
  AIRPLANE_TOKEN = token;
  AIRPLANE_VIEW_TOKEN = additionalEnvVars?.AIRPLANE_VIEW_TOKEN;
  AIRPLANE_API_KEY = apiKey;
  AIRPLANE_ENV_SLUG = envSlug;
  if (apiHost.includes("stage")) {
    AIRPLANE_WEB_HOST = "https://web.airstage.app";
  }
  AIRPLANE_TUNNEL_TOKEN = additionalEnvVars?.AIRPLANE_TUNNEL_TOKEN ?? "";
  AIRPLANE_SANDBOX_TOKEN = additionalEnvVars?.AIRPLANE_SANDBOX_TOKEN ?? "";
  AIRPLANE_API_HEADERS = additionalEnvVars?.AIRPLANE_API_HEADERS ?? "{}";
};

export const getExecuteOptions = (source: "query" | "mutation") => {
  return {
    host: AIRPLANE_API_HOST,
    token: AIRPLANE_TOKEN,
    apiKey: AIRPLANE_TOKEN ? undefined : AIRPLANE_API_KEY,
    envSlug: AIRPLANE_ENV_SLUG,
    source: `view-${source}`,
    headers: { "X-Airplane-View-Token": AIRPLANE_VIEW_TOKEN },
  };
};
