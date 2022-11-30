const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()] // for rooted paths like 'events/LinkClickedEvent'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'svgpublish.js',
    library: {
      name: 'svgpublish',
      type: 'umd'
    }
  },
  watchOptions: {
    ignored: /node_modules/
  }
};
