---
title: documentation
subtitle: Documentation for Huwindty
description: Documentation for Huwindty.
layout: base.njk
ismarkdown: true
---
## Table of content
{% for post in collections.documentation %}
{% if post.data.title != 'documentation' %}
- [{{post.data.title}}]({{post.url}})
{{post.data.description}}
{% endif %}
{% endfor %}



## wind 🌬️

{% Picture page, "vera.jpg", "Wind is playing with the grass and they are dancing and enjoying the magical moment in their lives. Tinos, Greece", undefined, undefined, undefined, "(max-width: 1200px) 40vw, 1200px" %}
