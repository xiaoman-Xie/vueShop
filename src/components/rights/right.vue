<template>
  <el-card class="box-card">
    <custom-bread level1="权限管理" level2="权限列表"></custom-bread>
    <el-table
      :data="tableData"
      class="rights-table">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      roleslist: []
    }
  },
  methods: {
    async getRightslist () {
      // const AUTH_TOKEN = localStorage.getItem('token')
      const res = await this.$http.get('roles', '')
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.roleslist = data
      }
      console.log(res)
    }
  },
  created () {
    this.getRightslist()
  }
}
</script>

<style scoped>
  .box-card {
    height: 100%;
  }
  .rights-table {
    width: 100%;
    margin-top: 10px;
  }
</style>
