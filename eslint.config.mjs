import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";
import jestPlugin from "eslint-plugin-jest";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsEslint from "typescript-eslint";
import typescriptEslintParser from "@typescript-eslint/parser";
import { includeIgnoreFile } from "@eslint/compat";

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
    ignores: ["built/"],
  },
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
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-self-assign": "error",
      "no-empty": "error",
      "no-case-declarations": "error",
      "no-const-assign": "error",
      "no-useless-escape": "error",
      "default-param-last": "error",
    },
    files: ["**/*.js"], // Apply this config to JavaScript files
  },
  ...tsEslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts"], // We use TS config only for TS files
  })),
  // Configuration for TypeScript files
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["eslint.tsconfig.json"],
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "no-undef": "error",
      "no-self-assign": "error",
      "no-empty": "error",
      "no-case-declarations": "error",
      "no-const-assign": "error",
      "no-useless-escape": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/await-thenable": "error",
      "default-param-last": "off",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",

      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": "error",

      "@typescript-eslint/no-extra-non-null-assertion": "error",

      "@typescript-eslint/no-invalid-void-type": "error",

      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-misused-promises": "error",

      "@typescript-eslint/no-mixed-enums": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",

      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
    files: ["**/*.ts"], // Apply this config to TypeScript files
  },

  // Prettier configuration

  eslintConfigPrettier,
];
