<template>
  <el-container class="container">
    <el-header class="header">电商管理系统
      <el-button id="exit" type="success" round>退出</el-button>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
        background-color="#c2d4e7"
        active-text-color="#99CCCC">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">角色列表</el-menu-item>
              <el-menu-item index="2-2">权限列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">商品列表</el-menu-item>
              <el-menu-item index="3-2">分类参数</el-menu-item>
              <el-menu-item index="3-2">商品分类</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">订单列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-data-line"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">数据报表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
          <!-- <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">权限管理</span>
            <el-menu-item-group>
              <el-menu-item index="2-1">角色列表</el-menu-item>
              <el-menu-item index="2-2">权限列表</el-menu-item>
            </el-menu-item-group>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">商品管理</span>
            <el-menu-item-group>
              <el-menu-item index="3-1">商品列表</el-menu-item>
              <el-menu-item index="3-2">分类参数</el-menu-item>
              <el-menu-item index="3-3">商品分类</el-menu-item>
            </el-menu-item-group>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">订单管理</span>
            <el-menu-item index="4-1">订单列表</el-menu-item>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-setting"></i>
            <span slot="title">数据统计</span>
            <el-menu-item index="5-1">数据报表</el-menu-item>
          </el-menu-item>
        </el-menu> -->
      </el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
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
