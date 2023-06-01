import { Tuple, DefaultMantineColor, MantineSize } from "@mantine/core";
import { CSSProperties } from "react";

type ExtendedCustomColors =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }

  export interface MantineThemeOther {
    typography: {
      textPreset: Record<
        MantineSize,
        {
          fontSize: CSSProperties["fontSize"];
          lineHeight: CSSProperties["lineHeight"];
          fontWeight: number;
          marginBottom?: CSSProperties["marginBottom"];
        }
      >;
      headingPreset: Record<
        number,
        {
          fontSize: CSSProperties["fontSize"];
          lineHeight: CSSProperties["lineHeight"];
          fontWeight: number;
          marginTop?: CSSProperties["marginTop"];
          marginBottom?: CSSProperties["marginBottom"];
          letterSpacing?: CSSProperties["letterSpacing"];
        }
      >;
    };

    icon: {
      sizes: Record<MantineSize, number>;
    };

    borderStyles: Record<string, string>;
  }
}
