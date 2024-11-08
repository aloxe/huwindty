const fs = require("fs");
const path = require("path");
const htmlmin = require("html-minifier-terser");
const tailwind = require('tailwindcss');
const postCss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const mdit = require('markdown-it')
const mditAttrs = require('markdown-it-attrs');
const mditHighlight = require('markdown-it-highlightjs');
const Image = require('@11ty/eleventy-img');

module.exports = async function(eleventyConfig) {

  const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform("htmlmin", htmlminTransform);
  }

  // markdown 
  const mditOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  }
  const mdLib = mdit(mditOptions).use(mditAttrs).use(mditHighlight, { inline: true }).disable('code')
  eleventyConfig.setLibrary('md', mdLib)

  // Passthrough
  eleventyConfig.addPassthroughCopy({ "src/assets": "." });
  eleventyConfig.addPassthroughCopy({ 'src/_assets/public': '/' });
  eleventyConfig.addPassthroughCopy({ 'src/_assets/img': '/img' });
  eleventyConfig.addPassthroughCopy({ 'src/_assets/fonts': '/fonts' });
  
  // Watch targets
  eleventyConfig.addWatchTarget("./src/_assets/css/");

  // process css
  eleventyConfig.addNunjucksAsyncFilter('postcss', postcssFilter);

  // images
  eleventyConfig.addShortcode("Image", async (page, src, alt) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    let inputFolder = page.inputPath.split("/")
    inputFolder.pop()
    inputFolder = inputFolder.join("/");
    const srcImage = inputFolder+"/"+src;

    let outputFolder = page.outputPath.split("/")
    outputFolder.pop()
    outputFolder = outputFolder.join("/");

    let urlPath = page.outputPath.split("/")
    urlPath.pop() // remove page name
    urlPath.pop() // remove output folder
    urlPath.shift() // remove first empty string
    urlPath = "/" + urlPath.join("/");

    let options = {
      widths: [380, 450, 640, 764],
      formats: ["jpeg"],
      urlPath: urlPath,
      outputDir: outputFolder,
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      }
    }

    // generate images
    Image(srcImage, options)

    let imageAttributes = {
      alt,
      sizes: '(max-width: 400px) 380px, (max-width: 470px) 450px, (max-width: 841px) 640px, (max-width: 1100px) 640px, 764px"',
      loading: "lazy",
      decoding: "async",
    }
    // get metadata
    let metadata = Image.statsSync(srcImage, options)    
    return Image.generateHTML(metadata, imageAttributes)
  });


  return {
    dir: {
      input: "src/pages",
      layouts: '../_layouts',
      includes: '../_layouts/includes',
      data: '../_data',
      output: '_site',
    },
    templateFormats: ['md', 'njk', 'jpg', 'gif', 'png', 'html'],
    pathPrefix: process.env.BASE_HREF ? `/${process.env.BASE_HREF}/` : "/" //  used with github pages
  }
};

function htmlminTransform(content, outputPath) {
  if( outputPath.endsWith(".html") ) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
    return minified;
  }
  return content;
}

const postcssFilter = (cssCode, done) => {
  postCss([
    require('postcss-import'),
    tailwind(require('./tailwind.config')),
    autoprefixer(),
    // TODO use purgecss for each layout
    // cssnano({ preset: 'default' })
  ])
    .process(cssCode, {
      // path to our CSS file
      from: './src/_assets/css/styles.css'
    })
    .then(
      (r) => done(null, r.css),
      (e) => done(e, null)
    );
}
