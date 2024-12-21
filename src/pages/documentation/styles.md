---
layout: base
title: Styles
subtitle: How to style your site with Tailwind css
description: Styles in huwindty with tailwind
ismarkdown: true
---
## Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows you to write more concise and maintainable CSS code. Tailwind focuses on providing low-level utility classes that can be combined to create custom components.

Tailwind CSS generates CSS code using a combination of configuration files, JavaScript, and PostCSS plugins.

## CSS generation

For this starter project, CSS generation is managed by eleventy.js.

In [windty](https://github.com/distantcam/windty), the previous starter,  css was generated with a separate run script in packages.json. The default `npm start` was triggering both 11ty and tailwind generation. The Postcss configuration was in a separate file.

I moved the css generation directly to the `eleventy.js` config file. It still uses Postcss. 

Here is what processes the styles in `eleventy.js`:

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

### Additional markdown styles

In addition, the markdown-it-attrs plugins allows for additional classes to be added to the markdown output. This allows to specific styles to markdown components. As an example you can look at the note above within the same layer component.

```css
  .mkdn .note {
    @apply text-cyan-900 bg-sky-200 border p-4 border-cyan-900 border-l-8
    before:content-['ⓘ_Note:_'] before:font-bold
  }
```

To apply this style, the `markdown-it-attrs` plugin is simply added to the call for the markdown parser `markdown-it` that is loaded in `eleventy.js`.

```js
const mdit = require('markdown-it')
const mditAttrs = require('markdown-it-attrs');
const mditHighlight = require('markdown-it-highlightjs');

module.exports = function(eleventyConfig) {
  const mditOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  }
  const mdLib = mdit(mditOptions).use(mditAttrs).use(mditHighlight, { inline: true }).disable('code')
  eleventyConfig.setLibrary('md', mdLib)
}
```
