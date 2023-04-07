//引入axios
import axios from "axios";
//通过axios对象 request 用于发送请求到后端
const request = axios.create({
    timeout:5000
})

//request拦截器
//对请求做统一处理  加入 token Content-Type
request.interceptors.request.use(config =>{
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    return config
}, error => {
    return Promise.reject(error)
})


//request拦截器
//调用接口响应后统一处理返回结果
request.interceptors.response.use(
    response=>{
       let  res = response.data
        //如果返回是文件
        if(response.config.responseType === 'blob'){
            return res
        }
        //如果是字符串
        if(typeof res === 'string'){
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log("error")
        return Promise.reject(error);
    }
)





export default request