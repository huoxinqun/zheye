// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        'windows.jQuery':"jquery"
      })
    ]
  }
}
