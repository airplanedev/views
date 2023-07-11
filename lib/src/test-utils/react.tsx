/* eslint-disable import/export */
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

import { ViewProvider } from "provider";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: ViewProvider, ...options });

export * from "@testing-library/react";
export { render as rawRender };
export { customRender as render };
