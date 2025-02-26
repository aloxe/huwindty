---
layout: base
title: Navigation
headline: Documentation about navigation.
description: How huwindty manages the navigation menu without dependency
thumbnail: /img/vera.jpg
ismarkdown: true
templateEngineOverride: md
---
## Navigation principles

The main navigation menu is not done using the [11ty Navigation Plugin](https://www.11ty.dev/docs/plugins/navigation/) This allows to display a navigation menu that directly reflects the organisation of pages without having to add a `key` or any information in the [Front Matter](https://www.11ty.dev/docs/data-frontmatter/).

This navigation will instead look in `and list all pages. It will show all first level pages in the main menu and all nested pages under each sub menu and so on. 

`collections.all` lists all pages in a folder that is identified by an index.md with a trontmatter. Empty folders or folders without index.md or empty index.md will not be taken into account.

If you want to exclude a page from the navigation (typically the 404 page and similar), you can just exclude it from the `collections.all` by adding the following line in the page's Front Matter:

```
eleventyExcludeFromCollections: true
```

## How does it work?

The navigation menu can be added to the nunjunk template of your choice by just including `menu.njk`.

```js
{% include "menu.njk" %}
```

### First loop on collections

`menu.njk` will loop on `collections.all` and parse the url of each entry. 

The first level entries are the ones wih 3 chuncks (more if you has a long path). From this point we will use the macro `renderNavItem(entry)` to display the entry in the menu. 

If the entry contains nested pages, the macro will handle it by loading itself again (see bellow).

```js
  {% set allEntries = collections.all %}
  <ul role="list" class="flex">
    {%- for entry in allEntries %}
      {% if entry.url.split("/").length === 3 %}
        {{ renderNavItem(entry) }}
      {% endif %}
    {% endfor %}
  </ul>
```

The link to the home page which has fewer chucks of url is hard coded at the beginning of the navigation. This allows you to shape the link to home the way you want, with the word home, another name or even directly by adding your website's logo.

```html
    <li class="relative group">
    <a href="/" {% if entry.url == "/" %} aria-current="page" {% endif %}
      class="block p-4 text-nowrap hover:text-blue-300"
      >ॐ sweet home</a> 
    </li>
```

### Next loops on collections for nested pages

For each entry `renderNavItem(entry)` will first look if the entry contains nested pages. If it does, it will set them as children.

```js
  {% for menuEntry in Allentries %}
    {% if menuEntry.url.split("/").length === level + 1 %}
      {%  if menuEntry.url.split("/")[level-2] === entry.url.split("/")[level-2] %}
        {% set children = (children.push(menuEntry), children) %}
      {% endif %}
    {% endif %}
  {% endfor %}
```

If the entry has children it will contain a sub list where all entries will be handled, including their possible subsets, by calling the macro again.

```html
  {% if children.length %}
    <li>
      <div>
        <a href="{{ entry.url }}">{{ entry.data.title }}</a>
        <ul role="list">
          {%- for child in children %}{{ renderNavItem(child) }}{% endfor -%}
        </ul>
      </div>
    </li>
```

Entries without children will be displayed normally.

```html
  {% else %}
    <li class="relative group">
      <a href="{{ entry.url }}">{{ entry.data.title }}</a> 
    </li>
  {% endif %}

### Styling the navigation menu items as needed
```

Since the navigation menu is a list with possible sublists, it is rendered on the page the way lists are styled. The styled are applied using tailwind according to their level. They are added to the list loop using smaller macros `aClass` and `ulClass`.

First level entries are styled with a different colour

```js
  {% if entry.url.split("/").length === 3 %}
    block p-4 text-nowrap hover:text-blue-300
  {% endif %}
```

and their sub-blocks display on `hover`

```js
{% macro ulClass(entry) %}
  {% if entry.url.split("/").length === 3 %}
    absolute left-0 hidden bg-white text-black shadow-lg group-hover:block
  {% endif %}
{% endmacro %}
```

Second level entries are displayed under their parent entry in a drop-down menu.

```js
  {% if entry.url.split("/").length === 4 %}
    block p-4 text-nowrap hover:underline
  {% endif %}
```

We also add a negative margin in case this section has children. These children will show closer to their parent so that the user can identify clearly each section.
```js
  block p-4 text-nowrap hover:underline {% if children.length %}-mb-4{% endif %}
```

The following entries will display in the same drop-down block with only smaller font and additional padding.

```js
  {% if entry.url.split("/").length >= 5 %}
    block px-4 py-0 text-sm text-nowrap hover:underline
  {% endif %}
```

## Responsivness

On smaller screens the menu is hidden behind a hamburger icon that will toggle on and off the navigation menu without using javascript.

```html
    <input id="hamburger" type="checkbox" name="hamburger" class="md:hidden sr-only peer" unchecked />
    <label for="hamburger" class="after:content-['≡'] peer-checked:after:content-['✕'] md:hidden cursor-pointer">
      <span class="sr-only">Menu</span>
    </label>
```

The hamburger is not displayed on larger screens thanks to `md:hidden` but it will be focusable and "visible" to screen readers thanks to `sr-only`.

What displays on the screen is the after content that depends on if the checkbox is checked (`peer-checked:after:content-['✕']`) or not (`after:content-['≡']`).


```html
  <ul role="list" class="mt-12 md:mt-0 md:flex hidden peer-checked:block">
```

## Accessibility

Because the label of the hamburger is not visible on screen, it is necessary to add `aria-label="menu"` to the checkbox input.

Additionaly, there is an aria attribute on the menu entry of the current page.

```js
{% if entry.url == page.url %} aria-current="page"{% endif %}
```
Finally we want each menu entry to be focussable even when it doesn't display on the screen. For this we need to do two things: first display the submenus also when the entry menu is focussed, and second to make sure the submenu remains on display when any item is focused. This is the same logic as the `:hover` pseudo class but with `:focus`.

To style an element depending on the pseudo class of the parent, tailwindcss allows the use of the [class `group`](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-the-descendants-of-a-group) that allows many conditions. For example the css code for
```css
  li:hover ul { display: block; }
```
can be generated with the following tailwindcss classes:

```html
<li class="group">
  <a href="/link">Link</a>
  <ul class="hidden group-hover:block">
    <li>
      <a href="sublink">sublink</a>
    </li>
  </ul>
</li>

```
The same `group` class is used for the focus, but because focus only applies on a anchor without looking at the parent elements, we need to use the pseudo class `:focus-within`.

```html
<li class="group">
  <a href="/link">Link</a>
  <ul class="hidden group-hover:block group-focus-within:block">
    <li>
      <a href="sublink">sublink</a>
    </li>
  </ul>
</li>

```

Thanks to this we have a nice menu that can be browsed naturaly using tabindex. No entry can be mised even when using a touchscreen or a screen reader. 

## What next?

You may want to update the styles directly in both `menu.njk` and `renderNavItem.njk` so that it fits your needs. 

If you don't need such menu in your website, just remove these two files and carry on.
