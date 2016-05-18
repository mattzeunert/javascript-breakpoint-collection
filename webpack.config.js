var path = require('path');
var webpack = require('webpack');

module.exports = [{
  entry: {
    "devtools-panel": './devtools-panel.js',
    "javascript-breakpoint-collection": './injected-script.js'
  },
  devtool: "source-map",
  output: {
      path: __dirname + "/extension/build",
      filename: '[name].js',
      libraryTarget: "var"
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        presets: ['es2015', 'react']
      }
    ]
  },
}];
