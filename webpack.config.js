const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const visualizer = require('webpack-visualizer-plugin');
const manifestPlugin = require('webpack-manifest-plugin');
const nowDate = new Date();
const isProd = e => e === 'prod';

module.exports = env => {return{

  entry: [
    "core-js/modules/es.promise",
    "core-js/modules/es.array.iterator",
    // './src/wpPublicPath.js',
    './src/live2d.js',
  ],

  output: {
    filename: 'L2DApp.min.js',
    // YOU MUST INSTALL babel-plugin-syntax-dynamic-import FIRST TO ENABLE CODE SPLITTING!
    chunkFilename: 'L2DApp.[id].min.js',
    library: 'L2Dwidget',
    libraryExport: 'L2Dwidget',
    libraryTarget: 'var',
    path: path.resolve("/home/jing/Documents/Project/blog/assets/js/live2d-widget"),
    pathinfo: (isProd(env) ? false : true),
  },

  target: 'web',

  devtool: 'source-map',

  watch: (isProd(env) ? false : true),

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify((isProd(env) ? 'production' : 'development')),
      },
    }),
    new UglifyJsPlugin({
      cache: false,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        // The L2D core library was droped too much,
        // so the warnings is useless recently.
        warnings: false,
        mangle: true,
        compress: {
          drop_console: false,
        },
      },
    }),
    // Banner must be put below UglifyJsPlugin, or it won't work.
    new webpack.BannerPlugin(`${isProd(env) ? '' : '___DEV___'}https://github.com/xiazeyu/live2d-widget.js built@${nowDate.toLocaleDateString()} ${nowDate.toLocaleTimeString()}`),
    /**
     * Webpack Manifest Plugin
     * https://github.com/danethurber/webpack-manifest-plugin
     */

    new manifestPlugin(),
    /**
     * Webpack Visualizer
     * https://github.com/chrisbateman/webpack-visualizer
     */

    new visualizer(),
  ],

  resolve: {
    extensions: ['.js','.html', '.webpack.js', '.web.js'],
  },

  module: {
    rules: [
      // {test: /\.js$/,
      //   include: path.resolve(__dirname, "src"),
      //   use: [{
      //     loader: 'babel-loader',
      //   }],
      // },
      {
        test: /\.m?js$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        }],
      },
    ]
  },
}}
