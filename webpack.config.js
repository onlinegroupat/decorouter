const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    //
    // config for example
    //
    {
        entry: {
            "example": __dirname + "/src/example/index.ts"
        },
        output: {
            filename: "[name].js",
            path: __dirname + "/dist",
            publicPath: '/'
        },

        devtool: "source-map",

        resolve: {
            extensions: [ ".webpack.js", ".web.js", ".ts", ".js"]
        },

        module: {
            rules: [
                { test: /\.ts$/, loader: "awesome-typescript-loader" },
                { test: /\.js$/, loader: "source-map-loader", enforce: 'post' },
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                filename: 'example.html',
                template: './src/example/example.html'
            })
        ]
    },
    //
    // config for library
    //
    {
        entry: {
            "main": __dirname + "/src/main/index.ts"
        },
        output: {
            filename: "index.js",
            path: __dirname + "/lib/main",
            library: 'decorouter',
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: [ ".webpack.js", ".web.js", ".ts", ".js"]
        },
        module: {
            rules: [
                { test: /\.ts$/, loader: "awesome-typescript-loader" }
            ]
        },
        externals: {
            "route-parser": {
                commonjs: "route-parser",
                commonjs2: "route-parser",
                amd: "route-parser"
            }
        }
    }
];