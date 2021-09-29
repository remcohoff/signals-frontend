// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const {
  default: createStyledComponentsTransformer,
} = require('typescript-plugin-styled-components')
const webpackBase = require('./webpack.base.babel')
const template = require('./template')

// 2. create a transformer;
// the factory additionally accepts an options object which described below
const styledComponentsTransformer = createStyledComponentsTransformer()

module.exports = webpackBase({
  mode: 'development',

  // Add hot reloading in development
  entry: [
    path.join(process.cwd(), 'src/app.js'), // Start with js/app.js
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  // Add development plugins
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      ...template,
    }),
    new HtmlWebpackPlugin({
      filename: 'manifest.json',
      inject: false,
      templateContent: template.manifestContent,
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(process.cwd(), 'src/sw-proxy.js') },
        {
          from: path.join(process.cwd(), 'src/sw-proxy-config.js'),
          force: true,
        },
      ],
    }),
  ],

  tsLoaders: [
    // Babel also have typescript transpiler. Uncomment this if you prefer and comment-out ts-loader
    // { loader: 'babel-loader' },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        logLevel: 'info',
        getCustomTransformers: () => ({
          before: [styledComponentsTransformer],
        }),
      },
    },
  ],

  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'cheap-module-source-map',

  performance: {
    hints: false,
  },
})
