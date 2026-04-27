## Background

- Website for popular math education YouTube channel
- High-volume, mixed-device, international traffic
- Mostly static text and assets, occasional dynamic content
- Prominently features video lessons, many with accompanying written versions
- Significant and critical use of math TeX
- Hundreds of pages

## Stack

- Bun (v1.3+)
- Node (v24+)
- TypeScript
- React (v19)
- React Router (v7, in "framework mode")
- Vite
- Tailwind (v4)
- MDX (w/ frontmatter and basic remark)
- MathJax
- ESLint
- Prettier
- Playwright
- Deque Axe
- Netlify

### Notes

- Framework
  - All routes pre-rendered (no SSR), with some client-side hydration
  - NOT an SPA
- Platform
  - Bun used as faster platform and package manager alternative to Node
  - Fallback to Node when needed
  - Don't use Bun-only features, avoid vendor lock-in
- Math
  - MathJax generates math from TeX at run-time, not at build-time

---

## Commands

```bash
# Basic
bun install                         # Install packages
bun run install-playwright          # Install browsers for integration tests
bun run clean                       # "Hard" uninstall
bun run dev                         # Dev server at localhost:31415
bun run build                       # Build production to /build/client
bun run preview                     # Serve production build

# Auto-fixes
bun run lint                        # Fix linting
bun run format                      # Fix formatting

# Tests (critical)
bun run test:types                  # Test types (except MDX)
bun run test:lint                   # Test linting
bun run test:format                 # Test formatting
bun run test:e2e                    # Integration tests (critical routes only)
bun run test                        # All tests

# e2e variants
ROUTE= bun run test:e2e             # All routes
ROUTE=/route bun run test:e2e       # Routes matching regex
bun run test:e2e some-test.spec     # Specific test

# Checks (many false positives, use discretion)
bun run check:spelling              # Spelling
bun run check:unused                # Unused code
bun run check:links                 # Broken links
```

## Repo Structure

- `/app`
  - `/api` - Client-side requests
  - `/assets` - General images/videos/etc
  - `/components` - Low-level and widely-used components (buttons, header, etc.)
  - `/data` - Top-level site data
  - `/pages` - Hierarchy of site's pages and content/components/assets/data/etc. specific to each of them
  - `/util` - Generic, broadly reusable functions
- `/public` - Avoid, use `import`s instead

---

## Rules

Follow these carefully.

### Minimalism

- Don't re-invent utils that installed packages (e.g. Lodash or React hooks) or existing components can provide
- Avoid adding something only slightly different from an existing one (e.g. slightly lighter blue to only use in one place)
- Always check for an existing component before using a third-party or native HTML element, e.g. use our `<Link>` instead of React Router's `<Link>` for consistent styling and behavior
- Use React idioms where possible, but don't be afraid to break when appropriate (e.g. `useState` for local state vs. Jotai for simple shared state)

### Safety

- Avoid unsafe TypeScript: `any` (use `unknown` instead), casting (`as SomeType`), non-null assertions (`value!`)
- Be forward-looking, but only use features with 1+ years of stable Chrome/Firefox/Safari support
- Use explicit build-time imports for type-safety and bundler optimizations

### Styling

- Use Tailwind classes for styling (custom CSS as last resort)
- Use inline CSS only for dynamic values
- Avoid Tailwind `!` important modifier, achieve specificity via `@layer` or conditional classes
- Use Tailwind `--spacing()` function inside `calc()` expressions, avoid hardcoded values
- Stick to site's existing visual design language: gap sizes, color usage, color-alpha patterns, font choices, component usage, etc.

### Syntax

- Use `~/` prefix for all imports (except when files meant to always be colocated)
- Use `function () {}` notation for React components, `() => {}` (arrow) notation for everything else
- JS/TS in `lowerCamelCase`, components and types in `UpperCamelCase`, files and CSS classes in `lower-kebab-case`
- Avoid single letter var names e.g. `i` or `<T>`
- Use `clsx` for `className` conditionals

### Organization

- Split page sections into separate components for easier re-ordering and less monoliths
- Put frequently edited data (arrays of info, tweak-able parameters) at top of files
- Collocate by domain, not by type, e.g. `blog/images/` and `blog/components/`, not `images/blog/` and `components/blog/`
- Use MDX for swaths of static content, React components for everything else

### Logging

- `console.log` - temporary (easy to grep and remove)
- `console.debug` / `console.info` - (sparingly) for in-prod troubleshooting
- `console.warn` / `console.error` - try/catch or as appropriate
