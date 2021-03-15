<template>
  <el-card class="box-card">
    <custom-bread level1="权限管理" level2="权限列表"></custom-bread>
    <el-table
      :data="roleslist"
      class="rights-table"
      height="520px"
      border>
      <el-table-column
        type="index"
        width="200">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="300">
      </el-table-column>
      <el-table-column
        prop="level"
        label="权限等级"
        :filters="[{ text: '一级', value: '0' }, { text: '二级', value: '1' }, { text : '三级', value: '2'}]">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level==='0'" type="warning">一级</el-tag>
          <el-tag  v-if="scope.row.level==='1'">二级</el-tag >
          <el-tag  v-if="scope.row.level==='2'" type="success">三级</el-tag >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      roleslist: []
    }
  },
  methods: {
    async getRightslist () {
      const res = await this.$http.get('rights/list', '')
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.roleslist = data
      }
    }
  },
  created () {
    this.getRightslist()
  }
}
</script>

<style scoped>
  .box-card {
    height: 99%;
  }
  .rights-table {
    width: 100%;
    margin-top: 10px;
  }
</style>
