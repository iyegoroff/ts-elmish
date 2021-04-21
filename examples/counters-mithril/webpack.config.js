const path = require('path')

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: './tsconfig.build.json'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      mithril: path.resolve(__dirname, 'node_modules/mithril')
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/build')
  }
}
