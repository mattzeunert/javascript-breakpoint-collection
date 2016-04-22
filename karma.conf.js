var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: false,
    frameworks: ['jasmine'],
    files: ['webpack-test.config.js'],
    preprocessors: {
      'webpack-test.config.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: {
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }]
      },
      watch: true,
      resolve: {
        extensions: ["", ".js", ".jsx", ".js.jsx"]
      },
      devtool: 'inline-source-map',
    },
    webpackServer: {
      noInfo: true
    }
  });
};
