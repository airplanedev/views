import { createStyles, MantineSize, useMantineTheme } from "@mantine/core";

const textSizeToMarginBottom = {
  xs: "0.25rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.5rem",
  xl: "0.5rem",
};

type StyleParams = {
  size: MantineSize;
};

export const useParagraphStyles = createStyles(
  (theme, { size }: StyleParams) => {
    return {
      paragraph: {
        marginBottom: textSizeToMarginBottom[size],
        "&:last-child": {
          marginBottom: 0,
        },
      },
    };
  },
);

export const useRawTextStyles = createStyles(
  (theme, { size }: { size: MantineSize }) => {
    return {
      root: {
        fontSize: theme.other.typography.textPreset[size].fontSize,
        lineHeight: theme.other.typography.textPreset[size].lineHeight,
      },
    };
  },
);

export const useTextWeight = (size: MantineSize) => {
  const theme = useMantineTheme();
  return theme.other.typography.textPreset[size].fontWeight;
};
