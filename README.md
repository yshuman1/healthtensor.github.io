# HealthTensor's Website

The site is built using [jekyll](https://jekyllrb.com/).

## Testing Locally

First ensure you have [pip](https://pypi.python.org/pypi/pip) and
[bundler](https://bundler.io) installed. Then, use those to pull
down the rest of the dependencies by running:

```
lang=shell
make dev-deps
```

Build the site, watch for changes, and serve it from a webserver:

```
jekyll serve --watch
```

... and navigate to [http://localhost:4000](http://localhost:4000).
