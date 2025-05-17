---
layout: base
title: Search
headline: Find pages on your 11ty site
description: How to install and use Pagefind to search your 11ty pages
thumbnail: /img/vera.jpg
ismarkdown: true
---
## Pagefind

Pagefind is a search library that can run on static sites like eleventy. [It claims to perform well on large sites](https://pagefind.app/), but its main interest is to not rely on any external service or infrastructure and use very small bandwidth. This makes it a good choice for smaller sites too.

<!-- demo on video https://www.youtube.com/watch?v=74lsEXqRQys -->

This choice was guided from [a post from Mike Fallows](https://mikefallows.com/posts/adding-search-to-eleventy-site/) going for the same option after having checked solutions like Algolia (relying on an external service) and [adding Lunr to an Eleventy site](https://www.raymondcamden.com/2019/10/20/adding-search-to-your-eleventy-static-site-with-lunr) which is simplier and works well, but can use much more bandwith.

## How Pagefind was installed

### HTML only search form

First I build a fallback search field for users without javascript. This is not a bad idea to think about such users on a static site. In that case I followed the example from Zack Leatherman on his [pagefind-search web component](https://www.zachleat.com/web/pagefind-search/).

In that case search requests are sent to DuckDuckGo but any other search engine of your choice can be used.

```html
<div class="transition absolute right-0 p-2 translate-y-0 mr-10"> 
	<form action="https://duckduckgo.com/" id="duckduckgo" method="post" class="group/search min-h-2.5"><!-- min-height to reduce CLS -->
		<label>
			<span class="md:invisible group-focus-within/search:invisible align-bottom"><span class="sr-only">Search for:</span> 🔎 </span>
			<input placeholder="Search" type="search" id="search" name="q" autocomplete="off" class="
      w-0 !p-0 md:w-20 md:!p-2 group-focus-within/search:!p-2 duration-300 ease-in-out bg-note-bg rounded-xl mr-1 group-focus-within/search:max-w-[calc(80vw-50px)] group-focus-within/search:w-150 group-focus-within/search:mt-20"
      />
		</label>
		<input type="hidden" name="sites" value="aloxe.github.io/huwindty/" />
		<button type="submit" class="duration-300 ease-in-out rounded-3xl p-2 invisible group-focus-within/search:mt-20 group-focus-within/search:inline-block w-0 group-focus-within/search:visible group-focus-within/search:w-10 group-focus-within/search:bg-note-bg
    ">
    <span class="sr-only">Search</span> 🔎 </button>
	</form>
</div>
```
In that form, the inpupt that helps the search engine only for your site is the hidden "sites" input. You need to give it the value of your public site's URL so that the search result page will only show links to that domain.

You'll also note the label and submit button with `"sr-only"` class that make them available on screen readers only when on the screen users will see the magnifying glass.

### Pagefind block

After that, I included the simple Pagefind code as explained on [Pagefind documentation](https://pagefind.app/docs/ui-usage/). but without the stylesheet as I want to use my own styles.

```html
  <div id="searchdiv" class="search"></div>

<script src="/_pagefind/pagefind-ui.js" onload="
  new PagefindUI({ element: '#searchdiv', showImages: false });
  // (…)
"></script>
```

Once this done we can make sure that pagefind is generating its index after eleventy generated the static pages. This is done by adding the pagefind command at the end of the `eleventy.js` config file.

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

You may want to restrist the indexed pages by slightly editing the `\"**/*.html\"` blob.

It is also necessary to tell pagefind where is the usefull content of the pages by adding the attribute `data-pagefind-body` in the layout for the sections that contains content. You will typically avoid headers, footers and menus.

```njk
<main class="container w-full lg:max-w-4xl mx-auto px-6 py-4 flex-1 {%if ismarkdown %} mkdn{% endif %}" id="maincontent" data-pagefind-body>
```
Once you've done all this and you generate the eleventy site, you will see a second search field in place of the `<div id="searchdiv" class="search"></div>` block that was added in the layout. When you perform a search, results are also listed inside this block right under the input. 

The search is now available from all pages but we need now to make sure that this tool doesn't populate the content of the pages. This will be done by applying the correct styling to the pagefind generated code.

<!-- maybe: https://chrismcleod.dev/blog/adding-site-search-eleventy-pagefind-web-component/ -->

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
But you will notice that there are not many css selectors, this is because most of the styles are managed in javascript that is loaded while the main pagefind library is loaded.

```html
<script src="/_pagefind/pagefind-ui.js" onload="
```

First, we need to hide the fallback form with javascript as this is meant to display on html only browsers where pagefind will not render.

```js
  document.getElementById('duckduckgo').classList = 'hidden';
```
Then the styles of the "duckduckgo" static form is more or less transfered to the "pagefind" form. This alows to display the fields the same way, in the top right of the page.

```js
  const pageFindInput = document.getElementsByClassName('pagefind-ui__search-input')[0];
  pageFindInput.classList = searchInput.classList;
```

Because pagefind input doesn't come with a label, it is also added with javascript:

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

    if (pageFindInput.value.length > 0) {
      header.classList.add('hidden');
      article.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
      article.classList.remove('hidden');
    }
  }
```

For the result page, since we don't use the default pagefind styles, the default styles apply. We made sure that the term highlighting and the button were defind in the default (tailwind.css) theme.

```css
  & mark {
    @apply bg-amber-200;
  }
  & button {
    @apply bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-2xl;
  }
```






