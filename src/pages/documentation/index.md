---
layout: base
title: Documentation
headline: How Huwindty works and how to install it
description: Documentation for Huwindty.
tags: ""
author: ""
date: 2024-12-29
thumbnail: /img/vera.jpg
ismarkdown: true
---
## Table of content

{% for post in collections.documentation | reverse %}
  {% if post.data.title != 'Documentation' %}

- [{{post.data.title}}]({{post.url}})  
 _{{post.data.headline}}_
  {% endif %}
{% endfor %}
