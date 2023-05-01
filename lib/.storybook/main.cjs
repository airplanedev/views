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
    "storybook-addon-mock",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
    "storybook-addon-mock/register",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths({ root: path.resolve(__dirname, "..") })],
      define: { "process.env": {} },
    });
  },
};
