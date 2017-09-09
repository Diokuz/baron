const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: './src/client.js',

    output: {
        filename: './dist/baron.min.js',
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ],
}
