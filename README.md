# huwindty 🌬️

*I wanted to use [Windty](https://github.com/distantcam/windty/) for my next [eleventy](https://www.11ty.dev/) project before I realised I need more than just a single page with [Tailwindcss](https://tailwindcss.com/). So I kept the good work and added more.*

## What was added
### Continuous Integration
- Publication to github pages (on merge)
- Deployment to stand alone server via ssh (manual action)
- Make sure you keep the lighthouse 💯 💯 💯 💯 (check on PR)
### Styles
- Tailwind css are processed directly by 11ty
### Navigation
- The navigation menu is generated from the page structure
### Site output
- Render markdown with styles
- Process images to make them responsive
- reder "SEO" meta tags on all pages
### Content Managment System
- Installed Sveltia and Decap CMS with content flow
- Possibility to use Sveltia CMS with the same config
- Manage meta data and images on a per page basis
### Documentation
- Documentation comes with the starter as an example
- Explains how features are developped

## What is still missing
- dark mode

## Install
1. Create a new repository from [huwindty’s template](https://github.com/aloxe/huwindty/generate), or [clone huwindty](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) where you want.
2. Install dependencies: `npm install`
3. Start development: `npm start`
4. See your website at http://localhost:8080/
5. To build the release version: `npm run build`
6. When ready, push to GitHub and the action will build and publish your site to [GitHub Pages](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages) (needs configuration)
