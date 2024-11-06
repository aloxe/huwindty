# huwindty 🌬️

I wanted to use [Windty](https://github.com/distantcam/windty/) for my next [eleventy](https://www.11ty.dev/) project before I realised I need more than just a single page with [Tailwindcss](https://tailwindcss.com/). So I kept the good work and am adding more.

## What has been added
- CI to deploy via FTP to any server
- Tailwind css are processed directly by 11ty
- adding navigation menu generated from pages
- Handle markdown with style

## What I plan to add
- responsive image processor
- better SEO metadata
- decap CMS
- in depth doc so I don't get lost when I get back here in 2 years

## How to use
1. [windty’s template](https://github.com/distantcam/windty/generate), or [clone this one](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
2. Install dependencies: `npm install`
3. Start development: `npm start`
4. See your website at http://localhost:8080/
5. To build the release version: `npm run build`
6. When ready, push to GitHub and the action will build and publish your site to [GitHub Pages](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages)
