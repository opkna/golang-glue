module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            "src/**/*.ts",
            "src/**/*.js",
            "test/**/*.ts",
            {
                pattern: "test/util/compiled/*.wasm",
                included: false,
            },
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript",
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["FirefoxHeadless"],
        karmaTypescriptConfig: {
            compilerOptions: {
                lib: ["DOM", "ES2015"],
                inlineSourceMap: true,
                sourceMap: false,
                allowJs: true,
            },
        },
    });
};
