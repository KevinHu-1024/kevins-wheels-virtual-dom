module.exports = {
  entry: './index.js',
  devtool: 'souce-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  output: {
    path: __dirname + '/build',
    filename: 'app.js',
  }
};
