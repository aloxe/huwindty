---
layout: base
title: Markdown
subtitle: Using Markdown in 11ty
description: How do use Markdown in your 11ty website and how does it work
ismarkdown: true
---
## Markdown

Markdown is a lightweight markup language that allows you to create formatted text using plain text syntax. It is easy to read and write and is often used with 11ty.

Pages using markdown are the same as html pages, they use the same front matter, but the content is written in markdown. The file extension is `.md`.

## Markdown configuration

In this starter, 11ty is parsing markdown with `markdown-it` to generate the html pages. The configuration for `markdown-it` is in `eleventy.js`.

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

## Plugins

`markdown-it` accepts [additional plugins](https://mdit-plugins.github.io/) that help markdown meet your needs.

The following plugins are included in the default configuration:

### [markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs)

  This plugin allows you to use attributes in markdown syntax. For example, `![image](image.png){.logo}` will output `image.png`, `alt="image"` and `class="logo"` in the html.

  Some examples are available in [Add HTML classes to 11ty markdown content](https://giuliachiola.dev/posts/add-html-classes-to-11ty-markdown-content/).

  ### [markdown-it-highlight](https://www.npmjs.com/package/markdown-it-highlight)

    This plugin allows you to highlight code in markdown syntax. For example, ` ```javascript` will output `<pre><code class="language-javascript"></code></pre>` in the html.

  The highlights use a theme which is added in a css in the `src/_assets/public/css/highlightjs.css`

  Other themes are available in the [highlight.js example page](https://highlightjs.org/examples)

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

Markdown images are automatically redered as responsive. A specific chapter on responsive images explains how this 11ty starter manages [responsive images](/documentation/images/).
