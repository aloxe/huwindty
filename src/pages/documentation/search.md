---
layout: base
title: Search
headline: Makes your pages findable
description: How to install and use Pagefind to search pages throughout your site
thumbnail: /img/vera.jpg
ismarkdown: true
---
## Pagefind

Pagefind is a search tool that can run on static sites like eleventy. [It claims to perform well on large sites](https://pagefind.app/), but its main interest is to not rely on any external service or infrastructure and use very small bandwidth. This makes it a good choice for smaller sites too.

This choice was guided from [a post from Mike Fallows](https://mikefallows.com/posts/adding-search-to-eleventy-site/) going for this option after having checked solutions like Algolia (relying on an external service) and [adding Lunr to an Eleventy site](https://www.raymondcamden.com/2019/10/20/adding-search-to-your-eleventy-static-site-with-lunr) which is simpler, works well, but uses much more bandwidth.

## How Pagefind was added to huwindty

### HTML only search form

The first thing was to build a fallback search form for users without javascript. This is not a bad idea to think about such users on a static site. This search form, following an example from Zack Leatherman on his [pagefind-search web component](https://www.zachleat.com/web/pagefind-search/) is sending requests to DuckDuckGo with instruction to only show results from a certain domain (your site's domain).

In this case search requests are sent to DuckDuckGo but you can use any other search engine of your choice.

```html
<div class="transition absolute right-0 p-2 translate-y-0 mr-10"> 
	<form action="https://duckduckgo.com/" id="duckduckgo" method="post" class="group/search min-h-2.5"><!-- min-height to reduce CLS -->
		<label>
			<span class="md:invisible group-focus-within/search:invisible align-bottom"><span class="sr-only">Search for:</span> 🔎 </span>
			<input placeholder="Search" type="search" id="search" name="q" autocomplete="off" class="
      w-0 !p-0 md:w-20 md:!p-2 group-focus-within/search:!p-2 duration-300 ease-in-out bg-note-bg rounded-xl mr-1 group-focus-within/search:max-w-[calc(80vw-50px)] group-focus-within/search:w-150 group-focus-within/search:mt-20"
      />
		</label>
		<input type="hidden" name="sites" value="{{meta.url}}" />
		<button type="submit" class="duration-300 ease-in-out rounded-3xl p-2 invisible group-focus-within/search:mt-20 group-focus-within/search:inline-block w-0 group-focus-within/search:visible group-focus-within/search:w-10 group-focus-within/search:bg-note-bg
    ">
    <span class="sr-only">Search</span> 🔎 </button>
	</form>
</div>
```
In that form, the input that helps the search engine only for your site is the hidden "sites" input. The value of your public site's URL is coming from the `meta.json` data file so that the search result page will only show links to that domain. Make sure this url is the right one.

You'll also note the label and submit button with `"sr-only"` class that make them available on screen readers only when on the screen users will see the magnifying glass.

### Pagefind block

After the fallback, the main Pagefind search needs to be added. This is done by adding a simple piece of code as explained on [Pagefind documentation](https://pagefind.app/docs/ui-usage/). Pagefind comes with a css file, but this was not added as we want to use our own styles.

```html
  <div id="searchdiv" class="search"></div>

  <script src="/pagefind/pagefind-ui.js" defer onload="
    new PagefindUI({ element: '#searchdiv', showImages: false });
    // (…)
  "></script>
```

### Pagefind index generation

The next step is to make sure that pagefind generates its index, right after eleventy generated the static pages. This is done by adding the pagefind command at the end of the `eleventy.js` config file.

```js
const { execSync } = require('child_process')
// (…)

  // pagefind search
  eleventyConfig.on('eleventy.after', () => {
    execSync(`npx pagefind --source _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
  })
```
<!-- install
https://rknight.me/blog/using-pagefind-with-eleventy-for-search/ -->

You may want to restrict the indexed pages by slightly editing the `\"**/*.html\"` glob.


### Select useful content

For each page, you typically want to avoid indexing header, menu and footer. In fact 

It is also necessary to tell pagefind where is the useful content of the pages by adding the attribute `data-pagefind-body` in the layout for the sections that contain content. Typically, we avoid to index the content of headers, footers and menus.

```html
<article data-pagefind-body>
```

On Huwindty, the attribute `data-pagefind-body` was added to the article part of the home page, index page and the default layout. It doesn't include the header with its title and headline, but you can add it yourself if this makes sense to you. 

### How pagefind search works

Once you've done all this and you generate the eleventy site, it will also generate the `pagefind` folder that contains all search scripts and indexed data.

<!-- demo on video https://www.youtube.com/watch?v=74lsEXqRQys -->

All pages also contain the `<div id="searchdiv" class="search"></div>` block that was added in the layout. This block contains the search field and will also contain the list of search results, right under the search input, when users perform a search. 

When search result display, it shows in the current page and the page content hides to avoid confusion. All this is presented thanks to the additional styling explained bellow.

### Pagefind styling

The css styling for pagefind elements is added right before the searchdiv block.

```css
  .pagefind-ui__message {
    font-weight: bold;
  }
  .pagefind-ui__results {
    list-style-type: none;
  }
  .pagefind-ui__result-title {
    margin: 20px 0 10px;
  }
  .pagefind-ui__result-excerpt {
    margin: 5px 0 20px;
  }
```
But you will notice that there are not many css selectors, this is because most of the styles are managed in javascript that is loaded while the main pagefind library is loaded (see `search.njk` for details).

```html
<script src="/pagefind/pagefind-ui.js" defer onload="
```

First, this script hides the fallback form with javascript as this is meant to display on html only browsers where pagefind will not render.

```js
  document.getElementById('duckduckgo').classList = 'hidden';
```
Then the styles of the "duckduckgo" static form is more or less transferred to the "pagefind" form. This allows to display the fields the same way, on the top right corner of the page.

```js
  const pageFindInput = document.getElementsByClassName('pagefind-ui__search-input')[0];
  pageFindInput.classList = searchInput.classList;
```

Pagefind input doesn't come with a label, so it is added with javascript:

```js
  const label = document.createElement('LABEL');
  const labelText = document.createTextNode(' 🔎 ');
  label.appendChild(labelText);
  label.classList.add('md:invisible', 'group-focus-within/search:invisible', 'p-4', 'align-bottom', 'cursor-pointer', 'absolute', 'top-2', 'right-15');
  label.setAttribute('for', 'searchinput');
  pageFindInput.insertAdjacentElement('beforebegin', label);
```

Also, we make sure that the content of the page is removed to leave space to the search results as soon as the user types in the search request.

```js
  pageFindInput.onkeyup = () => {
    const header = document.getElementsByTagName('header')[0];
    const article = document.getElementsByTagName('article')[0];
    const sections = [...document.getElementsByTagName('section')];
    if (pageFindInput.value.length > 0) {
      header.classList.add('hidden');
      article.classList.add('hidden');
      sections.forEach((sections) => { sections.classList.add('hidden'); });
    } else {
      header.classList.remove('hidden');
      article.classList.remove('hidden');
      sections.forEach((sections) => { sections.classList.remove('hidden'); });
    }
  }
```

For the result page, since we don't use the default pagefind styles, the default styles apply. We made sure that the term highlighting and the button were defined in the default (tailwind.css) theme.

```css
  & mark {
    @apply bg-amber-200;
  }
  & button {
    @apply bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-2xl;
  }
```

## Accessibility

Both fallback and pagefind search should be fully accessible. To make it more accessible, search was maintained on top of the [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex).

The Duckduckgo search is placed on top of the page so it is focussed naturally after the "Skip to navigation", "Skip to content" anchor links.

However, the Pagefind search is much lower in the content of the page, so it needs to be brought on top od the tabindex. This is done by adding, within the same script, a "Search this site" link to search content right after the "Skip to content" anchor link.

```js
  const searchThisSite = document.createElement('A');
  const searchThisSiteText = document.createTextNode('Search this site');
  searchThisSite.appendChild(searchThisSiteText);
  searchThisSite.setAttribute('href', '#searchinput');
  searchThisSite.classList.add('transition', 'right-0', 'bg-primary', 'text-bg', 'dark:bg-bg-menu-dark', 'absolute', 'p-3', 'm-2', '-translate-y-16', 'focus:translate-y-12');
  const tabindexNav = document.getElementById('tabindexnav');
  tabindexNav.appendChild(searchThisSite);
```

### Shortcut

I had a discussion with Bob Monsour from [11tybundle](https://11tybundle.dev/) about adding a shortcut to perform this search. While this sounds practical, this [may interfere](https://bobmonsour.com/til/who-knew-that-does-search-in-page-on-firefox/) with some of the browser shortcut. If you want to implement this shortcut, Bob explains [how he did](https://bobmonsour.com/blog/a-keystroke-to-place-focus-in-the-search-box/).
