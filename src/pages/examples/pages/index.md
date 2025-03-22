---
layout: base
title: Other pages
headline: Some example pages with texts
author: aloxe
date: 2025-03-21
ismarkdown: true
thumbnail: /img/vera.jpg
---

{% Picture page, "../../../static/img/vera.jpg", "Wind is playing with the grass and they are dancing and enjoying the magical moment in their lives. Tinos, Greece", "object-cover border border-red-100", undefined, undefined, undefined %}
<!-- 
Picture attributes: 
page, file name, alt text, class, widths, formats, sizes 
    -->

## What you'll find in this section?

{% for post in collections.pages | reverse %}
  {% if post.data.title != 'Other pages' %}

- [{{post.data.title}}]({{post.url}})  
 _{{post.data.headline}}_
  {% endif %}
{% endfor %}