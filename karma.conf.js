var webpack = require('webpack');

module.exports = function (config) {
  var configuration = {
    browsers: ['Chrome'],
      singleRun: false,
      frameworks: ['jasmine'],
      files: ['webpack-test.config.js',
        { pattern: 'extension/build/javascript-breakpoint-collection.js', included: true, watched: true }
      ],
      proxies: {
        '/extension/': '/base/extension/'
      },
      preprocessors: {
        'webpack-test.config.js': ['webpack', 'sourcemap']
      },
      customLaunchers: {
        Chrome_travis_ci: {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
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
    }
    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }

  config.set(configuration);
};
