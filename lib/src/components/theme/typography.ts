export const fontFamily =
  "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji";

export type FontWeight = "light" | "normal" | "medium" | "semibold" | "bold";

export const fontWeight: Record<FontWeight, number> = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const textPreset = {
  1: {
    fontSize: "0.625rem",
    lineHeight: "1rem",
    fontWeight: fontWeight.normal,
  },
  2: {
    fontSize: "0.75rem",
    lineHeight: "1.125rem",
    fontWeight: fontWeight.normal,
  },
  3: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: fontWeight.normal,
  },
  4: {
    fontSize: "1rem",
    lineHeight: "1.375rem",
    fontWeight: fontWeight.normal,
  },
  5: {
    fontSize: "1.125rem",
    lineHeight: "1.5rem",
    fontWeight: fontWeight.normal,
  },
};

export const headingPreset = {
  1: {
    fontSize: "0.875rem",
    lineHeight: "1rem",
    fontWeight: fontWeight.medium,
    marginTop: "0.25rem",
  },
  2: {
    fontSize: "1rem",
    lineHeight: "1.25rem",
    fontWeight: fontWeight.semibold,
    marginTop: "0.125rem",
  },
  3: {
    fontSize: "1.166rem",
    lineHeight: "1.25rem",
    fontWeight: fontWeight.semibold,
    letterSpacing: "-0.014em",
    marginTop: "0.125rem",
    marginBottom: "0.25rem",
  },
  4: {
    fontSize: "1.333rem",
    lineHeight: "1.5rem",
    fontWeight: fontWeight.bold,
    letterSpacing: "-0.019em",
    marginBottom: "0.5rem",
    marginTop: "1rem",
  },
  5: {
    fontSize: "1.555rem",
    lineHeight: "1.75rem",
    fontWeight: fontWeight.bold,
    letterSpacing: "-0.019em",
    marginBottom: "0.75rem",
    marginTop: "1.25rem",
  },
  6: {
    fontSize: "1.777rem",
    lineHeight: "2rem",
    fontWeight: fontWeight.bold,
    letterSpacing: "-0.020em",
    marginBottom: "0.75rem",
    marginTop: "1rem",
  },
};
