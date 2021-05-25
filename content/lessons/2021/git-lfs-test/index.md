---
title: Git LFS Test
description: Testing for git lfs integration
date: 2021-05-25
tags:
  - interactive
---

Site parameters

{{<test>}}

## Animation Test .mp4

Animation served using `git lfs`:

{{<figure video="https://github.com/3b1b/3Blue1Brown.com/raw/workflow/content/lessons/2021/git-lfs-test/animation-1.27-2.01.mp4" />}}

Animation served from static bucket:

{{<figure video="https://3b1b-posts.us-east-1.linodeobjects.com/lessons/git-lfs-test/animation-1.27-2.01.mp4" />}}

After environments are setup, this is how the shortcode might look.

```js
figure video="titile-animation.mp4"
```