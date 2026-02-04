const path = require("path");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const htmlmin = require("html-minifier-terser");
const postCss = require("postcss");
const autoprefixer = require("autoprefixer");
const tailwind = require("@tailwindcss/postcss");
const cssnano = require("cssnano");
const mdit = require("markdown-it");
const mditAttrs = require("markdown-it-attrs");
const hljs = require("highlight.js/lib/core");
const Image = require("@11ty/eleventy-img");
const { execSync } = require("child_process");

// sizes and formats of resized images to make them responsive
// it can be overwriten when using the "Picture" short code
const Images = {
  WIDTHS: [426, 460, 580, 768, 1200], // sizes of generated images
  FORMATS: ["webp", "jpeg"], // formats of generated images
  SIZES: "(max-width: 1200px) 70vw, 1200px", // size of image rendered
};

module.exports = async function (eleventyConfig) {
  const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform("htmlmin", htmlminTransform);
  }

  // rss plugin
  eleventyConfig.addPlugin(pluginRss);

  // markdown
  const mditOptions = {
    html: true,
    breaks: true,
    linkify: false,
    typographer: true,
  };
  const mdLib = mdit(mditOptions).use(mditAttrs);

  // Load any languages you need to highlight
  hljs.registerLanguage(
    "javascript",
    require("highlight.js/lib/languages/javascript")
  );
  hljs.registerLanguage(
    "markdown",
    require("highlight.js/lib/languages/markdown")
  );
  hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
  hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'));
  hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
  hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
  hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));

  // highlight codeblocksaccording to language
  mdLib.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const str = token.content;
    const lg = token.info;

    if (lg && hljs.getLanguage(lg)) {
      // add also tabindex=0 to give access to a block with scrolling (a11y)
      return (
        '<pre class="language-' +
        lg +
        '"><code class="hljs language-' +
        lg +
        '" tabindex="0">' +
        hljs.highlight(str, { language: lg, ignoreIllegals: true }).value +
        "</code></pre>"
      );
    }
    console.warn(
      "language highlight not loaded: ",
      "\x1b[96m" + lg + "\x1b[0m"
    );
    return (
      '<pre><code class="hljs" tabindex="0">' +
      mdLib.utils.escapeHtml(str) +
      "</code></pre>"
    );
  };

  // generate responsive images from Markdown
  mdLib.renderer.rules.image = (tokens, idx, options, env) => {
    const token = tokens[idx];
    const imgPath = token.attrGet("src");
    const isGlobal =
      imgPath.slice(0, env.meta.public_folder.length) ===
      env.meta.public_folder;

    const imgSrc = isGlobal
      ? "./" +
        env.meta.media_folder +
        imgPath.slice(env.meta.public_folder.length)
      : imgPath.slice(0, 1) === "/"
      ? env.eleventy.directories.input.slice(0, -1) + imgPath
      : env.page.inputPath.substring(
          0,
          env.page.inputPath.lastIndexOf("/") + 1
        ) + imgPath;

    const imgAlt = token.content;
    const imgTitle = token.attrGet("title") ?? "";
    const className = token.attrGet("class");
    const ImgOptions = getImgOptions(
      env.page,
      imgSrc,
      imgAlt,
      className,
      Images.WIDTHS,
      Images.FORMATS,
      Images.SIZES
    );
    const htmlOptions = {
      alt: imgAlt,
      class: className,
      sizes: Images.SIZES,
      loading: className?.includes("lazy") ? "lazy" : undefined,
      decoding: "async",
      title: imgTitle,
    };
    Image(imgSrc, ImgOptions);
    const metadata = Image.statsSync(imgSrc, ImgOptions);
    const picture = Image.generateHTML(metadata, htmlOptions);

    return picture;
  };
  eleventyConfig.setLibrary("md", mdLib);

  // Watch targets
  eleventyConfig.addWatchTarget("src/_layouts/css/tailwind.css");

  // Passthrough
  eleventyConfig.addPassthroughCopy({ "src/assets": "." });
  eleventyConfig.addPassthroughCopy({ "src/_assets/public": "/" });
  eleventyConfig.addPassthroughCopy({ "src/_assets/img": "/img" });
  eleventyConfig.addPassthroughCopy({ "src/_assets/fonts": "/fonts" });

  // Watch targets
  eleventyConfig.addWatchTarget("src/_layouts/css/tailwind.css");

  // process css
  eleventyConfig.addNunjucksAsyncFilter("postcss", postcssFilter);

  // Image shortcode with <picture> where widths and sizes can be overwritten
  eleventyConfig.addShortcode(
    "Picture",
    async (
      page,
      src,
      alt,
      className = undefined,
      widths = Images.WIDTHS,
      formats = Images.FORMATS,
      sizes = Images.SIZES
    ) => {
      if (!alt) {
        throw new Error(`Missing \`alt\` on myImage from: ${src}`);
      }
      const srcImage = getSrcImage(page, src);
      const options = getImgOptions(
        page,
        src,
        alt,
        className,
        widths,
        formats,
        sizes
      );
      const imageMetadata = await Image(srcImage, options);
      const sourceHtmlString = Object.values(imageMetadata)
        // Map each format to the source HTML markup
        .map((images) => {
          // The first entry is representative of all the others
          // since they each have the same proportions
          const { sourceType } = images[0];

          const sourceAttributes = stringifyAttributes({
            type: sourceType,
            // srcset needs to be a comma-separated attribute
            srcset: images.map((image) => image.srcset).join(", "),
            sizes,
          });

          // Return one <source> per format
          return `<source ${sourceAttributes}>`;
        })
        .join("\n");

      const getLargestImage = (format) => {
        const images = imageMetadata[format];
        return images[images.length - 1];
      };

      const largestUnoptimizedImg = getLargestImage(formats[0]);

      const imgAttributes = stringifyAttributes({
        src: largestUnoptimizedImg.url,
        width: largestUnoptimizedImg.width,
        height: largestUnoptimizedImg.height,
        alt,
        loading: className?.includes("lazy") ? "lazy" : undefined,
        decoding: "async",
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
    }
  );

  // image path for page thumbnail (used in meta tags)
  eleventyConfig.addNunjucksAsyncShortcode(
    "getOGImageUri",
    async (meta, page, src) => {
      if (!src) return "/vera-600w.webp"; // use an existing image as fallback

      const isGlobal =
        src.slice(0, meta.public_folder.length) === meta.public_folder;

      const imgSrc = isGlobal
        ? "./" + meta.media_folder + src.slice(meta.public_folder.length)
        : page.inputPath.substring(0, page.inputPath.lastIndexOf("/") + 1) +
          src;

      const ImgOptions = getImgOptions(
        page,
        src,
        "",
        "",
        [600],
        ["webp"],
        undefined
      );
      const metadata = await Image(imgSrc, ImgOptions);
      console.log("RETURN image " + metadata.webp[0].url);

      return metadata.webp[0].url;
    }
  );

  // Collections
  eleventyConfig.addCollection("documentation", function (collection) {
    return collection.getFilteredByGlob("./src/pages/documentation/**/*.md");
  });

  // pagefind search
  eleventyConfig.on("eleventy.after", () => {
    execSync(`npx pagefind --site _site --glob \"**/*.html\"`, {
      encoding: "utf-8",
    });
  });

  return {
    dir: {
      input: "src/pages",
      media: "src/static/img",
      layouts: "../_layouts",
      includes: "../_layouts/includes",
      data: "../_data",
      output: "_site",
    },
    templateFormats: ["md", "njk", "jpg", "gif", "png", "html", "jpeg", "webp"],
    pathPrefix: process.env.BASE_HREF ? `/${process.env.BASE_HREF}/` : "/", //  used with github pages
  };
}; // end config

function htmlminTransform(content, outputPath) {
  if (outputPath.endsWith(".html")) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
    return minified;
  }
  return content;
}

