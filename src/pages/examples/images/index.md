---
layout: base
title: Pages with Images
headline: Example pages with several ways to include an image
---

{% for post in collections.images | reverse %}
  {% if post.data.title != 'Pages with Images' %}

- [{{post.data.title}}]({{post.url}})  
 _{{post.data.headline}}_
  {% endif %}
{% endfor %}