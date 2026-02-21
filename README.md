# 3Blue1Brown.com

Source code for official 3Blue1Brown website.

---

# Development

Key technologies used in this project:

- Bun, as package manager and platform (with Node as fallback)
- React 19
- React Router v7, as a framework for routing and pre-rendering
- Vite as bundler
- TypeScript, for static type checking
- MDX, for easier authoring of large static content
- Tailwind CSS, for styling
- ESLint, for code quality
- Prettier, for code formatting
- Playwright, for integration testing
- Deque Axe, for accessibility testing

## Requirements

- [Bun](https://bun.sh/) v1.3+

### About Bun

Bun **aims** to be a more fast, efficient, and feature-rich **drop-in** replacement for [Node](https://nodejs.org/) and [npm](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager).
[Anecdotally](https://github.com/oven-sh/setup-bun/issues/14), its package manager is orders of magnitude faster than `npm` or `yarn` (and less buggy).

Bun should have the same APIs and functionalities as Node, with only some minor command name differences.
If you see instructions like `npm install some-package` or `npx some-command`, replace them with their Bun equivalents like `bun add` or `bunx some-command`.

Bun is excellent but still not as mature as Node.
If you encounter an issue, try installing Node and running commands with that instead, and report the issue on this repo.
To avoid vendor lock-in, do not use APIs/features that are in Bun but not Node.
If Bun disappeared tomorrow, going back to Node should be as simple as replacing command names.

## Commands

| Command                      | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| **Setup**                    |                                                   |
| `bun install`                | Install packages                                  |
| `bun run install-playwright` | Install browsers for integration tests            |
| `bun run clean`              | "Hard uninstall", to be followed with re-install  |
| **Basic**                    |                                                   |
| `bun run some-script`        | Runs `some-script` defined in `package.json`      |
| `bun run dev`                | Start local dev server with hot-reloading         |
| `bun run build`              | Build production version of app                   |
| `bun run preview`            | Serve built version of app (must run build first) |
| **Fix**                      |                                                   |
| `bun run lint`               | Fix linting                                       |
| `bun run format`             | Fix formatting                                    |
| **Test**                     |                                                   |
| `bun run test:types`         | Test types                                        |
| `bun run test:lint`          | Test linting                                      |
| `bun run test:format`        | Test formatting                                   |
| `bun run test:e2e`           | Run integration tests, including Axe              |
| `bun run test`               | Run all tests                                     |
| **Checks**\*                 |                                                   |
| `bun run check-spelling`     | Check for spelling errors                         |
| `bun run check-unused`       | Check for unused code                             |
| `bun run check-links`        | Check for broken links                            |

\* Scripts that are valuable, but have too many false positives to be tests that fail critically.
Run periodically, manually review, and use discretion.

## Repo Structure

- `/app` - Main content of site.
  - `root.tsx` - Entrypoint of site, and root layout for every page.
  - `routes.ts` - A mapping of paths (local component/MDX files) to routes (URLs).
  - `styles.css` - Theme variable definitions (including dark/light-mode colors), global styles that affect native HTML elements, and reuseable utility classes.
  - `/components` - Low-level building blocks like buttons, inputs, etc., or higher-level ones that are used across the site, e.g. header.
  - `/data` - Top-level site data.
  - `/pages` - Hierarchy of the site's pages.
    Page-specific content files (e.g. MDX), components (e.g. `<Book>` for book recs), assets (e.g. images), and data (e.g. team member list).
  - `/util` - Broadly useful, generic functions, i.e. ones you'd find yourself frequently copying between different projects.
- `/public` - Assets to be copied to build output as-is.
  Prefer `import`ing assets whenever possible to take advantage of bundler optimizations.
- `/tests` - Integration tests.
- `react-router.config.ts` - Configuration for React Router, including which routes are generated when the site is built.

## Guidelines

- Place code in the appropriate places as described in the repo structure.
  The structure tries to collocate by domain rather than by type, i.e. `/blog/images` and `/blog/components` rather than `/images/blog` and `/components/blog`.
- Before using a third-party package's component, or even a native HTML element, check if we have a custom component for it.
  E.g., we have a custom `<Link>` component that wraps React Router's `<Link>`, adding consistent styling and behavior.
- See the `/testbed` page for an overview of what formatting/elements/components/etc. you can use and how.
- Be careful with auto-imports, e.g. importing `<Button>` from `react-aria-components` instead of `/components/Button`, or `<Link>` from `react-router` instead of `components/Link`.
- Avoid un-safe TypeScript, e.g. type-disabling (`any` instead of `unknown`), casting (`someValue as string`), non-null assertion (`someValue!`), etc.
- Avoid using the `!` important modifier in Tailwind.
  Explicit specificity can usually be achieved with `@layer`s or conditionally applying classes in components.
- Use Tailwind for styling, and avoid custom CSS and inline styles as much as possible.
- Use Tailwind's `--spacing()` function in `calc()`s and such, to ensure consistent spacing.
  Avoid hardcoding pixel values.
- If a component in `/components` is only being used to apply styles, with no custom behavior or markup, it may be more appropriate as a Tailwind utility class.
- Use MDX for pages that are primarily static content, and React components for everything else.
- Split pages into separate components by "section" to keep them from becoming too monolithic and make them easier to re-order later.
- Put things that might be commonly edited at the top of files, e.g. an array of member info for a team gallery, or some tweak-able parameters for a visualization.
- Prefer using CSS [flex](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/) and [grid](https://www.joshwcomeau.com/css/interactive-guide-to-grid/) layout over the traditional [flow](https://www.joshwcomeau.com/css/understanding-layout-algorithms/) layout.
  This generally keeps alignment and spacing consistent with what the eye expects, and makes responsive design easier.
