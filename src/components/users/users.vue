<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <custom-bread level1="用户管理" level2="用户列表"></custom-bread>
    <!-- 搜索框 -->
    <el-row class="search-box">
      <el-col>
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model="query"
            @clear="searchUserslist" class="search-input" clearable>
            <el-button slot="append"
            icon="el-icon-search"
            @click="searchUserslist"></el-button>
          </el-input>
          <el-button type="success" plain @click="showAddUser = true">添加用户</el-button>
          <!-- 添加用户表单对话框 -->
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
        prop="id"
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
            inactive-color="#ff4949"
            @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑用户 -->
            <el-button type="primary"
              icon="el-icon-edit"
              size="small"
              plain
              circle
              @click="showEdit(scope.row)"></el-button>
              <el-dialog title="编辑用户" :visible.sync="showEditUser">
                <el-form :model="editUserForm" :rules="rules">
                  <el-form-item class="editForm" label="用户名" :label-width="editUserWidth">
                    <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
                  </el-form-item>
                  <el-form-item class="editForm" label="邮箱" prop="email" :label-width="editUserWidth">
                    <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item class="editForm" label="手机号" prop="phoneNumber" :label-width="editUserWidth">
                    <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="editUser(scope.row)">确 定</el-button>
                  <el-button @click="showEditUser = false">取 消</el-button>
                </div>
              </el-dialog>
            <!-- 修改用户角色 -->
            <el-button type="warning" icon="el-icon-s-tools" size="small" @click="showUserRole(scope.row)" plain circle></el-button>
            <el-dialog title="修改用户角色" :visible.sync="showChangeRole">
              <el-form :model="userRole">
                <el-form-item label="用户名" :label-width="changeRoleWidth">
                  <el-input v-model="currentUser" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" :label-width="changeRoleWidth">
                  <el-select v-model="userRole.rid" placeholder="请选择">
                    <el-option :label="item.roleName" :value="item.id"
                      v-for="(item) in roleslist" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changeUserRole">确 定</el-button>
                <el-button @click="showChangeRole = false">取 消</el-button>
              </div>
            </el-dialog>
            <el-button type="danger"
              class="delete-btn"
              icon="el-icon-delete"
              size="small"
              plain
              circle
              @click="deleteUser(scope.row.id)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
    <!-- 添加用户-对话框 -->
    <el-dialog title="添加用户" :visible.sync="showAddUser">
      <el-form :model="addUserForm" :rules="rules">
        <el-form-item class="addForm" label="用户名" prop="username" :label-width="addUserWidth">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="addForm" label="密码" prop="password" :label-width="addUserWidth">
          <el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="addForm" label="邮箱" prop="email" :label-width="addUserWidth">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="addForm" label="手机号" prop="phoneNumber" :label-width="addUserWidth">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确 定</el-button>
        <el-button @click="showAddUser = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '', // 查询参数
      pagenum: 1, // 当前页码，不能为空
      pagesize: 6, // 每页显示数，不能为空
      userslist: [], // 用户信息
      total: 0,
      showAddUser: false, // 添加用户对话框
      showEditUser: false,
      showChangeRole: false,
      addUserWidth: '100px',
      editUserWidth: '100px',
      changeRoleWidth: '100px',
      addUserForm: {// 添加用户-请求参数
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {// 编辑用户-请求参数
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userRole: {// 修改角色-请求参数
        id: 0,
        rid: ''
      },
      currentUser: '', // 当前用户名-table选中
      roleslist: [], // 修改角色-角色列表
      rules: {
        username: [{required: true, message: '用户名必须填写', trigger: 'blur'},
          {max: 20, message: '不能超过20个字符', trigger: 'blur'}],
        password: [{required: true, message: '请填写密码', trigger: 'blur'},
          {min: 6, max: 20, message: '密码需由6-20字符组成', trigger: 'blur'}],
        email: [{validator: this.checkEmail, trigger: 'blur'}],
        phoneNumber: [{validator: this.checkPhone, trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 获取用户列表信息
    async getUserList () {
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}
      &pagesize=${this.pagesize}`)
      const {meta: {status, msg}, data: {users, total}} = res.data
      if (status === 200) {
        this.userslist = users
        this.total = total
      } else {
        this.$message.warning(msg)
      }
    },
    // 更改每页展示数据数
    handleSizeChange (val) {
      this.pagesize = val
      this.getUserList()
    },
    // 更改当前页面
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    // 搜索+返回原页面（重新加载）
    searchUserslist () {
      this.getUserList()
    },
    // 添加用户-发送请求
    async addUser () {
      const res = await this.$http.post(`users`, this.addUserForm)
      const {meta: {status, msg}} = res.data
      console.log(res)
      if (status === 201) {
        this.addUserForm = {}
        this.showAddUser = false
        this.getUserList()
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 更改用户状态
    changeState (user) {
      this.$http.put(`users/${user.id}/state/${user.mg_state}`).then(res => {
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
        } else {
          this.$message.warning(msg)
        }
      })
    },
    // 编辑用户-展开对话框
    showEdit (userInfo) {
      this.currentUser = userInfo.id
      this.editUserForm.username = userInfo.username
      this.editUserForm.email = userInfo.email
      this.editUserForm.mobile = userInfo.mobile
      this.showEditUser = true
    },
    // 编辑用户-提交
    async editUser () {
      const res = await this.$http.put(`users/${this.currentUser}`, this.editUserForm)
      const {meta: {msg, status}} = res.data
      console.log(res)
      if (status === 200) {
        this.showEditUser = false
        this.getUserList()
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 修改用户权限-展示对话框
    async showUserRole (user) {
      // 请求-获取角色
      const res1 = await this.$http.get('roles', '')
      const {data, meta} = res1.data
      if (meta.status === 200) {
        this.roleslist = data
      }
      // 用户id->查找用户信息（rid）
      const res2 = await this.$http.get(`users/${user.id}`)
      this.currentUser = user.username
      this.userRole.id = user.id
      this.userRole.rid = res2.data.data.rid
      this.showChangeRole = true
    },
    // 修改用户权限-提交表单
    async changeUserRole () {
      const res = await this.$http.put(`users/${this.userRole.id}/role`, this.userRole)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.showChangeRole = false
        this.userRole = {}
        this.getUserList()
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 删除用户
    deleteUser (id) {
      this.$confirm('是否确定删除该用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${id}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message({
            type: 'success',
            message: msg
          })
        }
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    checkEmail (rule, value, callback) {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (value) {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }
    },
    checkPhone (rule, value, callback) {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (value) {
        if (Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('手机号格式不正确'))
          }
        }
      }
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style scoped>
  .box-card {
    height: 99%;
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
  .addForm, .editForm {
    margin-right: 50px;
  }
  .delete-btn {
    margin-left: 0;
  }
  .dialog-footer {
    margin-right: 50px;
  }
</style>
