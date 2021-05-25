---
title: Git LFS Test
description: Testing for git lfs integration
date: 2025-01-01
tags:
  - interactive
---

## Animation Test .mp4

Animation served using `git lfs`:

{{<figure video="https://github.com/3b1b/3Blue1Brown.com/raw/workflow/test/title-animation.mp4" />}}

Animation served from static bucket:

{{<figure video="https://3b1b-posts.website-us-east-1.linodeobjects.com/test/title-animation.mp4" />}}

After environments are setup, this is how the shortcode might look for a local figure.

```js
figure video="titile-animation.mp4"
```