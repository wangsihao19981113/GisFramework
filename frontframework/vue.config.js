const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
    port:8888,
    proxy: {  //配置跨域
      '/el': {
        target: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',  //这里后台的地址模拟的;应该填写你们真实的后台接口
        changOrigin: true,  //允许跨域
        pathRewrite: {
          '^/el': ''
        }
      },
      '/datasource':{
        target: 'http://192.168.1.83:6969',
        changeOrigin: true,
        pathRewrite: {
          '^/datasource': ''
        }
      },
      '/geoserverAddress':{
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/geoserverAddress': ''
        }
      }
    }
  }
})
