---
layout: base
title: Documentation
headline: How Huwindty works and how to install it
description: Documentation for Huwindty.
ismarkdown: true
---
## Table of content

{% for post in collections.documentation | reverse %}
  {% if post.data.title != 'Documentation' %}
 - [{{post.data.title}}]({{post.url}})  
 *{{post.data.headline}}*
  {% endif %}
{% endfor %}
