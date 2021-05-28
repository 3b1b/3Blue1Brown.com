---
# children build options with cascade
# https://gohugo.io/content-management/build-options/
cascade:
  _build:
    # This option is set to false to prevent source assets from beining published to the build 
    # directory by default. Page resources are instead published "on demand" when their .RelPermalink
    # or .Permalink is invoked from a template.
    publishResources: false
---

### Lessons

{{< lesson-gallery show="topics" >}}
