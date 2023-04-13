const path = require("path");
const { mergeConfig } = require("vite");
const tsconfigPaths = require("vite-tsconfig-paths").default;
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-actions",
    "@storybook/addon-interactions",
    "storybook-addon-mock/register",
    "@storybook/addon-mdx-gfm",
    {
      name: "@storybook/addon-styling",
      options: {
        postCss: {
          implementation: require("postcss"),
        },
      },
    },
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [
        tsconfigPaths({
          root: path.resolve(__dirname, ".."),
        }),
      ],
      define: {
        "process.env": {},
      },
    });
  },
  docs: {
    autodocs: true,
  },
};
