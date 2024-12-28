---
layout: base
title: Documentation
headline: Huwindty features explained
description: Documentation for all main features of huwindty eleventy starter
tags: eleventy, starter, images, navigation, markdown, css, styles, tailwind, sveltia, cms, github, pipeline
author: aloxe
date: 2024-12-28
subtitle: How Huwindty works and how to install it
ismarkdown: true
---
## Table of content

{% for post in collections.documentation | reverse %}
  {% if post.data.title != 'Documentation' %}
 - [{{post.data.title}}]({{post.url}})  
 *{{post.data.subtitle}}*
  {% endif %}
{% endfor %}
