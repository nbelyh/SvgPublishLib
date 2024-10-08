const path = require('path');

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
    extensions: ['.tsx', '.ts', '.js']
  },
  experiments: {
    outputModule: true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'svgpublish.js',
    library: {
      type: 'module'
    }
  },
  watchOptions: {
    ignored: /node_modules/
  }
};
