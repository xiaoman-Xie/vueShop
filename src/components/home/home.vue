<template>
  <el-container class="container">
    <el-header class="header">电商管理系统
      <el-button id="exit" type="success" round @click="exit">退出</el-button>
    </el-header>
    <!-- 垂直导航栏 -->
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
          background-color="#c2d4e7"
          :unique-opened="true"
          :router="true">
          <el-submenu :index="item1.order" v-for="(item1, index1) in menus" :key="index1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="item2.path" v-for="(item2, index2) in item1.children" :key="index2">
                <i class="el-icon-price-tag"></i>{{item2.authName}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 展示区 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.getMenus()
  },
  methods: {
    exit () {
      localStorage.clear('token')
      this.$router.push({ name: 'login' })
      this.$message({
        showClose: true,
        message: '帐号已退出',
        type: 'success'
      })
    },
    async getMenus () {
      const res = await this.$http.get(`menus`)
      this.menus = res.data.data
      // order属性转为string型（导航栏index属性需为string）
      this.menus.forEach(item => {
        item.order = item.order.toString()
      })
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
  }
  .header {
    background-color: #848e97;
    color: #fff;
    text-align: center;
    height: 60px;
    font-size: 30px;
    font-weight: 800;
    padding-top: 8px;
  }
  #exit {
    position: absolute;
    right: 50px;
  }
  .aside {
    background-color: #c2d4e7;
    color: #fff;
  }
  .main {
    background-color: #fff;
  }
</style>
