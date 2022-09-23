const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
    port:8888,
    proxy: {  //配置跨域
      '/el': {
        target: 'https://jsonplaceholder.typicode.com/',  //这里后台的地址模拟的;应该填写你们真实的后台接口
        changOrigin: true,  //允许跨域
        pathRewrite: {
          '^/el': ''
        }
      },
      '/datasource':{
        target: 'http://localhost:6969',
        changeOrigin: true,
        pathRewrite: {
          '^/datasource': ''
        }
      }
    }
  }
})
