---
layout: base
title: Search
headline: Makes your pages findable
description: How to install and use Pagefind to search pages throughout your site
thumbnail: /img/vera.jpg
ismarkdown: true
templateEngineOverride: md
---
## Pagefind

Pagefind is a search tool that can run on static sites like eleventy. [It claims to perform well on large sites](https://pagefind.app/), but its main interest is to not rely on any external service or infrastructure and use very small bandwidth. This makes it a good choice for smaller sites too.

This choice was guided from [a post from Mike Fallows](https://mikefallows.com/posts/adding-search-to-eleventy-site/) going for this option after having checked solutions like Algolia (relying on an external service) and [adding Lunr to an Eleventy site](https://www.raymondcamden.com/2019/10/20/adding-search-to-your-eleventy-static-site-with-lunr) which is simpler, works well, but uses much more bandwidth.

## How Pagefind was added to huwindty

### HTML only search form

The first thing was to build a fallback search form for users without javascript. This is not a bad idea to think about such users on a static site. This search form, following an example from Zack Leatherman on his [pagefind-search web component](https://www.zachleat.com/web/pagefind-search/) is sending requests to DuckDuckGo with instruction to only show results from a certain domain (your site's domain).

In this case search requests are sent to DuckDuckGo but you can use any other search engine of your choice.

```html
<div class="transition fixed -right-5 top-0 p-2 translate-y-0 mr-5" id="duckduckgo" > 
  <!-- default form is the fallback when nojs -->
	<form action="https://duckduckgo.com/" method="post" class="group/search min-h-2.5"><!-- min-height to reduce CLS -->
		<label>
			<span class="md:invisible group-focus-within/search:invisible align-bottom cursor-pointer fixed top-6 right-18"><span class="sr-only">Rechercher :</span> 🔎 </span>
			<input placeholder="Recherche" type="search" id="searchinput" name="q" autocomplete="off" class="
      w-0 md:w-35 !p-0 md:!p-2 -mr-6 border-0 border-black md:border-1 bg-white rounded-xl
      fixed top-2 right-10
      delay-100 duration-300 ease-in-out 
      group-focus-within/search:!p-2 group-focus-within/search:max-w-[calc(80vw-50px)] group-focus-within/search:w-150 group-focus-within/search:mt-18" onfocus="loadPagefindUI()"
      />
		</label>
		<input type="hidden" name="sites" value="{{meta.url}}" />
	</form>
</div>
```

In that form, the input that helps the search engine only for your site is the hidden "sites" input. The value of your public site's URL is coming from the `meta.json` data file so that the search result page will only show links to that domain. Make sure this url is the right one.

You'll also note the label and submit button with `"sr-only"` class that make them available on screen readers only when on the screen users will see the magnifying glass.

### Pagefind block

After that, [Pagefind documentation](https://pagefind.app/docs/ui-usage/) suggests to load the pagefind css and javascript files and then to perform some changes after all the page content is loaded.

```html
<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-ui.js"></script>

<div id="search"></div>
<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        new PagefindUI({ element: "#search", showSubResults: true });
    });
</script>

```

To maintain the high performence of page load, I decided on another approach. Css will be added inline just before the html block for search.

```html
<style>
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
</style>

<div id="searchdiv" class="search"></div>
```

Then, the javascript file is loaded only when it is likely to be used, when the user focusses on the search input (by click of by tabulation). This is done with the `onfocus="loadPagefindUI()` that you can see above.

```js
  const loadPagefindUI = () => {
    if (typeof PagefindUI === "undefined") {
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', "{{ meta.url }}/pagefind/pagefind-ui.js");
      script.addEventListener('load', function() {
        initPagefindUI()
      });
      document.body.appendChild(script);
    }
  }
```
When loading the script, you notice an event listener that is loaded once the script is loaded. `initPagefindUI()` is the function that hides the fallback input and copies over its styles to the new pagefind input. 

The src attribute is an absolute URL with `{{ meta.url }}`. If the Huwindty site is right after the domain, `/pagefind/pagefind-ui.js` is sufficient.{.note}

```js
    document.getElementById('duckduckgo').classList = 'hidden';

    const searchInput = document.getElementById('searchinput');
    searchInput.removeAttribute('id');
    const pageFindForm = document.getElementsByClassName('pagefind-ui__form')[0];
    pageFindForm.classList.add('group/search');
    const pageFindInput = document.getElementsByClassName('pagefind-ui__search-input')[0];
    pageFindInput.classList = searchInput.classList;
    pageFindInput.setAttribute('id', 'searchinput');
    pageFindInput.focus();
    document.getElementsByClassName('pagefind-ui__search-clear ')[0].classList = 'hidden';
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

It also performes a few other style modifications depending on the context. For exemple, the main content of the page is hidden to leave space to search results.

```js
    // hide page content if there is a search term
    pageFindInput.onkeyup = () => {
      const hamburger = document.getElementById('hamburger');
      const header = document.getElementsByTagName('header')[0];
      const article = document.getElementsByTagName('article')[0];
      const sections = [...document.getElementsByTagName('section')];
      if (pageFindInput.value.length > 0) {
        hamburger.checked = false;
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

The search form style is handled with the init script.

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

Both fallback and pagefind search should be fully accessible. To make it more accessible, search should be accessible early on the [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex).

Because there may be a long menu before the search form, a shortcut link labeled "Search this site" has been added on the very top of the page.

```html
  <a href="#searchinput" id="searchthissite" class="fixed transition left-4 top-12 bg-secondary text-bg p-3 m-5 -translate-x-72 focus:translate-x-12 z-2">Search this site</a>
```

### Keyboard shortcut

I had a discussion with Bob Monsour from [11tybundle](https://11tybundle.dev/) about adding a shortcut to perform this search. While this sounds practical, this [may interfere](https://bobmonsour.com/til/who-knew-that-does-search-in-page-on-firefox/) with some of the browser shortcut. If you want to implement this shortcut, Bob explains [how he did](https://bobmonsour.com/blog/a-keystroke-to-place-focus-in-the-search-box/).
