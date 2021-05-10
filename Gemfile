source "https://rubygems.org"

# packages
gem "jekyll"
gem "jekyll-feed"
gem "jekyll-redirect-from"
gem "jekyll-last-modified-at"
gem "jekyll-paginate-v2"

# windows stuff
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

gem 'eventmachine', '1.2.7', git: 'git@github.com:eventmachine/eventmachine', tag: 'v1.2.7' if Gem.win_platform?
