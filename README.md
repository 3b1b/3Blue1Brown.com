
## Getting Started

To serve a local version of the site start by installing [Hugo](https://gohugo.io/getting-started/installing/) and [Git LFS](https://git-lfs.github.com/). If on Windows or donwloading the tarball, make sure to download the extended version of Hugo. On macOS this can be done with [Homebrew](https://brew.sh/) using the two commands:

```sh
brew install hugo
```

```sh
brew install git-lfs
```

If installing Git LFS for you first time, run the command below. This command only needs to be run once per user account.

```sh
git lfs install
```

Make sure Hugo is in your PATH.

```sh
hugo version
```

Then clone the repository.

```sh
git clone git@github.com:3b1b/3Blue1Brown.com.git
```

Navigate into the directory and serve the local site.

```sh
hugo serve
```

Common flags to use while developing are shown below.

```sh
hugo serve --buildFuture --buildDrafts --buildExpired
```

For example, these flags generate the testbed lesson located here: http://localhost:1313/lessons/testbed-lesson/ to be viewed. More flags for Hugo can be found [here](https://gohugo.io/getting-started/usage/).
