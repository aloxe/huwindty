---
layout: base.njk
title: Content Managment System
subtitle: Install Sveltia CMS step by step
ismarkdown: true
---
## Sveltia CMS

[Sveltia CMS](https://github.com/sveltia/sveltia-cms) is a content management system (CMS) designed to provide a user-friendly interface to manage content for static site generators. It is firstly created to be hosted by Netifly. It offers a clean interface to create and edit pages that are still saved with git.

Sveltia CMS is a complete reboot of **Netlify CMS** whose development was discontinued in 2022. It shares the same features as [Decap CMS](https://decapcms.org/),  a fork of Netlify CMS. For this reason, it is possible to follow the documentation of the later while using Svelte CMS.

Sveltia CMS is a [single-page app](https://github.com/decaporg/decap-cms?tab=readme-ov-file) that is pulled in the /admin part of this starter kit. Nevertheless, you will need to go through a few steps before you can take advantage of it.

### Create OAuth Application

Go to the [Github OAuth settings](https://github.com/settings/applications/new) from *Settings* > *Developer Settings* > *OAuth Apps* > *Generate New*.

Fill *Homepage URL* with the url of where you will install your external OAuth client. *Authorization callback URL* will get the same url followed by 'callback' `https://example.com/callback`.

Then hit on the button \[Register application].

On the next step, you will have to create your Client Secret (CLIENT_SECRET) and save it in a secure file. Also save the Client ID (CLIENT_ID).

### Deploy an external OAuth client

In Netify you can set up all you need to deploy and host your site on Netifly and maintain it with Sveltia CMS, but you can also deploy your site elsewhere and also use  your own external OAuth client. Decap documentation has [referenced a list](https://decapcms.org/docs/external-oauth-clients/) of external apps you can install on your server for this.

I chose the [PHP Netlify CMS GitHub Oauth](https://github.com/mcdeck/netlify-cms-oauth-provider-php) that comes with [a blogpost](https://www.van-porten.de/blog/2021/01/netlify-auth-provider/) detailing how you can use it on a small hosting server.

```bash
git clone https://github.com/mcdeck/netlify-cms-oauth-provider-php
cd netlify-cms-oauth-provider-php
composer install
```

You will then have to copy the `.env` file into a new `.env.local` where you will add the CLIENT_ID and CLIENT_SECRET you need from the OAuth Application that you previously created on github:

```
OAUTH_PROVIDER=github
...
OAUTH_CLIENT_ID=CLIENT_ID
OAUTH_CLIENT_SECRET=CLIENT_SECRET
REDIRECT_URI=https://oauth.example.com/callback
ORIGIN=https://host.example.com
```

Do not include any path or trailing slash on `ORIGIN` or it will not redirect.

You will then have to upload everything to your server and make sure you set the document root of your server in the `public` directory. 

The index page of your site should say hello and offer a link to "[Log in with Github](https://auth.xn--4lj4bfp6d.eu.org/auth)".

### Install Sveltia CMS to your static site

In this starter, the CMS is already installed in the `_assets/public/admin`. You will find two files: index.html and config.yml.

* The index.html is the page that will load the CMS application.
* config.yml is the config file. You can update it to set the behaviour of your CMS. Before that, you will need to update the `base_url:` with the path to the cms oauth provider you just published.

```
base_url: https://oauth.example.com # Path to ext auth provider
```

You may also change the `media_folder` where all images and media will be uploaded to. The last part, with the `collections` defines what folders and pages are editable by the CMS as well as the fields that will be available in the CMS. Usually you will set here all variables that are present in the Front Matter of your pages.

Once the CMS installed, you can go to your website admin section. (i.e. <https://aloxe.github.io/huwindty/admin/>), and once you are authenticated with your github account, you can start edit the pages that are in your config file.

### User management with github

In your repository settings on Github, go to settings > collaborators and click on the button \[Add people]. Only people that you added will be able to edit your pages.
