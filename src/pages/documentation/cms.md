---
layout: base
title: Content Managment System
headline: Install Sveltia CMS step by step accept new users
description: How do install and use Sveltia CMS as a for your 11ty website
tags: ''
author: ''
date: 2025-08-27
thumbnail: /img/vera.jpg
ismarkdown: true
---
## Sveltia CMS

[Sveltia CMS](https://github.com/sveltia/sveltia-cms) is a content management system (CMS) designed to provide a user-friendly interface to manage content for static site generators. It is firstly created to be hosted by Netifly. It offers a clean and accessible interface to create and edit pages that are still saved as files on the git repository of your project.

Sveltia CMS is a complete reboot of **Netlify CMS** whose development was discontinued in 2022 and then rebranded in 2023 under the name [Decap CMS](https://decapcms.org/). Since Sveltia CMS aims to offer all features of the original CMS, there is alost no difference between the two in terms of feature and configuration. For this reason, it is possible to follow the [Decap CMS documentation](https://decapcms.org/docs/basic-steps/) while using Sveltia CMS.

Sveltia CMS is a single-page app that is pulled from the page you decide to add it too. In this starter it is available in the typical [/admin part the public site](https://aloxe.github.io/huwindty/admin/). Nevertheless, you will need to go through a few steps before you can take advantage of it.

## Authentication

Because new content is saved as files on the git repository of your project. You need to have a user that has access to your git repository. For this you will need to create and OAuth Application and set up your git forge to authenticate. The steps described bellow are using OAuth and github.

### Create OAuth Application on github

Go to the [Github OAuth settings](https://github.com/settings/applications/new) from _Settings_ > _Developer Settings_ > _OAuth Apps_ > _Generate New_.

Fill _Homepage URL_ with the url of where you will install your external OAuth client. _Authorization callback URL_ will get the same url followed by 'callback' `https://example.com/callback`.

Then hit on the button \\[Register application].

On the next step, you will have to create your Client Secret (CLIENT_SECRET) and save it in a secure file. Also save the Client ID (CLIENT_ID).

### Build an external OAuth client on your server

In Netify, you can set up all you need to deploy and host your site. Netifly will manage your authentication and will let you maintain your site with Sveltia CMS.

If you want to deploy your site elsewhere, you will need an external OAuth client. Decap documentation has [referenced a list](https://decapcms.org/docs/external-oauth-clients/) of external apps you can install on your own server. This is the trickiest part of Huwindty as it will stand as a standalone app that your CMS with connect to for authentication purpose.

I chose two apps for this purpose, one is running on node and is served by nginx and the second is a PHP app served by Apache.

#### Run netlify-cms-github-oauth-provider on nginx

[netlify-cms-github-oauth-provider](https://github.com/vencax/netlify-cms-github-oauth-provider) is available on github and can run locally as well as on a server with nginx as a reverse proxy. The README is well details to run the installation.

```
git clone https://github.com/vencax/netlify-cms-github-oauth-provider
cd netlify-cms-github-oauth-provider
npm install
```

The configuration can be set in an .env file but can also be part of the launch command line.

```
NODE_ENV=production
ORIGINS=www.my_organisation.com,www.my_organisation_second.com
OAUTH_CLIENT_ID=f432a9casdff1e4b79c57
OAUTH_CLIENT_SECRET=pampadympapampadympapampadympa
REDIRECT_URL=https://your.server.com/callback
GIT_HOSTNAME=https://github.website.com
PORT=3000
```

Before you run the service, you need to set up the nginx for your oauth domain to act as a reverse proxy.

```
location / {
	proxy_pass http://localhost:3111/;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection Upgrade;
	proxy_set_header Host $host;
}
```

The README also explains how tho set the redirections for `auth` and `callback` in the nginx configuration.

```
 location /auth {
    proxy_pass http://127.0.0.1:3111;
    proxy_pass_request_headers      on;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_set_header Early-Data $ssl_early_data;
}

location /callback {
    proxy_pass http://127.0.0.1:3111;
    proxy_pass_request_headers      on;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_set_header Early-Data $ssl_early_data;
}
```

After you run the service, you should be able to authenticate from your own server.

```
npm start
```

To make sure the service always run on your server, there are a few additional steps that I won't detail here. However you can look at this article that details a solution [with forever and crontab](https://hostingpile.com/tutorials/how-to-host-multiple-node-js-applications-on-a-single-vps-with-nginx-forever-and-crontab/).

#### Run netlify-cms-oauth-provider-php on Apache

I chose the [PHP Netlify CMS GitHub Oauth](https://github.com/mcdeck/netlify-cms-oauth-provider-php) that comes with [a blogpost](https://www.van-porten.de/blog/2021/01/netlify-auth-provider/) explaining in detail how to set it up.

In short, you will have to clone the repo and install the dependencies:

```bash
git clone https://github.com/mcdeck/netlify-cms-oauth-provider-php
cd netlify-cms-oauth-provider-php
composer install
```

You will then have to copy the `.env` file into a new `.env.local` where you will add the CLIENT_ID and CLIENT_SECRET and callback url from the OAuth Application that you previously created on github:

```
OAUTH_PROVIDER=github
...
OAUTH_CLIENT_ID=CLIENT_ID
OAUTH_CLIENT_SECRET=CLIENT_SECRET
REDIRECT_URI=https://oauth.example.com/callback
ORIGIN=https://host.example.com
```

The line with `ORIGIN` is the host url of your site. Do not include any path or trailing slash on `ORIGIN` or the authentication flow will not redirect to your back-office

You will then have to upload everything from `netlify-cms-oauth-provider-php` onto your server. Your server must handle https and php. The root index should point to the `public` folder but all other folders should remain there.

When correctly installed, the index page of your Auth site should say ''Hello'' and offer a link to ''Log in with Github''. The current starter kit has a link to "[My login with Github](https://auth.xn--4lj4bfp6d.eu.org/auth)".

### User management

When you use github as authentication provider, users of your CMS will need an account on github and will use it to identify themselves. In order to access the repo, and be able to edit, they need to be given access to your website repository through _settings_ > _collaborators_. 

All users will be visible from there so users can be managed on [github](https://github.com/aloxe/huwindty/settings/access).

Users can check that they keep access to the repository by editing files. They can also check that the authorisation can access their account. On their profile > _settings_ > \*[applications](https://github.com/settings/applications)\*.

## The back office configuration

The back-office already installed with huwindity. You can find it under `_assets/public/admin`. This folder contains two files: index.html and config.yml.

- The index.html is the page that will load the CMS application.
- config.yml is the config file. You can update it to set the behaviour of your CMS. 

If you prefer to use Decap CMS over Sveltia, simple uncomment the line in index.html, where the decap script is loaded and remove the one for Sveltia.

### Define backend

In the `backend:` section of the config, you will document all details for Svetlia CMS to access and update your git repository.

The name will be the forge system that you use. Currently, Svetlia supports github and gitlab, but the current starter uses github.

```
  name: github # current huwindty has been tested with github only
```

The repo will be the path to the git repository of your huwidty site on the chosen forge.

```
  repo: aloxe/huwindty # Path to your GitHub repository
```

You need to specify the branch where the changes will be committed The branch has to exist on your repository otherwise the CMS will return an error.

If you choose your main branch, all changes that you save in the CMS will be pushed to the main branch and therefore, if [the publication pipeline](https://aloxe.github.io/huwindty/documentation/ci/) is in place, will be directly visible on your site.

Since Svetlia doesn't yet handle content workflow, it is recommended to create a secondary branch for edition that can go through editorial workflow through a pull request.

```
  branch: edit # name of the branch where edits will be pushed
```

The content shown in the back office will be the one from the edition branch. If this branch contains many changes that are not merged into your main branch, the back end might be very different from the public site.{.note}

Finally, before you can start, you will need to update `base_url:` with the url of the CMS Oauth provider you published as explained earlier.

```
base_url: https://oauth.example.com # Path to ext auth provider
```

### Media folders

You may also change the `media_folder` where all images and media will be uploaded to. The last part, with the `collections`, defines what folders and pages are editable by the CMS as well as the fields that will be available in the CMS. Usually you will set here all variables that are present in the Front Matter of your pages.

In the current setup, I used `media_folder: ''` and `public_folder: '/{{dirname}}/{{filename}}'` to allow images to be saved in the same folder as the page.

Once the CMS is installed, you can go to your website admin section. (i.e. <https://aloxe.github.io/huwindty/admin/>), and once you are authenticated with your github account, you can start edit the pages that are in your config file.

### Editable content

The editable content is defined in the `collections:`. It allows you to list which Eleventy page in Eleventy will be editable, describe their properties and define which fields can be modified in the CMS back-officeinterface.

For example, the documentation pages of Huwindty are defined like this:

```
collections:
  - name: "documentation" # Used in routes, e.g., /admin/collections/blog
    label: "Documentation" # Used in the UI
    folder: "src/pages/documentation" # The path to the folder where the documents are stored
    thumbnail: /img/vera.jpg
    columns: [title, date]
```

With media and public folder following the [documentation of Decap CMS](https://decapcms.org/docs/collection-folder/#media-and-public-folder):

```
    media_folder: '' # start with a slash
    public_folder: /documentation
```

Each page of this collection will have a `layout` called "base" and `isMarkdown` set to `true`. These will not appear in the CMS but will be set in the front matter. Then the `title` and `headline` can be modified as a string in the CMS.

```
    create: true # Allow users to create new documents in this collection
    fields: # All the fields for each document, usually in front matter + body
      - label: "Layout"
        name: "layout"
        widget: "hidden"
        default: "base"
        preview: false
      - label: "isMarkdown"
        name: "isMarkdown"
        widget: "hidden"
        default: true
        preview: false
      - label: "Title"
        name: "title"
        widget: "string"
      - label: "headline"
        name: "headline"
        widget: "string"
        required: false
```

## User management with github

In your repository settings on Github, go to settings > collaborators and click on the button \\[Add people]. You will be able to add any github user as collaborator. Only people that you added will be able to edit your pages and you can revoke them at any time by removing them from the list.
