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
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-self-assign": "warn",
      "no-empty": "warn",
      "no-case-declarations": "warn",
      "no-const-assign": "warn",
      "no-useless-escape": "warn",
    },
  },
  eslintConfigPrettier,
];