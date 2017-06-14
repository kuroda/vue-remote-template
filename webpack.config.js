module.exports = {
  entry: './src/vue-remote-template.js',
  output: {
    path: __dirname + '/dist',
    filename: 'vue-remote-template.js',
    library: 'vue-remote-template',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
