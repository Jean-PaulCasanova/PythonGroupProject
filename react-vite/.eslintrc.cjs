module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
    ],
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    settings: { react: { version: "18.2" } },
    plugins: ["react-refresh"],
    overrides: [
      {
        files: ["src/context/*.jsx"],
        rules: {
          "react-refresh/only-export-components": "off",
        },
      },
    ],
    ignorePatterns: ["dist", "node_modules"],
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
    },
  };