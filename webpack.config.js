var path = require("path");
var webpack = require("webpack");
var fableUtils = require("fable-utils");

function resolve(filePath) {
    return path.join(__dirname, filePath)
}

resolveBabelOptions = function(opts) {
    function resolve2(item) {
        return require.resolve(item);
    }
    function resolveArray(ar) {
        return ar.map(item => Array.isArray(item)
            ? [resolve2( item[0]), item[1]]
            : resolve2(item));
    }
    var newOpts = Object.assign({}, opts);
    if (Array.isArray(opts.presets)) {
        newOpts.presets = resolveArray(opts.presets);
    }
    if (Array.isArray(opts.plugins)) {
        newOpts.plugins = resolveArray(opts.plugins);
    }
    return newOpts;
}

var babelOptions = resolveBabelOptions({
    presets: [["@babel/preset-env", { "modules": false }]],
    plugins: [["@babel/plugin-transform-runtime", {
        "helpers": true,
        // We don't need the polyfills as we're already calling
        // cdn.polyfill.io/v2/polyfill.js in index.html
        "regenerator": false
    }]]
});

var isProduction = process.argv.indexOf("-p") >= 0;
console.log("Bundling for " + (isProduction ? "production" : "development") + "...");

module.exports = {
    devtool: isProduction ? undefined : "source-map",
    entry: resolve('./src/BlueprintExample.fsproj'),
    output: {
        filename: 'bundle.js',
        path: resolve('./public'),
    },
    resolve: {
        modules: [
            "node_modules", resolve("./node_modules/")
        ]
    },
    devServer: {
        contentBase: resolve('./public'),
        port: 8080,
        hot: true,
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.fs(x|proj)?$/,
                use: {
                    loader: "fable-loader",
                    options: {
                        babel: babelOptions,
                        define: isProduction ? [] : ["DEBUG"]
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                },
            },
            {
                test: /\.sass$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: isProduction ? [] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};
