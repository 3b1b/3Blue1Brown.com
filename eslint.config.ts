import js from "@eslint/js";
import tailwind from "eslint-plugin-better-tailwindcss";
import jsxA11y from "eslint-plugin-jsx-a11y";
import * as mdx from "eslint-plugin-mdx";
import prettier from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "build",
    "public",
    ".react-router",
    "playwright-report",
    "test-results",
    "bucket",
  ]),

  // https://github.com/mdx-js/eslint-mdx/issues/92
  {
    name: "TypeScript",
    extends: tslint.configs.recommended,
    ignores: ["**/*.mdx"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { caughtErrors: "none" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },

  {
    name: "JavaScript",
    ...js.configs.recommended,
    rules: {
      "prefer-const": ["error", { destructuring: "all" }],
    },
  },

  {
    name: "React Hooks",
    extends: [reactHooks.configs.flat.recommended],
  },

  {
    name: "JSX Accessibility",
    extends: [jsxA11y.flatConfigs.recommended],
    rules: {
      // https://github.com/dequelabs/axe-core/issues/4566
      "jsx-a11y/no-noninteractive-tabindex": ["off"],
    },
  },

  {
    name: "Prettier",
    extends: [prettier],
    ignores: ["**/*.mdx"],
    rules: {
      "prettier/prettier": "warn",
    },
  },

  {
    name: "Tailwind",
    extends: [tailwind.configs.recommended],
    rules: {
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "warn",
        {
          preferSingleLine: true,
          group: "never",
          printWidth: 0,
        },
      ],
      "better-tailwindcss/no-unknown-classes": [
        "warn",
        { ignore: ["dark", "striped"] },
      ],
    },
    settings: {
      "better-tailwindcss": { entryPoint: "app/styles.css" },
    },
  },

  {
    name: "MDX",
    ...mdx.flat,
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
