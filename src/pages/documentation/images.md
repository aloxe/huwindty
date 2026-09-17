---
layout: base
title: Images
headline: Edit and manage images
description: How do responsive images work in Huwindty
tags: ''
author: ''
date: 2025-01-04
thumbnail: boat.jpg
isMarkdown: true
templateEngineOverride: md
---
## Image location

With the Huwindty starter, images are stored within the content (after all, images are content too). They can be added in any folder and their URL will always be relative to the `pages` folder, which is the root folder for content.

### Example image

![drooderfiets and yellow boat](/documentation/boat.jpg)

For example, the image above (`boat.jpg`) is located in the `/src/pages/documentation/` folder and is used by a page in the same folder. The URL used to display it on the page will be `/documentation/boat.jpg`. Always use an absolute URL for the image source (starting with a `/`).

## Responsive images

Web pages can be displayed on any screen, from a small phone to a large high-definition, expensive monitor. Displaying a 3000px-wide HD image on a phone is a waste of resources that slows down page rendering. Conversely, showing a 150px picture on a wide monitor might miss some details. Making images responsive is how you provide the appropriate picture to each screen.

The article [Responsive images 101](https://cloudfour.com/thinks/responsive-images-101-definitions/) covers everything you need to know about this topic when managing a website.

## Default choice

The eleventy config provides a way to generate responsive images and store them in the correct location, as well as generating the correct responsive code to use them (see `.eleventy.js`). In Huwindty, image sizes and formats are set using the following default settings and can be adjusted according to your layout and needs by changing the `Images` enum at the beginning of `.eleventy.js`:

```js
const Images = {
  WIDTHS: [426, 460, 580, 768, 1200], // sizes of generated images
  FORMATS: ['webp', 'jpeg'], // formats of generated images
  SIZES: '(max-width: 1200px) 70vw, 1200px' // size of image rendered
}
```

Markdown pages are parsed with `mdLib` and images are handled with the `mdLib.renderer.rules.image` rule. Then the `eleventyImageTransformPlugin` plugin takes care of rendering the responsive code as defined using `eleventy-img`.

It is even simpler in HTML pages, as the `eleventyImageTransformPlugin` plugin takes all images in the code to make them responsive. Even images in the layout files are handled.

It is also possible to use the shortcode defined in `eleventyConfig.addShortcode("Picture"…`. This method allows you to define several options to display the image. Only the `alt` attribute is compulsory, but you can also override the default width and formats of your image to fit the specific design of your HTML page.

## Responsive picture shortcode

To get a step-by-step understanding of how the eleventy-img plugin is used to create a shortcode that generates the images and provides the correct code, you can read [How to optimize images on eleventy (11ty)](https://dev.to/22mahmoud/how-to-optimize-and-lazyload-images-on-eleventy-11ty-206h), which has been freely adapted for Huwindty. You may want to add lazy loading and the blurry effect if you wish.

An example is available on the Huwindty home page

```html
    {% Picture page, "vera-davidova.jpg", "Photos of high grass dancing in the wind at the golden hour", undefined, undefined, undefined, undefined %}
    <!-- 
    Picture attributes: 
    page, file name, alt text, class, widths, formats, sizes 
    -->
```

The attributes are as follows:

- **page** provides the current path to generate the correct output path. Simply use `page` after `Picture`, and it will be fine.
- **file name**: In this example, there is no path to the image file since it is in the same folder.
- **alt text** is compulsory for various reasons. I also encourage you to write nice descriptive text that really helps visually impaired users understand your image.
- **class** adds a CSS class to the image so you can change its position and dimensions. The specific class `lazy` will also make the image lazy-load.
- **widths** will override the default widths for which the output images will be generated. This is particularly useful if you change the image size using a CSS class; you will want to generate images of the same size.
- **formats** will override the default formats.
- **sizes** will override the default sizes to tell the browser how large the image will be before it is fully downloaded. The default is 100vw, but if you know your image will be displayed on half of the page, you may want to change this to 50vw.

## Responsive Images in Markdown

For Markdown, we implemented what is explained in [Responsive Images in Markdown with Eleventy Image](https://tomichen.com/blog/posts/20220416-responsive-images-in-markdown-with-eleventy-image/), a nice step-by-step blog post explaining how to use markdown-it to parse normal image code in Markdown to generate responsive image HTML code using eleventy-img.

The image below is generated with the simple code

```markdown
![drooderfiets and red circus](/documentation/circus.jpg){.lazy}
```

![drooderfiets and red circus](/documentation/circus.jpg){.lazy}

When you inspect the generated code, you see following responsive HTML:

```html
<picture>
    <source type="image/webp" srcset="/documentation/images/circus-350w.webp 350w, /documentation/images/circus-700w.webp 700w, /documentation/images/circus-750w.webp 750w, /documentation/images/circus-1200w.webp 1200w, /documentation/images/circus-1500w.webp 1500w, /documentation/images/circus-2000w.webp 2000w" sizes="(max-width: 400px) 380px, (max-width: 470px) 450px, (max-width: 841px) 640px, (max-width: 1100px) 640px, 764px">
    <img alt="drooderfiets and red circus" class="lazy" loading="lazy" decoding="async" title="" src="/documentation/images/circus-350w.jpeg" width="2000" height="1500" srcset="/documentation/images/circus-350w.jpeg 350w, /documentation/images/circus-700w.jpeg 700w, /documentation/images/circus-750w.jpeg 750w, /documentation/images/circus-1200w.jpeg 1200w, /documentation/images/circus-1500w.jpeg 1500w, /documentation/images/circus-2000w.jpeg 2000w" sizes="(max-width: 400px) 380px, (max-width: 470px) 450px, (max-width: 841px) 640px, (max-width: 1100px) 640px, 764px">
</picture>
```

## Lazy loading

Lazy loading images defers their loading on the page until they are actually needed, instead of loading these resources as soon as the page loads. This improves initial page load performance and enhances the user experience.

It is not recommended to lazy-load images that are visible on screen when the page loads (above the fold), but it is possible to defer images that are lower down the page. They will then be loaded as the user scrolls down.

Because of this, not all images can be lazy-loaded by default. Instead, content editors can intentionally request lazy loading by adding `"lazy"` as a CSS class. The responsive image script will add `loading="lazy"` to the output code.

The markdown example above shows how to add this class to an image in Markdown.

## Non-responsive images and layout

As mentioned earlier, images in layout files such as `head.njk` are also handled and made responsive. Huwindty does not have images in its layout, but you can add images to them that will be displayed on all pages using the layout file. These images will also be automatically responsive.

If you want an image that keeps its width and format regardless of screen size, you will have to add the attribute `eleventy:ignore`. Eleventy will then bypass this tag and `eleventyImageTransformPlugin` will not make it responsive. This is quite useful for top-left logos, profile avatars or small icons.

## Images in CMS

This starter comes with the simple [Svetlia CMS](../cms/) that allows you to add, remove and update pages and media. Images in Svetlia CMS can be added in two ways:

- in a dedicated media folder
 _(All images are available for all pages)_
- in the folder of the current page  
 _(Images are not reusable in other pages)_

Because the CMS uses Markdown and that images in Markdown are automaticaly converted in responsive pictures, there is nothing else to do other than choose well your images, organise them, and never forget the alt text.

## Thumbnail

The thumbnail of a page is defined in the front matter. For example the current page has:

```js
thumbnail: boat.jpg
```

This image is shown in the list of pages in the CMS interface, to help you netter spot the content you want to edit.

It is also used as the metadata image of the page. This is for example, the image that will be visible in the snipet when you share the url of a page on social medias.
