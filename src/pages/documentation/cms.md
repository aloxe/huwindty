---
layout: base
title: Content Managment System
headline: Install Sveltia CMS step by step accept new users
description: How do install and use Sveltia CMS as a for your 11ty website
thumbnail: /img/vera.jpg
ismarkdown: true
---

## Sveltia CMS

[Sveltia CMS](https://github.com/sveltia/sveltia-cms) is a content management system (CMS) designed to provide a user-friendly interface to manage content for static site generators. It is firstly created to be hosted by Netifly. It offers a clean and accessible interface to create and edit pages that are still saved as files on the git repository of your project.

Sveltia CMS is a complete reboot of **Netlify CMS** whose development was discontinued in 2022 and then rebranded in 2023 under the name [Decap CMS](https://decapcms.org/). Since Sveltia CMS aims to offer all features of the original CMS, there is alost no difference between the two in terms of feature and configuration. For this reason, it is possible to follow the [Decap CMS documentation](https://decapcms.org/docs/basic-steps/) while using Sveltia CMS.

Sveltia CMS is a single-page app that is pulled from the page you decide to add it too. In this starter it is available in the typical [/admin part the public site](https://aloxe.github.io/huwindty/admin/). Nevertheless, you will need to go through a few steps before you can take advantage of it.

## Authentication

Because new content is saved as files on the git repository of your project. You need to have a user that has access to your git repository. For this you will need to create and OAuth Application and set up your git forge to authenticate. The steps described bellow are using OAuth and github.

### Create OAuth Application

Go to the [Github OAuth settings](https://github.com/settings/applications/new) from _Settings_ > _Developer Settings_ > _OAuth Apps_ > _Generate New_.

Fill _Homepage URL_ with the url of where you will install your external OAuth client. _Authorization callback URL_ will get the same url followed by 'callback' `https://example.com/callback`.

Then hit on the button \[Register application].

On the next step, you will have to create your Client Secret (CLIENT_SECRET) and save it in a secure file. Also save the Client ID (CLIENT_ID).

### Deploy an external OAuth client on your server

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

The index page of your site should say hello and offer a link to Log in with Github. The current starter kit has a link to "[My login with Github](https://auth.xn--4lj4bfp6d.eu.org/auth)".

## The back office

The backoffice of the CMS is already installed in the admin folder. once authenticated you will be able to access and update content that is defined in the config.

### Install Sveltia CMS to your static site

In this starter, the CMS is already installed in the `_assets/public/admin`. You will find two files: index.html and config.yml.

- The index.html is the page that will load the CMS application.
- config.yml is the config file. You can update it to set the behaviour of your CMS. 

If you prefer to use Decap CMS over Sveltia, simple uncomment the line in index.html, where the decap script is loaded and remove the one for Sveltia.

### Configuration

#### Connect to the authentication provider


#### Define backend
In the `backend:` you will document all details for Svetlia CMS to access and update your git repository.

```
  name: github # current huwindty has been tested with github only
  repo: aloxe/huwindty # Path to your GitHub repository
```
The name will be the forge system that you use. Currently Svetlia supports github and gitlab but the current starter and documentation is focussing on github.

```
  branch: ecrire # name of the branch where content edits will be pushed
```
You need to specify the branch where the changes will be commited. The branch has to exist on your repository otherwise the CMS will return an error.

If you choose to put your main branch, all saving of new content will push a commit that will, if [the CI](https://aloxe.github.io/huwindty/documentation/ci/) is in place, release the changes directly on your site.

Since Svetlia doesn't yet handle content workflow, you may also want to create a secondary branch that will go through your usual merge request where you can review changes.

Note that even if your website is not up to date, the content that will be shown in the back office will be the one from the branch you are editing from, and may not match what is on the public site.

```
base_url: https://oauth.example.com # Path to ext auth provider
```
Before you can start, you will need to update the `base_url:` with the path to the cms oauth provider you published as explained earlier.

#### Media folders

You may also change the `media_folder` where all images and media will be uploaded to. The last part, with the `collections` defines what folders and pages are editable by the CMS as well as the fields that will be available in the CMS. Usually you will set here all variables that are present in the Front Matter of your pages.

In the current setup, I used `media_folder: ''` and `public_folder: '/{{dirname}}/{{filename}}'` to allowimages to be saved in the same folder as the page.

Once the CMS installed, you can go to your website admin section. (i.e. <https://aloxe.github.io/huwindty/admin/>), and once you are authenticated with your github account, you can start edit the pages that are in your config file.

#### Editable content

The editable content is defined in the `collections:`. It allows you to describe which part of the 11ty pages are editable and what are the fields you will be editing or not in the CMS backoffice interface.

### User management with github

In your repository settings on Github, go to settings > collaborators and click on the button \[Add people]. You will be able to add any github user are collaborator. Only people that you added will be able to edit your pages and you can revoque them at any time by removing them from the list.
