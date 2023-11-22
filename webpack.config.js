const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  mode: 'development',
  experiments: {
    outputModule: true,
  },
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
