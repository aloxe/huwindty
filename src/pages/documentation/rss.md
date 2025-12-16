---
layout: base
title: RSS Feed
headline: Syndicate your content
description: Huwindty comes with a ready made RSS feed
tags: ''
author: ''
date: 2025-10-15
thumbnail: /img/animals/heron.jpg
ismarkdown: true
templateEngineOverride: md
---
## RSS

Making the content from one website available to others is called syndication. There are several standard formats for this, and one of the most common is RSS, which stands for Really Simple Syndication. There are also other formats like Atom, which is widely used.

## 11ty RSS Plugin

The [11ty RSS Plugin](https://www.11ty.dev/docs/plugins/rss/) is a plugin that provides a range of utilities that are useful for generating an RSS or Atom feed using the Nunjucks templating syntax.

Huwindty comes with the RSS plugin and a feed layout that generates an Atom feed at the root of your site. On this demo site, it is available at [aloxe.codeberg.page/huwindty/feed.xml](https://aloxe.codeberg.page/huwindty/feed.xml).

## How does it work?

The installation of this feed follows the 11ty documentation and uses the Nunjucks layout `feed.njk` to shape the feed as desired:

```js
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:base="{{ meta.url }}">
  <title>{{ meta.title }}</title>
  <description>{{ meta.description }}</description>
  <image>
    <url>{{ meta.url }}{{ meta.image }}</url>
    <title>{{ meta.title }}</title>
    <link>{{ meta.url }}</link>
  </image>
  <link href="{{ meta.url }}{{ permalink }}" rel="self"/>
  <link href="{{ meta.url }}"/>
  <updated>{{ collections.documentation | getNewestCollectionItemDate | dateToRfc3339 }}</updated>
  <id>{{ meta.url }}</id>
  <author>
    <name>{{ meta.author.name }}</name>
  </author>

{%- for post in collections.documentation | reverse %}
  {%- set absolutePostUrl =  meta.url+post.url %}
  <entry>
    <title>{{ post.data.title }}</title>
    <link href="{{ absolutePostUrl }}"/>
    <updated>{{ post.date | dateToRfc3339 }}</updated>
    <id>{{ absolutePostUrl }}</id>
      <content xml:lang="{{ meta.language }}" type="html">{{ post.templateContent | renderTransforms(post.data.page, meta.url) }}</content>
  </entry>
{%- endfor %}

</feed>
```

### Define your site's metadata

You see that the code above used metadata that defines your site. It is set in the data folder under `_data/meta.json`.

```json
{
  "title": "Huwindty 🌬️",
  "url": "https://aloxe.codeberg.page/huwindty",
  "description": "Huwindty enhanced template using 11ty.",
  "language": "en",
  "image": "/img/logo192.png",
  "author": {
    "name": "Alix Guillard",
    "fediverse": "@aloxe@mast.eu.org"
  },
"media_folder": "src/static/img",
"public_folder": "/img"
}
```

### Choose which pages will populate your feed

The feed is using a collection. You can use the `collection.all` to include all pages to your feed but you may also like to share your blog posts or a specific area of your site. In this case you need to create the specific collection.

#### Create collection with tags

As the [11ty collection page](https://www.11ty.dev/docs/collections/) states, you can create a collection of pages by adding a `tags` key in the front matter of the chosen pages. They will then be part of the collection with the same name as your tags.

```bash
tags: post
```

#### Create collection with the API

You can also create the collection programatically by using the [collection API](https://www.11ty.dev/docs/collections-api/) and setting it in your eleventyConfig. As an explample, the default Huwindty feed gathers documentation pages that are defined in `eleventy.js` from the path to the documentation folder.

```js
// Collections 
eleventyConfig.addCollection("documentation", function (collection) {
  return collection.getFilteredByGlob("./src/pages/documentation/**/*.md");
});
```

The collection API documentation shows various examples of generating a collection.

### The date

The feed is loading pages in reverse order with the most recent page on top. You want to make sure you know on which date is your page last updated by adding a `date` key in the page's front matter. Otherewise eleventy will use the file date which may not be handy. 

You can use [different date format](https://www.11ty.dev/docs/dates/) but I recommand using a simple `YYYY-MM-DD` everywhere. The date is then converted to a format accepted by RSS readers thanks to the `dateToRfc3339` nunjuncks filter.

If you update a post and change the `date` in the front matter, the feed will be updated accordingly and the post will rise up in your feed.{.note}
