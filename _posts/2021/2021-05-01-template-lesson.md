---
title: Lesson Title
description: Brief, 1-2 sentence description of lesson. Shows under search results and elsewhere.
video: spUNpyF58BY
category: Geometry
order: 1
credits:
  - Lesson and figures by Grant Sanderson
  - Translated to text by James Schloss
tags:
  - interactive
  - geometry
---

Markdown content.
One sentence per line.

<!-- comment -->

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

_italic text_

**bold text**

~~strike-through text~~

- list item a
- list item b
- list item c

1. ordered list item 1
2. ordered list item 2
3. ordered list item 3

[Link](https://some-website.org/)

Centered element.
{:.center}

---

# Top level heading
## Secondary heading
### Very specific heading
#### Even more specific heading

{% include components/section.html %}

| TABLE | Game 1 | Game 2 | Game 3 | Total |
| :---- | :----: | :----: | :----: | ----: |
| Anna  |  144   |  123   |  218   |  485  |
| Bill  |   90   |  175   |  120   |  385  |
| Cara  |  102   |  214   |  233   |  549  |

> It was the best of times it was the worst of times.
> It was the age of wisdom, it was the age of foolishness.
> It was the spring of hope, it was the winter of despair.

```javascript
// a comment
const popup = document.querySelector("#popup");
popup.style.width = "100%";
popup.innerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
```

This sentence has `inline code`, useful for making references to variables, packages, versions, etc. within a sentence.

{% include components/section.html %}

An example of inline math $$f(x) = \pi + e^{-i} + sin(x)$$ in the middle of a sentence.
An example a block of math:

$$
\underbrace{\frac{1}{t_2-t_1}\int_{t_1}^{t_2} g(t)e^{-2 \pi i f t}dt}_{\text{Center of mass}}
\qquad\rightarrow\qquad
\underbrace{\int_{t_1}^{t_2} g(t)e^{-2 \pi i f t}dt}_{\text{Scaled center of mass}}
$$

{% include components/section.html %}

<!-- link with icon and/or text -->
{% include components/link.html link="https://3blu1brown.com" icon="fas fa-search" text="Link Text" tooltip="Tooltip text" %}
{% include components/link.html link="https://3blu1brown.com" icon="fas fa-search" text="Link Text" tooltip="Tooltip text" style="button" %}
{% include components/link.html link="https://3blu1brown.com" icon="fas fa-search" text="Link Text" tooltip="Tooltip text" style="circle" %}
{:.center}