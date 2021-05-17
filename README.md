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
4. Start the site by running `start.sh`

The site should automatically open in your default browser.
Any changes you make should automatically rebuild the site and refresh the page, except for changes to `_config.yml` which require re-running the start command.

<details>
<summary>OSX Installation Notes</summary>

Install ruby using [homebrew](https://brew.sh/).

```sh
brew install ruby
```

After the command finishes, update your path variable using the instructions provided by the command. **Note:** This location may be different depending on your environment.

```sh
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
```

Apply the changes to the path variable.

```sh
source ~/.zshrc
```

Check that the version of `ruby` is same version as brew installed.

```sh
ruby -v
```

Check that the location of `ruby` is where brew installed it as opposed to the default version.

```sh
which ruby
```

Install `bundler` and `jekyll`. The `user-install` flag prevents a write permissions error when installing `bundler`. See [bundler docs](https://bundler.io/doc/troubleshooting.html).

```sh
gem install --user-install bundler jekyll
```

Navigate to the site's repository directory on your local machine.

```sh
cd ~/Sites/3Blue1Brown.com
```

Change to a local project configuration.

```sh
bundle config set --local path 'vendor/bundle'
```

Install the dependencies.

```sh
bundle install
```

Try serving the local site, if an error is thrown, see the two notes below.

```sh
bundle exec jekyll serve --trace --open-url --livereload
```

Two errors have been encountered. The first is where the `jekyll` command is unable to be found. The solution is to add the `webrick` dependency. See [jeyyll issue #8523](https://github.com/jekyll/jekyll/issues/8523).

```sh
bundle add webrick
```

The second is an error related to a missing dependency. The fix is to install `libffi` using brew. See [this thread](https://github.com/ffi/ffi/issues/651#issuecomment-434927135) referenced from [this article](https://medium.com/@mythreyi/the-agony-of-setting-up-jekyll-on-macos-catalina-aedd0a536ae).

```sh
brew install libffi
```
</details>
