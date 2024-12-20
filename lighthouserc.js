module.exports = {
  ci: {
    collect: {
      "url": [
        "http://localhost/index.html",
        "http://localhost/documentation/",
        "http://localhost/documentation/images/",
        "http://localhost/documentation/styles/",
        "http://localhost/documentation/cms/",
        "http://localhost/examples/",
        "http://localhost/examples/images/",
        "http://localhost/examples/images/local/wasps/",
        "http://localhost/examples/images/local/sheep/",
        "http://localhost/examples/images/global/cows/",
        "http://localhost/examples/images/global/heron/",
      ],
      staticDistDir: './_site',
      staticDirFileDiscoveryDepth: 1,
      "numberOfRuns": 1,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
    preset: 'lighthouse:recommended',
    },
  },
};
