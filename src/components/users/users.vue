<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="search-box">
      <el-col>
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model="query" class="search-input">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" plain>添加用户</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table
      :data="userslist"
      stripe
      border
      style="width: 100%">
      <el-table-column
        type="id"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="userslist">
          {{userslist.row.create_time | fmdate}}
        </template>
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template>
          <el-row>
            <el-button type="primary" icon="el-icon-edit" size="small" plain circle></el-button>
            <el-button type="warning" icon="el-icon-s-tools" size="small" plain circle></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" plain circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <div class="devide-page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data: function () {
    return {
      query: '',// 查询参数
      pagenum: 1,// 当前页码，不能为空
      pagesize: 4,// 每页显示数，不能为空
      userslist: [],// 用户信息
      total: 0
    }
  },
  methods: {
    // 获取用户列表信息
    async getUserList () {
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}
      &pagesize=${this.pagesize}`)
      const {meta: {status, msg}, data: {users, total}} = res.data
      if (status === 200) {
        this.userslist = users
        this.total = total
        console.log(users)
        this.$message.success(msg)
      } else {
        this.$message.warning('0000')
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style scoped>
  .box-card {
    height: 100%;
  }
  .search-box {
    margin-bottom: 15px;
  }
  .search-input {
    width: 300px;
  }
  .devide-page {
    margin-top: 15px;
  }
</style>