const postcssFilter = (cssCode, done) => {
  postCss([
    tailwind(), // process tailwind with postcss
    autoprefixer,
    cssnano({ preset: "default" }), // minify css
  ])
    .process(cssCode, {
      from: "./src/_layouts/css/tailwind.css",
    })
    .then(
      (r) => done(null, r.css),
      (e) => done(e, null)
    );
};

/** Maps a config of attribute-value pairs to an HTML string
 * representing those same attribute-value pairs.
 */
const stringifyAttributes = (attributeMap) => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === "undefined") return "";
      return `${attribute}="${value}"`;
    })
    .join(" ");
};

const getSrcImage = (page, src) => {
  let inputFolder = page.inputPath.split("/");
  inputFolder.pop();
  inputFolder = inputFolder.join("/");

  return inputFolder + "/" + src;
};

const getImgOptions = (page, src, alt, className, widths, formats, sizes) => {
  let outputFolder = page.outputPath.slice(
    0,
    page.outputPath.lastIndexOf("/") + 1
  ); // remove index.html

  let urlPath = outputFolder.split("/");
  urlPath.shift(); // remove ./
  urlPath.shift(); // remove _site
  urlPath = "/" + urlPath.join("/");

  const options = {
    widths: widths
      .concat(widths.map((w) => w * 2)) // generate 2x sizes
      .filter((v, i, s) => s.indexOf(v) === i), // dedupe
    formats: [...formats, null],
    outputDir: outputFolder,
    urlPath: urlPath,
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    },
  };
  return options;
};
