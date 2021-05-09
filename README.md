# 3Blue1Brown.com

Website for 3Blue1Brown

## Contributing

### Background Reading

Before making edits to this website, you should know a little bit about the terminology and technologies involved.
See [these docs](https://github.com/greenelab/lab-website-template/wiki/) and [this page in particular](https://github.com/greenelab/lab-website-template/wiki/Background-Knowledge) (from a similar website/template built on the same technologies) for a crash course on how things work.

### Advanced

To make more structural changes to the site, you may want to build it locally:

1. [Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
2. [Install Bundler](https://bundler.io/) by running `gem install bundler`
3. [Install Jekyll](https://jekyllrb.com/) by running `gem install jekyll`
4. Start the site by running `bundle exec jekyll serve --trace --open-url --livereload`

The site should automatically open in your default browser.
Any changes you make should automatically rebuild the site and refresh the page, except for changes to `_config.yml` which require re-running the start command.
