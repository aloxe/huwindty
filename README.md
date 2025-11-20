# huwindty 🌬️
**A simple 11ty starter project to create a static site using Eleventy and Sveltia CMS with Tailwind CSS. It handles automatic navigation menus, SEO meta tags, and responsive images.**

## Introduction

*I wanted to use [Windty](https://github.com/distantcam/windty/) for my next [eleventy](https://www.11ty.dev/) project before I realised I need more than just a single page with [Tailwindcss](https://tailwindcss.com/). So I kept the good work and added more.*

## What was added
### Continuous Integration
- Publication to GitHub Pages (on merge)
- Deployment to standalone server via SSH (manual action)
- Make sure you keep the Lighthouse 💯 💯 💯 💯 (check on PR)
### Styles
- Tailwind CSS is processed directly by 11ty
### Navigation
- The navigation menu is generated from the page structure
### Site output
- Render markdown with styles
- Process images to make them responsive
- Render "SEO" meta tags on all pages
### Content Management System
- Installed Sveltia CMS for online editions
- Possibility to use Decap CMS with the same config
- Manage metadata and images on a per-page basis
### Documentation
- [Documentation](https://aloxe.github.io/huwindty/documentation/) comes with the starter as an example
- Explains how features are developed

## What is still missing
- dark mode
- accessibility test

## Installation

### with Codeberg

1. Fork huwindty onto your account. Use links or type `git clone git@codeberg.org/aloxe/huwindty.git`
2. Install dependencies: `npm install`
3. Start development: `npm start`
4. Check your website at http://localhost:8080/
5. Build the release version with `npm run build` and check the result in `_site`.
6. When ready, push your changes to your repo on Codeberg and the action will publish it to Codeberg pages.
7. Sveltia CMS needs [specific configuration](https://aloxe.codeberg.page/huwindty/documentation/cms/) for editor authentication.

### With github
1. Create a new repository from [huwindty’s template](https://github.com/aloxe/huwindty/generate), or [clone huwindty](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) on your account. Use links or type `git clone git@github.com:aloxe/huwindty.git`
2. Install dependencies: `npm install`
3. Start development: `npm start`
4. Check your website at http://localhost:8080/
5. Build the release version with `npm run build` and check the result in `_site`.
6. When ready, push your changes to GitHub and the action will build and publish your site to [GitHub Pages](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages) or the server of your choice via SSH ([needs configuration](https://aloxe.codeberg.page/huwindty/documentation/ci/)).
7. Sveltia CMS needs [specific configuration](https://aloxe.codeberg.page/huwindty/documentation/cms/) for editor authentication.
