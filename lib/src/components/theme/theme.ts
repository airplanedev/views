import { MantineThemeBase, NotificationStylesParams } from "@mantine/core";

import { COLORS } from "./colors";
import { fontFamily, headingPreset, textPreset } from "./typography";

const borderStyles = {
  default: `1px solid ${COLORS.gray[3]}`,
  light: `1px solid ${COLORS.gray[2]}`,
};

export const THEME: MantineThemeBase = {
  globalStyles: () => ({
    "*": {
      fontVariantLigatures: "no-contextual",
    },
  }),
  dir: "ltr",
  primaryShade: {
    light: 6,
    dark: 8,
  },
  focusRing: "auto",
  focusRingStyles: {
    styles: (theme) => ({
      outlineOffset: 2,
      outline: `2px solid ${
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5]
      }`,
    }),
    resetStyles: () => ({ outline: "none" }),
    inputStyles: (theme) => ({
      outline: "none",
      borderColor:
        theme.colors[theme.primaryColor][
          typeof theme.primaryShade === "object"
            ? theme.primaryShade[theme.colorScheme]
            : theme.primaryShade
        ],
    }),
  },
  loader: "oval",
  dateFormat: "MMMM D, YYYY",
  colorScheme: "light",
  white: "#fff",
  black: "#374151",
  defaultRadius: "md",
  transitionTimingFunction: "ease",
  colors: COLORS,
  lineHeight: 1.55,
  fontFamily,
  fontFamilyMonospace:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
  primaryColor: "indigo",

  shadows: {
    xs: "0 1px 2px 0 rgba(0,0,0,.05)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px",
    md: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
    lg: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 12px 12px -7px",
    xl: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px",
  },

  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },

  radius: {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 16,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  breakpoints: {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1400,
  },

  headings: {
    fontFamily,
    fontWeight: 700,
    sizes: {
      h1: headingPreset[1],
      h2: headingPreset[2],
      h3: headingPreset[3],
      h4: headingPreset[4],
      h5: headingPreset[5],
      h6: headingPreset[6],
    },
  },

  components: {
    Container: {
      defaultProps: {
        sizes: {
          xl: "80rem",
        },
      },
    },

    InputWrapper: {
      styles: (theme) => ({
        label: {
          ...headingPreset[6],
          color: theme.colors.gray[7],
          marginBottom: "0.375rem",
        },

        description: {
          ...textPreset["md"],
          color: theme.colors.gray[6],
          marginTop: "0.25rem",
          marginBottom: 0,
        },

        error: {
          ...textPreset["md"],
          whiteSpace: "pre-wrap",
        },
      }),

      defaultProps: {
        inputWrapperOrder: ["label", "input", "description", "error"],
      },
    },

    Input: {
      styles: (theme, params) =>
        params.variant !== "unstyled"
          ? {
              input: {
                border: borderStyles.default,
                boxShadow: theme.shadows.xs,
                color: theme.colors.gray[7],
                "&:focus, &:focus-within": {
                  outline: `1px solid ${theme.colors.primary[5]}`,
                },
              },
            }
          : {
              input: {
                padding: 0,
                height: 0,
                minHeight: 22,
              },
            },
    },

    Checkbox: {
      styles: (theme) => ({
        input: {
          border: borderStyles.default,
        },
        label: { color: theme.colors.gray[7] },
      }),
    },

    Tooltip: {
      styles: (theme) => ({
        tooltip: {
          ...textPreset["sm"],
          padding: "6px 10px",
          borderRadius: theme.radius.md,
          color: "white",
        },
      }),
    },
    Notification: {
      styles: (theme, props: NotificationStylesParams) => {
        const topLine = {
          ...textPreset["md"],
          color: theme.colors.gray[9],
          marginBottom: 0,
          fontWeight: 500,
        };
        const bottomLine = {
          ...textPreset["md"],
          color: theme.colors.gray[5],
          marginBottom: 0,
          marginTop: theme.spacing.xs,
        };
        return {
          root: {
            padding: "1rem !important",
            boxShadow: theme.shadows.md,
            border: "none",
            "&::before": {
              display: "none",
            },
          },
          closeButton: {
            color: theme.colors.gray[4],
            "&:hover": { color: theme.colors.gray[5], background: "none" },
          },
          description: props.withTitle ? bottomLine : topLine,
          title: topLine,
        };
      },
    },
    MultiSelect: {
      styles: (theme) => {
        return {
          input: {
            // We're overriding the input styles here for multi-selects, otherwise the border/outline
            // looks off (because Mantine's MultiSelect is set up differently from Select, and we're
            // doing some overriding of Input elsewhere).
            "&:focus, &:focus-within": {
              outline: "none",
              border: `2px solid ${theme.colors.primary[5]}`,
            },
          },
        };
      },
    },
  },

  other: {
    typography: {
      textPreset,
      headingPreset,
    },
    icon: {
      sizes: {
        xs: 10,
        sm: 12,
        md: 15,
        lg: 24,
        xl: 34,
      },
    },
    borderStyles,
  },
  datesLocale: "en",
  activeStyles: { transform: "initial" },
  defaultGradient: {
    from: "indigo",
    to: "cyan",
    deg: 45,
  },
  respectReducedMotion: true,
  cursorType: "pointer",
};
