# AGENTS.md

This file provides guidance to AI coding agents (such as Claude Code) when working with this repository.

## Commands

```bash
bun run dev          # Dev server at localhost:31415
bun run build        # Production build
bun run preview      # Serve built output (must build first)

bun run lint         # Fix ESLint issues
bun run format       # Fix Prettier formatting

bun run test:types   # TypeScript type checking
bun run test:lint    # ESLint checks
bun run test:format  # Prettier format checks
bun run test:e2e     # Playwright E2E tests (subset of critical routes)
bun run test         # All tests + build

# E2E variants:
# bun run test:e2e some-test.spec   — specific file
# ROUTE= bun run test:e2e           — all routes
# ROUTE=/some/route bun run test:e2e — routes matching regex

bun run check:spelling  # Spell check (too many false positives for CI)
bun run check:unused    # Unused code detection
bun run check:links     # Broken link check
```

## Stack

- **Framework**: React 19 + React Router v7 (fully pre-rendered static site, client-side hydration for interactive elements)
- **Build**: Vite 7 + Bun (use `bun`/`bunx` instead of `npm`/`npx`, but avoid Bun-only APIs)
- **Styling**: Tailwind CSS v4
- **Content**: MDX with frontmatter, remark-math, remark-gfm
- **State**: Jotai atoms (`app/util/atom.ts` helpers: `getAtom`, `setAtom`, `atomWithQuery` for URL-synced state)
- **Deploy**: Netlify, output in `build/client`

## Architecture

### Routing

Routes are defined in `app/routes.ts` (static) and auto-discovered in `react-router.config.ts` by globbing MDX files:

- Lessons: `app/pages/lessons/20XX/<slug>/index.mdx` → `/lessons/<slug>`
- Blog: `app/pages/blog/<slug>/index.mdx` → `/blog/<slug>`
- Partners: `app/pages/talent/<slug>/index.mdx` → `/talent/<slug>`

Dynamic page components (e.g. `Lesson.tsx`) receive `params.id` and lazy-load the full MDX.

### Repo Structure

- `app/components/` — Low-level and site-wide components (buttons, header, etc.)
- `app/pages/` — Page hierarchy; collocated by domain (e.g. `blog/components/`, `blog/images/`) not by type
- `app/util/` — Generic, broadly reusable utilities and hooks
- `app/data/` — Top-level site data (JSON)
- `app/styles.css` — Theme variables, global styles, reusable utility classes
- `public/` — Rarely used; prefer `import` to let the bundler optimize assets

### Content (MDX)

Each content piece is a folder with `index.mdx` plus colocated assets and components. Frontmatter includes `title`, `date`, `description`, `video` (YouTube ID), `image`, `credits`.

The `<Markdownify>` component (`app/components/Markdownify.tsx`) is the MDX provider — it maps HTML elements to custom components. MDX files can only be type-checked in the editor, not via `test:types`.

## Code Conventions

This repo was built deliberately with strong opinions. Follow these carefully.

### Components & Imports

- **Always check for a custom component before using a third-party or native element.** We wrap many primitives: `<Link>`, `<Image>`, `<Button>`, `<YouTube>`, etc. Using `<a>` or React Router's `<Link>` directly is almost always wrong.
- Watch for auto-import pitfalls — e.g., `<Link>` should come from `~/components/Link`, not `react-router`.
- Use `~/` import prefix for anything outside the current file's directory. Only use relative imports for files meant to always be colocated.
- React components use `function () {}` notation. Everything else uses arrow functions `() => {}`.
- Name files in `lower-kebab-case`, components in `UpperCamelCase`.

### Styling

- **Use Tailwind for all styling.** Avoid inline styles and custom CSS as much as possible.
- Do not use `!important` (Tailwind's `!` modifier). Achieve specificity via `@layer` or conditional class application.
- Use Tailwind's `--spacing()` function inside `calc()` expressions. Do not hardcode pixel values.
- Stick to the site's visual language: consistent gap sizes, color usage, color-alpha patterns, and font choices already established across pages. When in doubt, look at how existing pages handle similar UI.
- Prefer CSS flex and grid layout over flow layout.
- If a component in `app/components/` is just a single element plus styles with no custom behavior, a Tailwind utility class in `styles.css` may be more appropriate. If a component is only used in one place, it may not need to be a component at all.

### TypeScript

- Avoid unsafe TypeScript: no `any` (use `unknown`), no casting (`as SomeType`), no non-null assertions (`value!`).

### Organization

- Collocate by domain, not by type: `blog/images/` and `blog/components/`, not `images/blog/` and `components/blog/`.
- Use MDX for primarily static content pages; React components for everything else.
- Split pages into separate files/components by section to avoid monolithic files.
- Put frequently edited data (arrays of info, tweak-able parameters) at the top of files.
- Use lodash utility functions (already bundled) to keep code concise.

### Logging

- `console.log` — temporary/debug only (easy to grep and remove)
- `console.debug` / `console.info` — sparingly, for production-useful info
- `console.warn` / `console.error` — try/catch and error paths

### The `/testbed` page

Visit `/testbed` in the dev server for a live overview of available components, formatting options, and design elements. Check it before building new UI to avoid reinventing what already exists.
