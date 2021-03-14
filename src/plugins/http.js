import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  // 请求前拦截
  axios.interceptors.request.use(function (config) {
    // 非登录请求时，设置请求头
    // eslint-disable-next-line
    if (config.url != 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] = AUTH_TOKEN
    }
    return config
  })
  Vue.prototype.$http = axios
}

export default MyHttpServer
