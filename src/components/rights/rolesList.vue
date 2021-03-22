<template>
  <el-card class="card-box">
    <custom-bread class="breadCrumb" level1="权限管理" level2="角色列表"></custom-bread>
    <el-button type="primary" plain @click="showAddRole = true">添加角色</el-button>
    <el-table
      :data="roleslist"
      style="width: 100%"
      class="roles-table">
      <!-- 下拉表格-展示角色权限 -->
      <el-table-column type = "expand">
        <template slot-scope="scope" width ="150">
          <el-row class="level-1-row" v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag @close="deleteRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level-2-row" v-for="(item2,j) in item1.children" :key="j">
                <el-col :span="4">
                  <el-tag  type="success" @close="deleteRight(scope.row,item2.id)" closable>{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag type="warning" @close="deleteRight(scope.row,item3.id)" v-for="(item3,k) in item2.children" :key="k" closable>{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span class="tips" v-if="scope.row.children.length ===0">未给该角色分配权限</span>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="150">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="姓名"
        width="300">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showEdit(scope.row)" plain>编辑</el-button>
          <el-button type="warning" icon="el-icon-setting" @click="showDistributeRight(scope.row)" plain>修改权限</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)" plain>删除</el-button>
          <!-- 对话框-编辑角色 -->
          <el-dialog title="编辑角色" :visible.sync="showEditRole">
            <el-form :model="editRoleForm" :rules="rules" class="addRole-dialog">
              <el-form-item label="角色名称" prop="roleName" :label-width="editRoleWidth">
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
          <!-- 对话框-修改权限 -->
          <el-dialog class="edit-rights" title="修改权限" :visible.sync="showDistribute">
            <el-tree
              :data="rightsTree"
              show-checkbox
              node-key="id"
              ref="tree"
              :default-expanded-keys="expandNodes"
              :default-checked-keys="checkedRights"
              :props="rightsTreeChildren">
            </el-tree>
            <div slot="footer" class="dialog-footer">
              <el-button @click="showDistribute = false">取 消</el-button>
              <el-button type="primary" @click="distributeRight()">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框-添加角色 -->
    <el-dialog title="添加角色" :visible.sync="showAddRole">
      <el-form :model="addRoleForm" :rules="rules" class="addRole-dialog">
        <el-form-item label="角色名称" prop="roleName" :label-width="addRoleWidth">
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
      showDistribute: false,
      addRoleWidth: '100px',
      editRoleWidth: '100px',
      currentRoleId: '',
      rightsTree: [], // 修改权限-树形列表
      checkedRights: [], // 修改权限-已有（选中）权限
      expandNodes: [], // 修改权限-需展开的结点
      rules: { // 表单验证规则
        roleName: [{required: true, message: '角色名称不能为空', tigger: 'blur'}]
      },
      // 表单数据-添加角色对话框
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 表单数据-编辑角色对话框
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 请求数据-删除权限（下拉行）
      rightInfo: {
        roleId: '',
        rightId: ''
      },
      // 辅助渲染-修改权限
      rightsTreeChildren: {
        children: 'children',
        label: 'authName'
      },
      // 修改权限-赋予权限
      rightsChoose: {
        roleId: '',
        rids: ''
      }
    }
  },
  methods: {
    // 获取角色列表
    async getRoleslist () {
      const res = await this.$http.get('roles', '')
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.roleslist = data
      }
    },
    // 提交数据-添加角色
    async addRole () {
      const res = await this.$http.post('roles', this.addRoleForm)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.showAddRole = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 对话框-展示编辑角色
    showEdit (role) {
      this.currentRoleId = role.id
      this.editRoleForm.id = role.id
      this.editRoleForm.roleName = role.roleName
      this.editRoleForm.roleDesc = role.roleDesc
      this.showEditRole = true
    },
    // 提交数据-编辑角色
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
    // 修改权限-展示对话框
    async showDistributeRight (role) {
      this.currentRoleId = role.id
      // 清空历史
      this.expandNodes = []
      this.checkedRights = []
      // 获取权限数据
      const res = await this.$http.get(`rights/tree`)
      const {data, meta: {msg, status}} = res.data
      if (status === 200) {
        this.rightsTree = data
        // 获取所有已有权限id
        role.children.forEach(item1 => {
          // 若有二级权限，则展开一级菜单
          if (item1.children.length !== 0) {
            item1.children.forEach(item2 => {
              // 若有三级权限，则展开二级菜单
              if (item2.children.length !== 0) {
                item2.children.forEach(item3 => {
                  this.checkedRights.push(item3.id)
                  this.expandNodes.push(item2.id)
                })
                this.expandNodes.push(item1.id)
              } else {
                this.checkedRights.push(item2.id)
              }
            })
          } else {
            this.checkedRights.push(item1.id)
          }
        })
      } else {
        this.$message.warning(msg)
      }
      this.showDistribute = true
    },
    // 提交数据-修改权限
    async distributeRight () {
      // 获取全选的id
      let arr1 = this.$refs.tree.getCheckedKeys()
      // 获取半选的id
      let arr2 = this.$refs.tree.getHalfCheckedKeys()
      // 获取所有选中的id
      let arr = arr1.concat(arr2).join()
      this.rightsChoose.roleId = this.currentRoleId
      this.rightsChoose.rids = arr
      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, this.rightsChoose)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.showDistribute = false
        this.getRoleslist()
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 提交数据-删除角色
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
    },
    // 提交数据-删除权限
    async deleteRight (role, rightId) {
      this.rightInfo.roleId = role.id
      this.rightInfo.rightId = rightId
      // 请求路径：roles/:roleId/rights/:rightId
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`, this.rightInfo)
      const {data, meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
        // 渲染优化-更新当前角色的children
        role.children = data
      } else {
        this.$message.warning(msg)
      }
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
  .addRole-dialog {
    padding-right: 25px;
  }
  .level-1-row {
    margin-bottom: 10px;
  }
  .level-2-row {
    margin-bottom: 5px;
  }
  .tips {
    color: rgb(184, 177, 177);
  }
</style>
