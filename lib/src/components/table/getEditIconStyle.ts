import { CSSObject, MantineTheme } from "@mantine/core";

export const getEditIconStyle = (
  theme: MantineTheme,
  backgroundColor: string,
): CSSObject => ({
  position: "absolute",
  color: theme.colors.gray[3],
  height: theme.other.icon.sizes.md,
  right: 12,
  width: 24,
  paddingLeft: 12,
  // The 00 at the end of the background color adjusts the hex color's alpha value
  background: `linear-gradient(90deg, ${backgroundColor}00 0%, ${backgroundColor} 50%)`,
});
