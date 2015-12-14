var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const PATH = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

module.exports = {
  entry: PATH.app,
  output: {
    path: PATH.build,
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Kanban App'
    })
  ]
};
