---
layout: base
title: Images
subtitle: Edit and manage images
ismarkdown: true
---

## Responsive images

Web pages can display on a small phone screen of to a large high definition monitor. Displaying a 3000px wide image on a phone is a waste of ressources that slows down display and showning a 150px picture on a wide monitor might miss some details. Making images responsive is the way to provide the apripriate picture to each screen.
The article [Responsive images 101](https://cloudfour.com/thinks/responsive-images-101-definitions/) covers everything you need to know about this topic when managing a web site.

## Choice of this template

### example image
![drooderfiets and yellow boat](/documentation/boat.jpg)

## From HTML pages

## From Markdown

For Markdown, we implemented what is explained in [Responsive Images in Markdown with Eleventy Image](https://tomichen.com/blog/posts/20220416-responsive-images-in-markdown-with-eleventy-image/), a nice step by step blog post explaining how to use mardown-it to parse normal image code in markdown to generate the responsive image HTML code thanks to eleventy-img.

The image bellow is generated with the simple code
```markdown
![drooderfiets and red circus](/documentation/circus.jpg){.lazy}
```
![drooderfiets and red circus](/documentation/circus.jpg){.lazy}

When you inspect the code, you see that the generated code is the following:

```html
<picture>
    <source type="image/webp" srcset="/documentation/images/circus-350w.webp 350w, /documentation/images/circus-700w.webp 700w, /documentation/images/circus-750w.webp 750w, /documentation/images/circus-1200w.webp 1200w, /documentation/images/circus-1500w.webp 1500w, /documentation/images/circus-2000w.webp 2000w" sizes="(max-width: 400px) 380px, (max-width: 470px) 450px, (max-width: 841px) 640px, (max-width: 1100px) 640px, 764px">
    <img alt="drooderfiets and red circus" class="lazy" loading="lazy" decoding="async" title="" src="/documentation/images/circus-350w.jpeg" width="2000" height="1500" srcset="/documentation/images/circus-350w.jpeg 350w, /documentation/images/circus-700w.jpeg 700w, /documentation/images/circus-750w.jpeg 750w, /documentation/images/circus-1200w.jpeg 1200w, /documentation/images/circus-1500w.jpeg 1500w, /documentation/images/circus-2000w.jpeg 2000w" sizes="(max-width: 400px) 380px, (max-width: 470px) 450px, (max-width: 841px) 640px, (max-width: 1100px) 640px, 764px">
</picture>
```


