# 3Blue1Brown Website

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Build the site locally

1. [Install Node](https://nodejs.org/en/download/)
2. [Install Yarn](https://classic.yarnpkg.com/en/docs/install)
3. [Install Git LFS](https://git-lfs.github.com/)
4. Install an [MDX syntax highlighting plugin for your code editor](https://marketplace.visualstudio.com/items?itemName=silvenon.mdx)
5. If installing Git LFS for the first time on your user account, run `git lfs install`
6. Run `yarn dev`
7. Open [http://localhost:3000](http://localhost:3000) to see the site

## Background Knowledge

<!-- TO DO: add basic descriptions? e.g. https://github.com/greenelab/lab-website-template/wiki/Background-Knowledge -->

### Basic

What you need to know if you're just authoring lessons or otherwise editing `.mdx` files:

- **[Git](https://try.github.io/)**
- **[GitHub](https://github.com/)**
- **[Markdown](https://www.markdownguide.org/)**
- **[MDX](https://mdxjs.com/)**
- **[YAML](https://en.wikipedia.org/wiki/YAML)**

### Advanced

What you also need to know if you're editing the website more in depth:

- **[HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)**
- **[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)**
- **[Sass](https://sass-lang.com/)**
- **[JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/JavaScript)**
- **[React](https://reactjs.org/)**
- **[JSX](https://reactjs.org/docs/introducing-jsx.html)**
- **[Next.js](https://nextjs.org/)**
- **[create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)**
- **[Yarn](https://yarnpkg.com/)**
- **[Node](https://nodejs.org/en/)**
- **[GitHub Actions](https://github.com/features/actions)**
- **[webpack](https://webpack.js.org/)**

## Guidelines

Guidelines to ensure consistency and quality of contributions are listed in `.github/pull_request_template.md`.
Some items may refer back to this readme for longer lists or documentation.

## Components

Components (or "widgets") are building blocks for visual and interactive elements that go beyond basic Markdown.
You can use components in your `.mdx` files and pass them options/parameters called "props".

The basic syntax is:

```jsx
<SomeComponent someString="some string" someNumber={42} someFlag={true} />
```

Or for some components that may need longer-form inputs:

```jsx
<SomeComponent>Lorem ipsum dolor</SomeComponent>
```

The inner contents are referred to as the `children` prop below.

This section only covers the components and props meant to be used in lessons.
For documentation of other components and props, look in the components folder.

- 📚 = prop accepts markdown and math
- 🚨 = prop is required for component to render

### Accordion

An expandable/collapsible section.

- `title` 🚨 - Text to show in clickable button that expands/collapses more content beneath.
- `children` 🚨📚 - Content to show under title button when expanded.

### Center

Centers a group of arbitrary elements.
You shouldn't need to use this in lessons much, if ever.
Most components align themselves as stylistically appropriate.

- `children` 🚨 - Arbitrary content.

### Clickable

A button is an element that does something on the current page.
A link is an element that goes somewhere.
This component is a big clickable that combines the two for stylistic consistency, hence the generic name "clickable".

Normal in-text links can still be made with regular Markdown syntax.
This component is used outside of lessons, but in lessons you should only use this component for important links you want to emphasize.

- `link` 🚨 - Location to go to when link is clicked.
- `icon` - Font Awesome class of icon to show next to text.
- `text` - Text to show.
- `design` - Style of the clickable.
  `rounded` for rounded.
  Default `""` for square.

Also required: `icon` or `text`

### Figure

A component to show image and/or video and caption, with controls to switch between them.

- `id` - A page-unique identifier like `some-figure` to attach to the figure so you can link to it like `[Some Figure](#some-figure)`.
- `image` 🚨 - Path to image file.
- `video` 🚨 - Path to video file.
- `show` - Whether to show image or video by default.
  One of `"image"` or `"video"`.
- `caption` 📚 - Caption for both image and video.
- `imageCaption` 📚 - Caption just for image.
- `videoCaption` 📚 - Caption just for video.
- `width` - Manually set width like `300px`.
  Displayed width will never go beyond screen.
- `height` - Manually set height like `300px`.
- `loop ` - Whether to loop video, `true` or `false`.

For `image` and `video`, if you provide a relative url, links to that path in the Linode bucket.
Omit `width` and `height` whenever possible to let the figure auto-size based on the aspect ratio of the image/video.

### Interactive

Dynamically imports another react component and displays it in a frame.

- `filename` 🚨 - Name of a `.js` file (without the extension) in the same folder as the lesson.
- `children` - A function that takes the component loaded from `filename` and returns what to render (allows passing props to the loaded component).
- `aspectRatio` - A number representing the width / height of the box in which the interactive lives. (Default: 16 / 9)
- `allowFullscreen` - A boolean indicating whether to show a full screen button in the top right (defaults to `false`)

Example of `children`: `<Interactive>{(MyComponent) => <MyComponent someProp="some value" />}</Interactive>`.

### Lesson Link

An in-text link to another lesson that shows a preview of the lesson in a tooltip on hover/focus.

- `id` 🚨 - Identifier slug for lesson, like `quick-eigen`.
- `children` - Link text.

### Pi Creature

A pi creature with a chosen emotion and optional speech/thought bubble text.

- `emotion` - Filename of emotion in /pi-creatures folder.
  Default `hooray`.
- `text` 📚 - Text to show in bubble.
  Omit to not show any bubble.
- `thought` - Whether bubble is thought (`true`) or speech (`false`).
  Default `false`.
- `placement` - How to place the pi.
  `side` puts the pi to the right of the main page column (with its bottom aligned with the bottom of the previous element, which can be a paragraph, figure, etc.), and hides the pi completely when the screen isn't wide enough.
  `inline` puts inside the main page column as if it were its own paragraph.
  `auto` puts the pi to the side when the screen is wide enough, and inline when it isn't.
  Default `auto`.
- `flip` - If `true`, puts the pi to the left instead of the right.

### Question

Interactive multiple-choice question with explanation.

- `question` 🚨📚 - Text of the question
- `choice1` through `choice6` 🚨📚 - Possible choices.
- `answer` - Which choice number is the correct one, e.g. `answer={3}`.
- `explanation` 📚 - Explanation of answer once reader gets it correct.

### Section

Sections are the alternating white/off-white backgrounds that span the entire width of the page.
Use these sparingly to divide your lesson into big groups.

- `children` 📚 - Arbitrary content.

Example:

```markdown
... previous section of content

</Section><Section>

... next section of content
```

### Spoiler

"Redacted" text that reveals itself on hover/focus, similar to spoilers on Reddit and other forums.

- `children` 📚 - Arbitrary content.

### Twitter

Component to embed a tweet (and possibly other Twitter things in the future?).

`tweet` 🚨 - Id of tweet.
