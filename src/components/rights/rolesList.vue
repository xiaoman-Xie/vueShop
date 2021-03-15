<template>
  <el-card class="card-box">
    <custom-bread class="breadCrumb" level1="权限管理" level2="角色列表"></custom-bread>
    <el-button type="primary" plain @click="showAddRole = true">添加角色</el-button>
    <el-table
      :data="roleslist"
      style="width: 100%"
      class="roles-table"
      border>
      <el-table-column
        type="index"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名"
        width="340">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="姓名"
        width="340">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain @click="showEdit(scope.row)">编辑</el-button>
          <!-- 对话框-编辑角色 -->
          <el-dialog title="编辑角色" :visible.sync="showEditRole">
            <el-form :model="editRoleForm" class="addRole-dialog">
              <el-form-item label="角色名称" :label-width="editRoleWidth">
                <el-input v-model="editRoleForm.roleName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" :label-width="editRoleWidth">
                <el-input v-model="editRoleForm.roleDesc" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer addRole-dialog">
              <el-button @click="showEditRole = false">取 消</el-button>
              <el-button @click="editRole" type="primary">确 定</el-button>
            </div>
          </el-dialog>
          <el-button type="warning" icon="el-icon-setting" plain>分配权限</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框-添加角色 -->
    <el-dialog title="添加角色" :visible.sync="showAddRole">
      <el-form :model="addRoleForm" class="addRole-dialog">
        <el-form-item label="角色名称" :label-width="addRoleWidth">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="addRoleWidth">
          <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer addRole-dialog">
        <el-button @click="showAddRole = false">取 消</el-button>
        <el-button @click="addRole" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import customBread from '../cuscom/customBread.vue'
export default {
  components: { customBread },
  data () {
    return {
      roleslist: [],
      showAddRole: false,
      showEditRole: false,
      addRoleWidth: '100px',
      editRoleWidth: '100px',
      currentRoleId: '',
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
    async getRoleslist () {
      const res = await this.$http.get('roles', '')
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.roleslist = data
      }
    },
    async addRole () {
      const res = await this.$http.post('roles', this.addRoleForm)
      const {meta: {msg, status}} = res.meta
      if (status === 201) {
        this.showAddRole = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    showEdit (role) {
      console.log(role)
      this.currentRoleId = role.id
      this.editRoleForm.id = role.id
      this.editRoleForm.roleName = role.roleName
      this.editRoleForm.roleDesc = role.roleDesc
      this.showEditRole = true
    },
    async editRole () {
      const res = await this.$http.put(`roles/${this.currentRoleId}`, this.editRoleForm)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success('修改成功')
        this.showEditRole = false
        this.editRoleForm = {}
        this.getRoleslist()
      } else {
        this.$message.warning(msg)
      }
    },
    deleteRole (id) {
      this.$confirm('是否确定删除该角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`roles/${id}`, '')
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.showEditRole = false
          this.getRoleslist()
        } else {
          this.$message.warning(msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created () {
    this.getRoleslist()
  }
}
</script>

<style scoped>
  .card-box {
    height: 99%;
  }
  .breadCrumb {
    margin-bottom: 15px;
  }
  .roles-table {
    margin-top: 15px;
  }
  .addRole-dialog {
    padding-right: 25px;
  }
</style>
