var path = require('path');
var webpack = require('webpack');

var toBuild = [
    {
        entry: ["devtools-panel.js", "./devtools-panel.js"],
        path: __dirname + "/extension/build",
        libraryTarget: "var"
    },
    {
        entry: ["javascript-breakpoint-collection", "./injected-script.js"],
        path: __dirname + "/extension/build",
        libraryTarget: "var"
    },
    {
        entry: ["node", "./injected-script"],
        //needs separate build becasue otherwise the script fails
        // on pages with a global `define` function
        libraryTarget: "umd",
        path: __dirname + "/dist/"
    }
]

function makeConfig(item){
    var entry = {};
    entry[item.entry[0]] = item.entry[1];

    return {
      entry: entry,
      devtool: "source-map",
      output: {
          path: item.path,
          filename: '[name].js',
          libraryTarget: item.libraryTarget
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
      }
    };
}

var configs = toBuild.map(makeConfig);

module.exports = configs;
