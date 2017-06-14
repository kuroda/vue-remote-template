module.exports = {
  entry: './src/vue-remote-template.js',
  output: {
    path: __dirname + '/dist',
    filename: 'vue-remote-template.js',
    library: 'VueRemoteTemplate',
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
