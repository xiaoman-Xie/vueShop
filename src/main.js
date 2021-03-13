// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'

import MyServerHttp from '@/plugins/http.js'

import '@/assets/css/base.css'

Vue.use(ElementUI)
Vue.use(MyServerHttp)

Vue.config.productionTip = false

Vue.filter('fmdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
