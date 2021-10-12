'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const traceFragment = require('macaca-ecosystem/lib/trace-fragment');

const pkg = require('./package');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const webpackConfig = {
    stats: {
      publicPath: true,
      chunks: false,
      modules: false,
      children: false,
      entrypoints: false,
      chunkModules: false,
    },

    devtool: isProduction ? false : 'source-map',

    entry: {
      [pkg.name]: path.join(__dirname, 'src', 'app'),
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist',
      filename: '[name].js',
      chunkFilename: '[name].js',
    },

    resolve: {
      extensions: [
        '.js',
        '.jsx',
      ],
    },

    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        }, {
          test: /\.json$/,
          type: 'javascript/auto',
          use: 'json-loader',
          exclude: /node_modules/,
        }, {
          test: /\.less$/,
          exclude (filePath) {
            return filePath.endsWith('.module.less');
          },
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        }, {
          test: /\.module\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        }, {
          test: /.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css',
      }),
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(pkg.version),
        'process.env.traceFragment': traceFragment,
      }),
    ],
    devServer: {
      hot: true,
      host: '0.0.0.0',
      stats: 'errors-only',
    },
  };

  if (!isProduction) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (isProduction) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (process.env.npm_config_report) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  return webpackConfig;
};
