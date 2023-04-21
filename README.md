# astro-internalise-css

Astro integration to internalise all external style sheets in HTML files.

**Before**:

```html
<html>
  <head>
    <link href="/foo.css" />
    <link href="/bar.css" />
  </head>
</html>
```

```css
/* foo.css */
.foo {
  color: blue;
}
```

```css
/* bar.css */
.bar {
  color: red;
}
```

**After**:

```html
<html>
  <head>
    <style type="text/css">
      .foo {
        color: red;
      }
    </style>
    <style type="text/css">
      .bar {
        color: blue;
      }
    </style>
  </head>
</html>
```

And unreferenced external style sheets `foo.css` and `bar.css` removed!

## Installation

[Automatic integration setup](https://docs.astro.build/en/guides/integrations-guide/#automatic-integration-setup):

```sh
npx astro add astro-internalise-css
```

Or manually:

```sh
npm install -D astro-internalise-css
```

```js
// astro.config.mjs
import astroInternaliseCSS from "astro-internalise-css";

export default {
  integrations: [astroInternaliseCSS()],
};
```

## Motivation

When a browser requests a website, the website is transferred to the client in packets. The size of these packet transfers will get incrementally larger (based on [TCP slow start](https://developer.mozilla.org/en-US/docs/Glossary/TCP_slow_start)), but the first packet is 14KB.

Many websites are small enough to internalise external style sheets for each HTML file and still be under 14KB, thus the website can be delivered to the client in the first packet transfer. This is faster than delivering the HTML and external style sheets in separate packets where delays are incurred from extra fetches. Even if the website is not under 14KB, internalising CSS will usually be more performant for smaller sites.

Note: one such benefit of using external style sheets is the browser can cache individual CSS files, and so if the website is large and changes over time are made to select CSS files, then it may make sense to avoid this integration to take advantage of browser caching.

## Contributing

Please report any issues or feature requests on GitHub. Contributions are welcome!

I appreciate the current implementation is quite simple and naive but it gets the job done (for now).

## Acknowledgements

Inspired by [astro-single-file](https://github.com/onmax/astro-single-file).

Astro is working on integrating [CSS inlining](https://github.com/withastro/roadmap/issues/556) natively. When this is available, this integration may be redundant.
