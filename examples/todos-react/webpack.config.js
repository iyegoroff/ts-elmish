const path = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshTypeScript = require('react-refresh-typescript').default
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = (env) => ({
  mode: env.production ? 'production' : 'development',
  entry: {
    main: './src/index.tsx'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [path.join(__dirname, 'src'), path.join(__dirname, '../../packages')],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                '@babel/preset-typescript',
                ['@babel/preset-react', { runtime: 'automatic' }],
                ['@babel/preset-env', { targets: { node: 14 }, modules: false }]
              ],
              plugins: [
                '@vanilla-extract/babel-plugin',
                env.development && 'react-refresh/babel'
              ].filter(Boolean)
            }
          }
        ].filter(Boolean)
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    env.development && new webpack.HotModuleReplacementPlugin(),
    env.development && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin(),
    new VanillaExtractPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        },
        mode: 'write-references',
        configFile: './src/tsconfig.build.json'
      },
      eslint: {
        enabled: true,
        files: './src/**/*.{ts,tsx}'
      }
    })
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.web.ts', '.web.tsx', '.json'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react')
    }
  }
})
