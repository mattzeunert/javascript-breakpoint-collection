var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './index.js',
  output: { path: __dirname + "/extension", filename: 'bundle.js' },
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
};