import eslintJs from "@eslint/js";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "dist",
    "public",
    ".react-router",
    "playwright-report",
    "test-results",
  ]),
  eslintJs.configs.recommended,
  typescriptEslint.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintPluginReactHooks.configs.flat.recommended,
  eslintPluginJsxA11y.flatConfigs.recommended,
  {
    plugins: {
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // GENERAL
      "prefer-const": ["error", { destructuring: "all" }],

      // TYPESCRIPT
      "@typescript-eslint/no-unused-vars": ["warn", { caughtErrors: "none" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": "error",

      // ACCESSIBILITY
      // https://github.com/dequelabs/axe-core/issues/4566
      "jsx-a11y/no-noninteractive-tabindex": ["off"],

      // FORMATTING
      "prettier/prettier": "warn",
      ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
      // https://github.com/schoero/eslint-plugin-better-tailwindcss/issues/302
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "warn",
        { strictness: "loose" },
      ],
      "better-tailwindcss/no-unknown-classes": ["warn", { ignore: ["dark"] }],
    },
    settings: { "better-tailwindcss": { entryPoint: "app/styles.css" } },
  },
]);
