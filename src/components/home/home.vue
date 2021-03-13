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
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="users">
                <i class="el-icon-price-tag"></i>用户列表
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1"><i class="el-icon-price-tag"></i>角色列表</el-menu-item>
              <el-menu-item index="2-2"><i class="el-icon-price-tag"></i>权限列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1"><i class="el-icon-price-tag"></i>商品列表</el-menu-item>
              <el-menu-item index="3-2"><i class="el-icon-price-tag"></i>分类参数</el-menu-item>
              <el-menu-item index="3-2"><i class="el-icon-price-tag"></i>商品分类</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1"><i class="el-icon-price-tag"></i>订单列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-data-line"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1"><i class="el-icon-price-tag"></i>数据报表</el-menu-item>
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
  methods: {
    exit () {
      localStorage.clear('token')
      this.$router.push({ name: 'login' })
      this.$message({
        showClose: true,
        message: '帐号已退出',
        type: 'success'
      })
    }
  },
  beforeCreate () {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push({ name: 'login' })
      this.$message({
        showClose: true,
        message: '请登录帐号',
        type: 'warning'
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
