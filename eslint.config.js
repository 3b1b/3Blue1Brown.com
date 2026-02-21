import eslintJs from "@eslint/js";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import * as eslintPluginMdx from "eslint-plugin-mdx";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "build",
    "public",
    ".react-router",
    "playwright-report",
    "test-results",
  ]),

  // https://github.com/mdx-js/eslint-mdx/issues/92
  {
    name: "TypeScript",
    extends: typescriptEslint.configs.recommended,
    ignores: ["**/*.mdx"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { caughtErrors: "none" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    name: "JavaScript",
    ...eslintJs.configs.recommended,
    rules: {
      "prefer-const": ["error", { destructuring: "all" }],
    },
  },
  {
    name: "React Hooks",
    ...eslintPluginReactHooks.configs.flat.recommended,
  },
  {
    name: "JSX Accessibility",
    ...eslintPluginJsxA11y.flatConfigs.recommended,
    rules: {
      // https://github.com/dequelabs/axe-core/issues/4566
      "jsx-a11y/no-noninteractive-tabindex": ["off"],
    },
  },
  {
    name: "Prettier",
    ...eslintPluginPrettierRecommended,
    ignores: ["**/*.mdx"],
  },
  {
    name: "Tailwind",
    extends: [eslintPluginBetterTailwindcss.configs.recommended],
    rules: {
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "warn",
        {
          preferSingleLine: true,
          group: "never",
          printWidth: 0,
        },
      ],
      "better-tailwindcss/no-unknown-classes": ["warn", { ignore: ["dark"] }],
    },
    settings: {
      "better-tailwindcss": { entryPoint: "app/styles.css" },
    },
  },
  {
    name: "MDX",
    ...eslintPluginMdx.flat,
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
    },
  },
]);
