const path = require('path');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './public/blogger.html',
  filename: 'blogger.html',
  inject: 'body'
});

var cssName = 'index.css';

const extractText =  new extractTextPlugin(cssName);

module.exports = {
  entry: './react/index.js',
  output: {
    path:  path.resolve('assets/js'),
    filename: 'index_bundle.js'
  },
  plugins: [
    extractText,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets:[ 'es2015', 'react', 'stage-2' ]
      }
    },{ 
      test: /\.jsx$/, 
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets:[ 'es2015', 'react', 'stage-2' ]
      }
    },{ 
      test: /\.(png|woff|woff2|eot|ttf|svg|jpg|jpeg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=100000' 
    },{
      test: /\.css$/,  
      exclude: /node_modules/,  
      loader: ['style-loader', 'css-loader']
    }]
  }
};
