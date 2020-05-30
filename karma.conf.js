module.exports = function (config) {
  config.set({
    frameworks: ["mocha", "chai", "karma-typescript"],
    files: ["test/*.ts", "src/*.ts"],
    preprocessors: {
      "**/*.ts": "karma-typescript",
      "src/*.ts": "coverage",
    },
    reporters: ["progress", "karma-typescript", "coverage"],
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ["ChromeHeadless"],
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
    coverageReporter: {
      type: "lcovonly",
    },
  });
};
