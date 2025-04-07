---
layout: base
title: Styles
headline: How to style your eleventy site with Tailwind css
description: Styles in huwindty with tailwind
thumbnail: /img/vera.jpg
ismarkdown: true
templateEngineOverride: md
---
## Tailwind CSS

Tailwind CSS is a CSS framework that allows you to write more concise and maintainable CSS code thanks to utility classes . Tailwind focuses on providing low-level utility classes that can be combined directly in the markup of any component.

Tailwind CSS generates CSS code using a combination of configuration files, JavaScript, and PostCSS plugins. This generated file only contains the utility classes that are used in the project, thus reducing the size of the final CSS file compared to other CSS frameworks.

## CSS generation

In the origin starter [windty](https://github.com/distantcam/windtysdsd), css was generated with a separate run script in packages.json. The default `npm start` was triggering both 11ty and tailwind generation. The Postcss configuration was in a separate file.

For huwindty, the CSS generation is managed by directly in eleventy.js. It is gererated as any other template `styles.css.njk` that includes the css from the main tailwind configuration file: `_assets/css/tailwind.css`.

```js
---
eleventyExcludeFromCollections: true
permalink: /css/styles.css
---

{% set css %}
  {% include "../../_assets/css/tailwind.css" %}
{% endset %}
{{css | postcss | safe}}
```

Thanks to the `permalink: /css/styles.css`, the static site css file is generated in root of the `_site` folder.

The file `tailwind.css` is the css file that imoports tailwind, it loads it anc contains extra definiions that can but then used in your project. For examplpe it contains a `@theme` defining the color scheme and `@utility mkdn` that sets the default style of the page content.

```css
@import 'tailwindcss';

@theme {
  --color-primary: #155dfc; /* blue-600 */
  --color-secondary: #372aac; /* indigo-800 */
  (…)
}

@utility mkdn {
    & h2 {
    @apply mt-8 mb-6 text-left text-2xl font-bold leading-tight text-secondary dark:text-secondary-dark;
  }
  (…)
}

```

The style is processed with tailwind as part of the site generation with a postCSS filter that it added to the layouts in eleventy's config.

```js
  // Watch targets
  eleventyConfig.addWatchTarget('src/_layouts/css/tailwind.css');
  
  // process css
  eleventyConfig.addNunjucksAsyncFilter('postcss', postcssFilter);
```

The filter is defined in `eleventy.js` as a callback that sets the postCSS configuration. After processing the tailwind rendering, it minifies the css with cssnano.

```js
const postcssFilter = (cssCode, done) => {
  postCss([
    tailwind(), // process tailwind with postcss
    autoprefixer,
    cssnano({ preset: 'default' }) // minify css
  ])
    .process(cssCode, {
      from: './src/_layouts/css/tailwind.css'
    })
    .then(
      (r) => done(null, r.css),
      (e) => done(e, null)
    );
}
```

This configuration was inspired by the blog post [How to Integrate PostCSS and Tailwind CSS](https://zenzes.me/eleventy-integrate-postcss-and-tailwind-css/).


## Tailwind and Markdown

Tailwind CSS is ideal to use in html files, but markdown doesn't support tailwind utilities. For this, there are two solutions: *Create custom Tailwind components* and *add classes to the Markdown output*. Both are explained in detail in the blogpost [Eleventy, Markdown, and Tailwind CSS](https://dev.to/matthewtole/eleventy-markdown-and-tailwind-css-14f8) 

In order to keep markdown files to focus on content I chose to implement the first one (*Create custom Tailwind components*) in this starter. These are the rules listed in `tailwind.css` under `@utility mkdn`. 

These default styles can also be rendered within an html file by adding a class `mkdn` to an html wrapper element. This is the case for example in the `index.njk` layout.

### Additional markdown styles

In addition, the markdown-it-attrs plugins allows for additional classes to be added to the markdown output. This allows to add specific styles to markdown components.

To apply specific styles, the `markdown-it-attrs` plugin is simply added to the call for the markdown parser `markdown-it` that is loaded in `eleventy.js`. (See [Markdown](/documentation/markdown/))

This is capability can get styles look messy very quickly. It is recommanded to only use it for a few classes.{.note}

As an example the note above is generated with the following markdown text:

```txt
This is capability can get css messy very quickly. It is recommanded to only use it for a few classes.{.note}
```
and is styled thanks to the following css class that is also added under `@utility mkdn`:

```css
  .mkdn .note {
    @apply text-cyan-900 bg-sky-200 border p-4 border-cyan-900 border-l-8
    before:content-['ⓘ_Note:_'] before:font-bold
  }
```

This is also possible to use tailwind utility classes in markdown. It can be used to add extra style but will not override the defaults defined with `@utility mkdn`. These default will always take precedence. 

In this text all utility classes are used except the text colour.{.p-8 .bg-orange-800 .text-sky-300 .border .border-4 .border-sky-300}

For example, the frame above is styled with the following:

```
{.p-8 .bg-orange-800 .text-sky-300 .border .border-4 .border-sky-300}
```
but you can see that the text is not in the expected colour because the `@utility mkdn` defines the colour of the text in every paragraphs and this takes precedence. 

In this text all utility classes are used even the text colour.{.p-8 .bg-orange-800 .text-sky-300! .border .border-4 .border-sky-300}

You can make the text colour overide the base utility with the `!` symbol that acts in tailwind as the usual `!important` css. The example above is styled with the following:

```
{.p-8 .bg-orange-800 .text-sky-300! .border .border-4 .border-sky-300}
```

Even if you have the capability to use as many styles as you want, use all tailwind utility classes and even `!` to orveride base utilities, it is recomanded to keep it simple and use it scarely. Markdown is great to help you focus on your content. You should not ruin it with distracting pieces of code.