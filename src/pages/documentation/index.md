---
layout: base.njk
title: Documentation
headline: Huwindty features explained
description: Documentation for all main features of huwindty eleventy starter
tags: eleventy, starter, images, navigation, markdown, css, styles, tailwind, sveltia, cms, github, pipeline
author: aloxe
date: 12/28/2024
subtitle: How Huwindty works and how to install it
ismarkdown: true
---
## Table of content

{% for post in collections.documentation | reverse %}
  {% if post.data.title != 'documentation' %}

- [{{post.data.title}}]({{post.url}})
  {% endif %}
{% endfor %}

## wind 🌬️

![Wind is playing with the grass and they are dancing and enjoying the magical moment in their lives. Tinos, Greece](/img/vera.jpg)
