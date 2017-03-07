const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        "example": __dirname + "/src/example/index.ts"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [ ".webpack.js", ".web.js", ".ts", ".js"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { test: /\.js$/, loader: "source-map-loader", enforce: 'post' },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'example.html',
            template: './src/example/example.html'
        })
    ]
};