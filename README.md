# huwindty 🌬️

I wanted to use [Windty](https://github.com/distantcam/windty/) for my next [eleventy](https://www.11ty.dev/) project before I realised I need more than just a single page with [Tailwindcss](https://tailwindcss.com/). So I kept the good work and added more.

## What was added
### Continuous Integration
- Publication to github pages
- Deployment to stand alone server via ssh (manual action)
- Lighthouse checks on key pages for each PR to keep the triple 💯
### Styles
- Tailwind css are processed directly by 11ty
### Navigation
- Navigation menu is directly generated from page structure
### Site output
- Handle markdown with style
- Process images to make them responsive
### Content Managment System
- Installed Decap CMS with content flow
- Possibility to use Sveltia CMS with the same config
### Documentation
- Documentation comes with the package as an example
- Explains how features are developped


## What is still missing
- better SEO metadata
- documentation on the CMS
- maybe a nicer design

## Install
1. Create a new repository from [huwindty’s template](https://github.com/aloxe/huwindty/generate), or [clone huwindty](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) where you want.
2. Install dependencies: `npm install`
3. Start development: `npm start`
4. See your website at http://localhost:8080/
5. To build the release version: `npm run build`
6. When ready, push to GitHub and the action will build and publish your site to [GitHub Pages](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages)
