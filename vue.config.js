const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    proxy:{                                 //设置代理
      '/api':{                              //设置拦截器 拦截格式
        target:'http://localhost:8888/ssm',    // 代理的目标地址 就是 /api 代替 http://localhost:8081/
        changeOrigin:true,                  // 是否设置同源
        pathRewrite:{                       //选择忽略拦截器里面的单词
          '/api':''
        }
      }
    }
  }
})
