---
layout: base
title: Documentation
subtitle: How Huwindty works and how to install it
description: Documentation for Huwindty.
ismarkdown: true
---
## Table of content

{% for post in collections.documentation | reverse %}
  {% if post.data.title != 'Documentation' %}
 - [{{post.data.title}}]({{post.url}})  
 *{{post.data.subtitle}}*
  {% endif %}
{% endfor %}
