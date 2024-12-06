---
title: documentation
subtitle: Documentation for Huwindty
description: Documentation for Huwindty.
layout: base.njk
ismarkdown: true
---

## Table of content

{% for post in collections.documentation | reverse %}
  {% if post.data.title != 'documentation' %}
  - [{{post.data.title}}]({{post.url}})
  {% endif %}
{% endfor %}

## wind 🌬️

![Wind is playing with the grass and they are dancing and enjoying the magical moment in their lives. Tinos, Greece](/documentation/vera.jpg)

