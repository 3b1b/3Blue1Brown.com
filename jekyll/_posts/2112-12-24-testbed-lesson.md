---
title: Testbed Lesson
description: Brief, 1-2 sentence description of lesson. Shows under search results and elsewhere.
video: spUNpyF58BY
credits:
  - Lesson and figures by Grant Sanderson
  - Translated to blog format by James Schloss
tags:
  - interactive
---

Markdown content.
One sentence per line.

<!-- html comment (will appear in the rendered page's source code) -->

{% comment %}
liquid comment (will not appear in the rendered page's source code)
{% endcomment %}

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

[Link to external page](https://some-website.org/)

[Link to page in root](extras)

[Link to page not in root]({{ "extras/cameos" | relative_url }})

Centered element.
{:.center}

---

# Top level heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Secondary heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Very specific heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

#### Even more specific heading

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

{% include components/section.html %}

| TABLE | Game 1 | Game 2 | Game 3 | Total |
| :---- | :----: | :----: | :----: | ----: |
| Anna  |  144   |  123   |  218   |   485 |
| Bill  |   90   |  175   |  120   |   385 |
| Cara  |  102   |  214   |  233   |   549 |

> It was the best of times it was the worst of times.
> It was the age of wisdom, it was the age of foolishness.
> It was the spring of hope, it was the winter of despair.

```javascript
// a comment
const popup = document.querySelector("#popup");
popup.style.width = "100%";
popup.innerText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
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

<!-- section break component -->

{% include components/section.html %}

<!-- figure with image and/or video, and caption -->

{% include components/figure.html image="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/earth-4k.max-1000x1000.jpg" %}

{% include components/figure.html video="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4" %}

{% include components/figure.html image="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/earth-4k.max-1000x1000.jpg" video="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4" caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." %}

{% capture caption %}
Markdown in caption.
[Test link](https://google.com/).
$$f(x) = \pi + e^{-i} + sin(x)$$
{% endcapture %}

{% include components/figure.html image="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/earth-4k.max-1000x1000.jpg" video="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4" show="video" caption=caption %}

<!-- spoiler component -->

Why did the chicken cross the Mobius strip? {% include components/spoiler.html text="To get to the same side." %}
{% include components/spoiler.html text="$$f(x) = \pi + e^{-i} + sin(x)$$" %}

<!-- question component -->

{%
  include components/question.html
  question="Why did the chicken cross the road?"
  choice1="To get to the other side"
  choice2="For a bit of $$f(x) = \pi + e^{-i} + sin(x)$$ and some haggis"
  choice3="Cannot be determined"
  choice4="A superposition of all the answers above"
  correct=4
%}

<!-- pi creatures -->

Pi creature next to paragraph of text.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

{% include components/pi-creature.html emotion="happy" %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

{% include components/pi-creature.html emotion="confused" flip=true %}

<!-- clickable (link or button) with icon and/or text -->

{% include components/clickable.html link="https://3blue1brown.com" text="Link Text" tooltip="Tooltip text" %}
{% include components/clickable.html link="https://3blue1brown.com" icon="fas fa-search" text="Link Text" tooltip="Tooltip text" %}
{% include components/clickable.html link="https://3blue1brown.com" icon="fas fa-search" tooltip="Tooltip text" %}
{% include components/clickable.html link="https://3blue1brown.com" text="Link Text" tooltip="Tooltip text" style="rounded" %}
{% include components/clickable.html link="https://3blue1brown.com" icon="fas fa-search" text="Link Text" tooltip="Tooltip text" style="rounded" %}
{% include components/clickable.html link="https://3blue1brown.com" icon="fas fa-search" tooltip="Tooltip text" style="rounded" %}
{:.center}

<!-- slideshow component -->

{% include components/slideshow.html images="images/store" %}
