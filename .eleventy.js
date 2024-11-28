const fs = require("fs");
const path = require("path");
const pageAssetsPlugin = require('eleventy-plugin-page-assets');
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
  // eleventyConfig.addPassthroughCopy({ 'src/static': '/img' });
  eleventyConfig.addPassthroughCopy({ 'src/_assets/fonts': '/fonts' });
  
  // Watch targets
  eleventyConfig.addWatchTarget("./src/_assets/css/");

  // process css
  eleventyConfig.addNunjucksAsyncFilter('postcss', postcssFilter);

  // images


  // Picture shortcode with <picture>
  eleventyConfig.addShortcode("Picture", async (
    page,
    src,
    alt,
    className = undefined,
    widths = [350, 750, 1200],
    formats = ['jpeg'],
    sizes = '100vw"'
  ) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }
    const srcImage = getSrcImage(page, src);
  
    const options = getImgOptions(page, src, alt, className, widths, formats, sizes);

    const imageMetadata = await Image(srcImage, options);

    const sourceHtmlString = Object.values(imageMetadata)
    // Map each format to the source HTML markup
    .map((images) => {
      // The first entry is representative of all the others
      // since they each have the same shape
      const { sourceType } = images[0];

      // Use our util from earlier to make our lives easier
      const sourceAttributes = stringifyAttributes({
        type: sourceType,
        // srcset needs to be a comma-separated attribute
        srcset: images.map((image) => image.srcset).join(', '),
        sizes,
      });

      // Return one <source> per format
      return `<source ${sourceAttributes}>`;
    })
    .join('\n');

  const getLargestImage = (format) => {
    const images = imageMetadata[format];
    return images[images.length - 1];
  }

  const largestUnoptimizedImg = getLargestImage(formats[0]);
  
  const imgAttributes = stringifyAttributes({
    src: largestUnoptimizedImg.url,
    width: largestUnoptimizedImg.width,
    height: largestUnoptimizedImg.height,
    alt,
    loading: 'lazy',
    decoding: 'async',
  });

  const imgHtmlString = `<img ${imgAttributes}>`;

  const pictureAttributes = stringifyAttributes({
    class: className,
  });
  const picture = `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    ${imgHtmlString}
  </picture>`;

  return `${picture}`;
  });

  // Image shortcode with <img>
  eleventyConfig.addShortcode("Image", async (
    page,
    src,
    alt,
    className = undefined,
    widths = [350, 750, 1200],
    formats = ['jpeg'],
    sizes = '100vw"',
  ) => {
    if (!alt) {
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }
    const srcImage = getSrcImage(page, src);
  
    const options = getImgOptions(page, src, alt, className, widths, formats, sizes);
    const imageMetadata = await Image(srcImage, options);

    const imageAttributes = {
      alt,
      sizes: '(max-width: 400px) 380px, (max-width: 470px) 450px, (max-width: 841px) 640px, (max-width: 1100px) 640px, 764px"',
      loading: "lazy",
      decoding: "async",
    }
    return Image.generateHTML(imageMetadata, imageAttributes)
  });


  // COPY IMAGES LINKED in PAGES
  // this is not regexp but Glob patern (picomatch https://npm.devtool.tech/picomatch)
  // eleventyConfig.addPlugin(pageAssetsPlugin, {
  //   mode: "parse",
  //   postsMatching: "src/pages/*.{md,html}",
  //   recursive: false,
  //   hashAssets: false,
  // });

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
}; // end config

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

/** Maps a config of attribute-value pairs to an HTML string
 * representing those same attribute-value pairs.
 */
const stringifyAttributes = (attributeMap) => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};


  const getSrcImage = (page, src) => {
    let inputFolder = page.inputPath.split("/")
    inputFolder.pop()
    inputFolder = inputFolder.join("/");
    return inputFolder+"/"+src;
  }

  const getImgOptions = (page, src, alt, className, widths, formats, sizes) => {
    let outputFolder = page.outputPath.split("/")
    outputFolder.pop()
    outputFolder = outputFolder.join("/");

    let urlPath = outputFolder.split("/")
    urlPath.pop()
    urlPath.shift()
    urlPath = "/" + urlPath.join("/");

    const options = {
      widths: [...widths, null],
      formats: [...formats, null],
      outputDir: outputFolder,
      urlPath: urlPath,
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      }
    }
    return options;
  }
