const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development", // delete hiij bolno
    entry: "./src/js/index.js",
    devtool: "inline-source-map", // delete hiij bolno
    output: {
        filename: "js/main.js",
        path: path.resolve(__dirname, "docs"),
    },

    devServer: {
        static: "./docs",
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "src/index.html",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env"]],
                    },
                },
            },
        ],
    },
};
