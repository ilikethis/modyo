const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

/**
 * Module export.
 */
module.exports = {
  entry: {
    'bundle': [
      './source/js/core.js',
      './source/sass/main.scss'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].min.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract([
          'css-loader?url=false&minimize=true',
          'sass-loader',
        ]),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].min.css'
    }),
    new BabiliPlugin(),
  ],
};
