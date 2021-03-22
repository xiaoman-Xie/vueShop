import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '../components/users/users.vue'
import Right from '../components/rights/right.vue'
import RolesList from '../components/rights/rolesList.vue'
import Goodslist from '../components/goods/goodslist.vue'
import GoodsAdd from '../components/goods/goodsAdd.vue'
import Cateparams from '../components/goods/cateparams.vue'
import GoodsCate from '../components/goods/goodsCate.vue'
import Orderlist from '../components/order/orderlist.vue'
import Report from '../components/report/report.vue'

import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Right
        },
        {
          name: 'roleslist',
          path: '/roles',
          component: RolesList
        },
        {
          name: 'goodslist',
          path: '/goods',
          component: Goodslist
        },
        {
          name: 'goodsAdd',
          path: '/goodsAdd',
          component: GoodsAdd
        },
        {
          name: 'cateparams',
          path: '/params',
          component: Cateparams
        },
        {
          name: 'goodsCate',
          path: '/categories',
          component: GoodsCate
        },
        {
          name: 'order',
          path: '/orders',
          component: Orderlist
        },
        {
          name: 'report',
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      // 当前路径不在login下才跳转
      if (from.path !== '/login') {
        router.push({
          name: 'login'
        })
      }
      Message.warning('请登录帐号')
    } else {
      next()
    }
  }
})

export default router
