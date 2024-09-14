import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";
import jestPlugin from "eslint-plugin-jest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("eslint:recommended", "prettier"),
  {
    ignores: ["**/built/", "**/node_modules/"],
    files: ["src/**/*.js", "__tests__/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      ["jest"]: jestPlugin,
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-self-assign": "error",
      "no-empty": "error",
      "no-case-declarations": "error",
      "no-const-assign": "error",
      "no-useless-escape": "error",
    },
  },
  eslintConfigPrettier,
];
