---
layout: base
title: Markdown
headline: Using Markdown to shape your content in 11ty
description: How do use Markdown in your 11ty website and how does it work
tags: ''
author: alix
date: 2025-10-15
thumbnail: /img/animals/heron.jpg
ismarkdown: true
---
## Markdown

Markdown is a lightweight markup language that allows you to create formatted text using plain text syntax. It is easy to read and write and is often used with 11ty.

Pages using markdown are the same as html pages, they use the same front matter, but the content is written in markdown. The file extension is `.md`.

## Markdown configuration

In this starter, 11ty is parsing markdown with `markdown-it` to generate the html pages. The configuration for `markdown-it` is in `eleventy.js`.

```js
const mdit = require('markdown-it');
const mditAttrs = require('markdown-it-attrs');
const hljs = require('highlight.js/lib/core');

module.exports = function(eleventyConfig) {
  const mditOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  }
  const mdLib = mdit(mditOptions).use(mditAttrs)
  // Load any languages you need to highlight
  // (...)
  // highlight codeblocksaccording to language
  // (...)
  // generate responsive images from Markdown
  // (...)
  eleventyConfig.setLibrary('md', mdLib)
}
```

## Plugins

`markdown-it` accepts [additional plugins](https://mdit-plugins.github.io/) that help markdown meet your needs.

The following plugins are included in the default configuration:

### [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs)

This plugin allows you to use attributes in markdown syntax. For example, `![image](image.png){.logo}` will output `image.png`, `alt="image"` and `class="logo"` in the html.

Some examples are available in [Add HTML classes to 11ty markdown content](https://giuliachiola.dev/posts/add-html-classes-to-11ty-markdown-content/).

Extra styles in markdown are explained in detail in the [style section](/documentation/styles/) of this documentation.

### [highlight.js](https://www.npmjs.com/package/highlight.js)

This plugin allows you to highlight the code in a code block according the language. For example, `&#32;```javascript` will output `<pre><code class="language-javascript"></code></pre>` in the html.

The highlights can be themed, using a stand alone css in `src/_assets/public/css/highlightjs.css`. It is a copy of  `atom-one-dark.min.css`. It is imported from `src/layout/includes/head.njk` and you can decide to import it [from a CDN](https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css) if you want. 

Other themes are available. Check the way they look in the [highlight.js example page](https://highlightjs.org/examples) and download them from the CDN or directly from [the highlight.js repository](https://github.com/highlightjs/highlight.js/tree/main/src/styles).

You can also define your own theme following [the guide](https://highlightjs.readthedocs.io/en/latest/theme-guide.html) from highlightjs.

#### accessibility fix 

Code blocks in markdown are styles with a `<code>` nested in a `<pre>`. highlight.js applies the theme with styles on the `<code>` which always receives a `display:block;`. Because of this, when the code in the block overflows, the scrollable region is `<code>` instead of `<pre>` that could catch the focus.

It is important that scrollable region can be focusable to allow users without a mouse to scroll with the keyboard.

It is easy to fix this issue by removing `pre code.hljs{display:block;` in highlightjs.css and adjust the styles to make it look good but it would need to be done each time the them is changed with a new css.

Instead, I chose to make `<code>` focusable by adding the attribute `tabindex="0"`. This is done in `eleventy.js` with `mdLib.renderer.rules.fence`, the markdown-it function that defines the html generated for code blocks.

## Pitfalls

### nunjucks code in Markdown

Markdown may be limited to achieve some of the custom rendering. To solve this you can include some nunjucks code inside markdown. You can read a few examples of this powerful solution in [Custom Markdown Components in 11ty](https://www.aleksandrhovhannisyan.com/blog/custom-markdown-components-in-11ty/).

On the other end, this is not possible to directly add nunjucks code quotes in markdown code blocks. To make this possible, you need to change the template engine from nunjucks to markdown, adding `templateEngineOverride` in the front matter of the page you want to add the nunjucks code. 

```bash
templateEngineOverride: md # for when you have njk in code blocks
```

This is explained in detail in [Eleventy: Escaping Nunjucks Statements in Markdown Code Blocks](https://markllobrera.com/posts/eleventy-escaping-nunjucks-statements-in-markdown-code-blocks/)

Note that this option is not added in the default pages when they are created by the [CMS](/documentation/cms/).

### Images

Markdown is not known to be flexible with styling images, but you find a workaround for most of your wishes. There is an extensive blog post about the matter in [How to Style Images With Markdown](https://dzone.com/articles/how-to-style-images-with-markdown).

### Responsive images

Markdown images are automatically rendered as responsive. A specific chapter on responsive images explains how this 11ty starter manages [responsive images](/documentation/images/).
