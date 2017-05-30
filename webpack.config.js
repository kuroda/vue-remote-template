var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    'vue-remote-template': './src/vue-remote-template.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue-remote-template.js',
    publicPath: '/',
    library: 'VueRemoteTemplate'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /node_modules|dist/,
        loader: 'babel-loader'
      }
    ]
  }
}
