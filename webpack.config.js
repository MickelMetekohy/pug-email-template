// const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

const extractStyles = new ExtractTextPlugin({
  filename: 'css/[name].bundle.css',
  allChunks: true,
});

const extractHtml = new ExtractTextPlugin({
  filename: '[name].html',
  allChunks: true,
});

const config = {
  devtool: 'source-map',
  entry: {
    app: './_develop/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, '_distribute/'),
    filename: 'js/[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true,
                // minimize: true,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sourceMapContents: true,
                outputStyle: 'expanded',
              },
            },
          ],
        }),
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        include: path.resolve(__dirname, '_develop/images/'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.(html)$/,
        include: path.resolve(__dirname, '_develop/'),
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '/',
          },
        },
      },
      {
        test: /\.pug$/,
        include: path.resolve(__dirname, '_develop/'),
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: path.resolve(__dirname, '_develop/fonts/'),
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            publicPath: '../',
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, '_distribute/'),
    compress: false,
    port: 9001,
    stats: 'errors-only',
  },
  plugins: [
    extractHtml,
    extractStyles,
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '_develop/images'),
        to: path.resolve(__dirname, '_distribute/images'),
      },
    ]),
    new CleanWebpackPlugin(['public'], {
      root: path.resolve(__dirname, ''),
    }),
    new webpack.ProvidePlugin({}),
    new ImageminPlugin({
      optipng: { optimizationLevel: 7 },
      gifsicle: { optimizationLevel: 3 },
      pngquant: { quality: '65-90', speed: 4 },
      svgo: { removeUnknownsAndDefaults: false, cleanupIDs: false },
      jpegtran: { progressive: true },
      plugins: [imageminMozjpeg({ quality: 75, progressive: true })],
      disable: false, // Disable during development
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   inject: false,
    //   template: './_develop/templates/index.pug',
    //   svgoConfig: {
    //     removeTitle: false,
    //     removeViewBox: true,
    //   },
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: false,
      template: './_develop/templates/index.pug',
      svgoConfig: {
        removeTitle: false,
        removeViewBox: true,
      },
    }),
    new HtmlWebpackPugPlugin(),
    // new HtmlWebpackPlugin({

    // }),
    new HtmlWebpackInlineSVGPlugin(),
  ],
};

if (process.env.npm_lifecycle_event === 'start') {
  console.log('* * * * * * * * * *');
  console.log('** RUNNING: START');
  console.log('** START: webpack --watch - rebuilds the distribute folder.');
  console.log('** SERVER: webpack-dev-server --open - ...');
  console.log('* * * * * * * * * *');
}

if (process.env.npm_lifecycle_event === 'server') {
  console.log('* * * * * * * * * *');
  console.log('** RUNNING: SERVER');
  console.log('** START: webpack --watch - rebuilds the distribute folder.');
  console.log('** SERVER: webpack-dev-server --open - serves imediate updates from memory');
  console.log('* * * * * * * * * *');
}

if (process.env.NODE_ENV === 'production') {
  // config.plugins.push(
  // new UglifyJSPlugin(),
  // );
}

module.exports = config;
