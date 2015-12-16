var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');

// Load *package.json* to build vendor.js
var pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATH = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

var common = {
  entry: PATH.app,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATH.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATH.app
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATH.app
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Kanban App'
    })
  ]
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    // Define entry point needed for splitting
    entry: {
      app: PATH.app,
      vendor: Object.keys(pkg.dependencies).filter(function(v) {
        // Exclude `alt-utils` since itsn't support
        return v !== 'alt-utils';
      })
    },
    output: {
      path: PATH.build,
      // Output using entry name
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    },
    devtool: 'source-map',
    plugins: [
      // Extract vendor and manifest files
      new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor', 'manifest']
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}
