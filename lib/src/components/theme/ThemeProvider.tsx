import { MantineProvider, createEmotionCache } from "@mantine/core";
import * as React from "react";

import { THEME } from "./theme";

const emotionCache = createEmotionCache({ key: "airplane" });
// Disable Emotion SSR warnings
// https://github.com/emotion-js/emotion/issues/1105#issuecomment-557726922
emotionCache.compat = true;

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider
      theme={THEME}
      withGlobalStyles
      withNormalizeCSS
      emotionCache={emotionCache}
    >
      {children}
    </MantineProvider>
  );
};
