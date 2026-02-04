---
layout: base
title: Navigation
headline: Navigation menu generation and index pages
description: How huwindty manages the navigation menu without dependency
thumbnail: /img/vera.jpg
ismarkdown: true
templateEngineOverride: md
---
## Navigation principles

### 11ty Navigation Plugin
The [11ty Navigation Plugin](https://www.11ty.dev/docs/plugins/navigation/) is a plugin that allows to define and display a navigation menu form pages. It relies on a series of codes added to the [Front Matter](https://www.11ty.dev/docs/data-frontmatter/) of pages, giving eanch page at least a key.

```bash
eleventyNavigation:
  key: Bats
  parent: Mammals
  title: The bats
  order: 2
```

Huwindty doesn't use this plugin.

### Collections

In Eleventy, [collections](https://www.11ty.dev/docs/collections/) allow you to group pages according to tags added in the front matter. By naming different tags, you can group content in an interesting manner. There is also a `collections.all` that lists all pages, even those without tags.

`collections.all` lists all pages in a folder that is identified by an index file with front matter. Empty folders or folders without an index.md or with an empty <span>index.md</span> will not be taken into account.

If you want to exclude a page from the navigation (typically the 404 page and similar), you can exclude it from `collections.all` by adding the following line in the page's front matter:

```js
eleventyExcludeFromCollections: true
```

Huwindty navigation menu is build automatically from `collections.all`.

### Navigation Menu Structure

The navigation utilizes `collections.all` to list all pages. It displays all first-level pages in the main menu, with nested pages organized under their respective submenus. The menu hierarchy mirrors the exact file structure of the collection's pages.

Collections are sorted by file date. The hierarchy of the navigation follows this order, older first and most recent at the bottom. If you want to change the order of the navigation, just add a `date:` within the front matter of each page.
\
You can also reverse the order for the navigation by adding a filter to the collection value setting `{% set allEntries = collections.all | reverse %}`. Doing it in the menu.njk will revert the horizontal menu and doing it renderNavItem.njk will revert the vertical submenus.
{.note}

### Index Pages

Sections appear in the menu as clickable links. Since some of these pages might lack content, you can automatically list the pages within a section by using the `index` layout. Additionally, you can include a title for this list using the `toc` key in the front matter.

```bash
layout: index
title: Documentation
toc: Table of content
```

## How does it work?

The navigation menu can be added to the nunjucks template of your choice by just including `menu.njk`.

```js
{% include "menu.njk" %}
```

### First loop on collections

`menu.njk` will loop on `collections.all` and parse the URL of each entry. 

The first-level entries are the ones with 3 chunks (more if you have a long path). From this point we will use the nunjucks macro `renderNavItem(entry)` to display the entry in the menu. 

If the entry contains nested pages, the macro will handle it by loading itself again (see below).

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

The link to the home page, which has fewer chunks of URL, is hard-coded at the beginning of the navigation. This allows you to shape the link to home the way you want, with the word "home", another word, or even directly by adding your website's logo.

```html
    <li class="relative group">
    <a href="/" {% if entry.url == "/" %} aria-current="page" {% endif %}
      class="block p-4 text-nowrap hover:text-blue-300"
      >ॐ sweet home</a> 
    </li>
```

### Next loop on collections for nested pages

For each entry, `renderNavItem(entry)` will first look if the entry contains nested pages. If it does, it will set them as children.

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
```

### Styling the navigation menu items as needed

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
    absolute left-0 hidden bg-bg text-text shadow-lg group-hover:block
  {% endif %}
{% endmacro %}
```

Second level entries are displayed under their parent entry, in a drop-down menu.

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

## Responsiveness

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

To style an element depending on the pseudo class of the parent, tailwindcss allows the use of the [class `group`](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-the-descendants-of-a-group) that allows many conditions. For example, the following css code:

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
The same `group` class is used for the focus. However, because focus only applies to an anchor without considering the parent elements, we need to use the pseudo-class `:focus-within`.

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

## The index pages

The list of sub pages on `index.md` and `index.html` pages is displayed thanks to the `index.njk` layout. It lists all pages with title and headline. It uses the default style for markdown pages but can be customised the way you want.

```js
  {% for post in collections.all %}
    {% if post.url.startsWith(page.url) %}
      {% if post.url !== page.url %}
        {% if post.url.split("/").length === page.url.split("/").length + 1 %}
        <p>
          <a href="{{ post.url }}">{{ post.data.title }}</a><br>
          <em>{{post.data.headline}}</em>
        </p>
        {% endif %}
      {% endif %}
    {% endif %}
  {% endfor %}
```

## Collections and tags

Huwindty doesn't come with examples of index that spreads on several pages. This is possible thanks to [eleventy build in pagination](https://www.11ty.dev/docs/pagination/nav/).

Tags are not collections and need a little work before they can be paginated. An example of paginated indexes with categories and tags have been implemented using Huwindty and is [documented here](https://alix.guillard.fr/notes/dotclear-to-eleventy/page-navigation/).

## What next?

You may want to update the styles directly in both `menu.njk` and `renderNavItem.njk` as well as `index.njk` so that they fit your needs. 

If you do not need such a menu in your website, just remove these files and carry on.

