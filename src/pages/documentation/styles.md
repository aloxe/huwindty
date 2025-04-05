---
layout: base
title: Styles
headline: How to style your site with Tailwind css
description: Styles in huwindty with tailwind
thumbnail: /img/vera.jpg
ismarkdown: true
templateEngineOverride: md
---
## Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows you to write more concise and maintainable CSS code. Tailwind focuses on providing low-level utility classes that can be combined to create custom components.

Tailwind CSS generates CSS code using a combination of configuration files, JavaScript, and PostCSS plugins.

## CSS generation

For this starter project, CSS generation is managed by eleventy.js.

In the origin starter [windty](https://github.com/distantcam/windtysdsd), css was generated with a separate run script in packages.json. The default `npm start` was triggering both 11ty and tailwind generation. The Postcss configuration was in a separate file.

Now the css is generated from a specific css template that is processed by eleventy.
```js
---
eleventyExcludeFromCollections: true
permalink: /css/styles.css
---

{% set css %}
  {% include "../../_assets/css/styles.css" %}
{% endset %}
{{css | postcss | safe}}
```

Thanks to the `permalink: /css/styles.css`, the file is created in the `_site` folder, and because the include file is in the watch target, the tailwind css is processed.

```js
  // Watch targets
  eleventyConfig.addWatchTarget("./src/_assets/css/");

  // process css
  eleventyConfig.addNunjucksAsyncFilter('postcss', postcssFilter); 
```

The css generation still uses Postcss which is set directly in the `eleventy.js` config file:

```js
const postcssFilter = (cssCode, done) => {
  postCss([
    require('postcss-import'),
    tailwind(require('./tailwind.config')),
    autoprefixer(),
  ])
    .process(cssCode, {
      from: './src/_assets/css/styles.css'
    })
    .then(
      (r) => done(null, r.css),
      (e) => done(e, null)
    );
}
```

This configuration was inspired by the blog post [How to Integrate PostCSS and Tailwind CSS](https://zenzes.me/eleventy-integrate-postcss-and-tailwind-css/).

The tailwind configuration remains in `tailwind.config.js`.

## Tailwind and Markdown

Tailwind CSS is ideal to use in html files, but markdown doesn't support tailwind snippets. For this, there are two solutions: *Create custom Tailwind components* and *add classes to the Markdown output*. Both are explained in detail in the blogpost [Eleventy, Markdown, and Tailwind CSS](https://dev.to/matthewtole/eleventy-markdown-and-tailwind-css-14f8) 

In order to keep markdown files to focus on content I chose to implement the first one (*Create custom Tailwind components*) in this starter. Here are the styles used by markdown pages in this starter:

```css
@layer components {
  .mkdn h2 {
    @apply mt-8 mb-6 text-left text-2xl font-bold leading-tight text-indigo-800
  }
  .mkdn h3 {
    @apply my-4 text-left text-xl font-bold leading-normal text-blue-950
  }
  .mkdn p {
    @apply my-4 text-xl font-light leading-6 text-slate-900
  }
  …
}
```

### The mkdn.css stylesheet

For better performence the stylesheet loaded for markdown is only loaded for pages generated from markdown. This allows pages generated from html to load the basic styles.css stylesheet without the unused markdown styles.


### Additional markdown styles

In addition, the markdown-it-attrs plugins allows for additional classes to be added to the markdown output. This allows to add specific styles to markdown components.

This is capability can get styles look messy very quickly. It is recommanded to only use it for a few classes.{.note}

As an example the note above is generated with the following markdown text:

```txt
This is capability can get css messy very quickly. It is recommanded to only use it for a few classes.{.note}
```
and is styled thanks to the following css class:

```css
  .mkdn .note {
    @apply text-cyan-900 bg-sky-200 border p-4 border-cyan-900 border-l-8
    before:content-['ⓘ_Note:_'] before:font-bold
  }
```

To apply this style, the `markdown-it-attrs` plugin is simply added to the call for the markdown parser `markdown-it` that is loaded in `eleventy.js`. (See [Markdown](/documentation/markdown/))
