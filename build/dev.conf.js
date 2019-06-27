const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConf = require('./base.conf')

module.exports = merge(baseConf, {
    mode: 'development',
    entry: {
        app: ['webpack-hot-middleware/client?reload=true',path.resolve(__dirname, '../src/index')]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        new CopyWebpackPlugin([{
            context: __dirname,
            from: '../src/assets/fonts/json/',
            to: 'static/file/json'
        }]),
        new HtmlWebpackPlugin({
            title: 'Game',
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            chunk: ['app'],
            inject: true,
        })
    ]
})