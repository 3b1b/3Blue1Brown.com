
- I experimented with some figures of straight math equations instead of display style math.
- The "sum rule" is structured as here

## Design File Storage

I'm opening this issue to raise some small changes around storing design files alongside the `mdx` files. The motivation for storing these files in the repo are:

1. Faster workflow (import & export of files)
2. Better open source contribution

Mainly, I'm thinking that it makes sense for these files to be stored in git LFS. Do people agree with this?

Also, I propose adding some ignore rules to allow for temporary and uncompressed files to live in the lesson.

```
**/*.ignore.mov
**/*.ignore.mp4
**/*.ignore.png
**/*.ignore.jpg
**/*.ignore.jpeg
**/*.ignore.ai
```

This is related to open source contribution # and article translation #.
