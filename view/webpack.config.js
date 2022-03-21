'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const traceFragment = require('macaca-ecosystem/lib/trace-fragment');

const pkg = require('./package');

const { NODE_ENV } = process.env;
const distDirName = 'dist';

module.exports = () => {
  const isProd = NODE_ENV === 'production';

  const webpackConfig = {
    stats: {
      publicPath: true,
      chunks: false,
      modules: false,
      children: false,
      entrypoints: false,
      chunkModules: false,
    },

    devtool: isProd ? false : 'source-map',

    entry: {
      [pkg.name]: path.join(__dirname, 'src', 'app'),
    },

    output: {
      path: path.resolve(__dirname, distDirName),
      publicPath: isProd ? `/${distDirName}/` : `http://localhost:8080/${distDirName}/`,
      filename: '[name].js',
    },

    resolve: {
      extensions: ['.js', '.jsx'],
    },

    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.json$/,
          type: 'javascript/auto',
          use: 'json-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.less$/,
          exclude(filePath) {
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
                  math: 'always',
                },
              },
            },
          ],
        },
        {
          test: /\.module\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]',
                },
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                  math: 'always',
                },
              },
            },
          ],
        },
        {
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
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                symbolId: '[name]',
              },
            },
            {
              loader: 'svgo-loader',
            },
          ],
          include: [path.resolve(__dirname, 'src', 'assets', 'icons')],
        },
        {
          test: /\.ttf$/,
          use: [
            'file-loader',
          ],
        },
      ],
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['javascript', 'json'],
      }),
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
      static: {
        directory: __dirname,
      },
      devMiddleware: {
        publicPath: `/${distDirName}/`,
      },
    },
  };

  if (!isProd) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (process.env.npm_config_report) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  return webpackConfig;
};
