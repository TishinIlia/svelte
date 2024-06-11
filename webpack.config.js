const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const sveltePreprocess = require('svelte-preprocess');
const StylelintPlugin = require('stylelint-webpack-plugin');
const mode = process.env.NODE_ENV || 'development';
const CSSMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prod = mode === 'production';

module.exports = {
  entry: './src/main.ts',
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte/src/runtime'),
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    conditionNames: ['svelte', 'browser'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            compilerOptions: {
              dev: !prod,
            },
            emitCss: prod,
            hotReload: !prod,
            preprocess: sveltePreprocess({ sourceMap: !prod }),
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    runtimeChunk: prod ? false : 'single',
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [`...`, new CSSMinimizerWebpackPlugin()],
  },
  mode,
  plugins: [
    new HtmlWebpackPlugin({}),
    new MiniCssExtractPlugin({
      filename: 'bundle.[contenthash].css',
    }),
    new StylelintPlugin({
      files: 'src/{**/*,*}.css',
    }),
    new ESLintPlugin({
      files: 'src/{**/*,*}.{tsx,ts}',
    }),
  ],
  devtool: prod ? 'hidden-source-map' : 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
};
