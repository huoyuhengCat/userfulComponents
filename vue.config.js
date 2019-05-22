const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  // 开启生产环境SourceMap
  productionSourceMap: false,
  assetsDir: './static',
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL)
      return args
    })
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                warnings: false,
                drop_console: true,
                drop_debugger: false
              }
            }
          })
        ]
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/variables.scss";`
      }
    }
  },
  devServer: {
    port: 8672
  }
}
