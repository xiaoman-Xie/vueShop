<template>
  <el-card class="box-card">
    <custom-bread level1="商品管理" level2="分类参数"></custom-bread>
    <el-alert
      class="attention"
      title="注意：只允许为第三级分类设置相关参数"
      type="warning"
      :closable=false
      show-icon>
    </el-alert>
    <!-- 级联选择器 -->
    <span class="cascader-label">选择商品分类</span>
    <el-cascader
      :options="options"
      :props="defaultProp"
      v-model="selectedOptions"
      @change="handleChange"
      :show-all-levels="false"
      clearable>
    </el-cascader>
    <!-- tabs -->
    <el-tabs v-model="activeTabs">
      <el-tab-pane label="动态参数" name="first">
        <el-button type="primary" @click="showAddDyna">添加动态参数</el-button>
        <el-table
          :data="dynaParams">
          <!-- 表格下拉 -->
          <el-table-column type = "expand">
            <template slot-scope="scope">
              <el-tag v-for="(item) in scope.row.attr_vals" :key="item.attr_id"
                @close="deleteTags(scope.row,item)"
                style="display: inline-block; margin: 5px;"
                :closable="true">
                {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputTagVisible"
                  v-model="inputTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column
            type="index">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary" icon="el-icon-edit" @click="showEidtD(scope.row)" size="small" plain circle></el-button>
                <!-- 编辑参数对话框 -->
                <el-dialog title="编辑参数" :visible.sync="showEditDyna">
                  <el-form>
                    <el-form-item label="参数名称">
                      <el-input v-model="editParamName"></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="showEditDyna = false">取 消</el-button>
                    <el-button type="primary" @click="editDyna(scope.row)">确 定</el-button>
                  </span>
                </el-dialog>
                <el-button type="danger" @click="deleteParams(scope.row)" icon="el-icon-delete" size="small" plain circle></el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">
        <el-button type="primary" @click="showAddStatic">添加静态参数</el-button>
        <el-table
          :data="staticParams">
          <el-table-column
            type="index">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性值"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary" icon="el-icon-edit" @click="showEditS(scope.row)" size="small" plain circle></el-button>
                <el-dialog :visible.sync="showEditStatic">
                  <el-form v-model="editStaticForm">
                    <el-form-item label="参数名称">
                      <el-input v-model="editStaticForm.attr_name"></el-input>
                    </el-form-item>
                    <el-form-item label="参数值">
                      <el-input v-model="editStaticForm.attr_vals"></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="showEditStatic = false">取 消</el-button>
                    <el-button type="primary" @click="editStatic()">确 定</el-button>
                  </span>
                </el-dialog>
                <el-button type="danger" @click="deleteParams(scope.row)" icon="el-icon-delete" size="small" plain circle></el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 对话框-添加动态参数 -->
    <el-dialog
      title="添加分类参数"
      :visible.sync="showAddDialog1">
      <el-form v-model="addDynaForm">
        <el-form-item label="参数名称">
          <el-input v-model="addDynaForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="addDynaForm.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog1 = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框-添加静态参数 -->
    <el-dialog title="添加静态参数" :visible.sync="showAddDialog2">
      <el-form v-model="addStaticForm">
        <el-form-item label="参数名称">
          <el-input v-model="addStaticForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="参数值">
          <el-input v-model="addStaticForm.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog2 = false">取 消</el-button>
        <el-button type="primary" @click="addStatic()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      // 级联选择框渲染
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedOptions: [],
      reqCateId: '',
      currentParamId: '', // 当前（动/静）参数id
      dynaParams: [], // 动态参数
      staticParams: [], // 静态参数
      activeTabs: 'first', // 当前tabs
      inputTagVisible: false, // 添加tag时输入框
      inputTagValue: '',
      showAddDialog1: false, // 对话框-添加动态参数
      showAddDialog2: false, // 对话框-添加静态参数
      showEditDyna: false, // 对话框-编辑动态参数
      showEditStatic: false, // 对话框-编辑静态参数
      addDynaForm: { // 对话框-添加动态参数
        // id: this.reqParamsId,
        attr_name: '',
        attr_sel: 'many',
        attr_vals: ''
      },
      addStaticForm: {
        attr_name: '',
        attr_sel: 'only',
        attr_vals: ''
      },
      editParamName: '', // 新参数名
      editStaticForm: {
        attr_name: '',
        attr_vals: ''
      },
      reqForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      }
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    // 请求数据-获取三级分类表
    async getGoodsCate () {
      const res = await this.$http.get('categories?type=3')
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 选择分类
    async handleChange () {
      this.reqCateId = this.selectedOptions[2]
      const res1 = await this.$http.get(`categories/${this.reqCateId}/attributes?sel=many`)
      if (res1.data.meta.status === 200) {
        this.dynaParams = res1.data.data
        this.dynaParams.forEach((item) => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
      }
      const res2 = await this.$http.get(`categories/${this.reqCateId}/attributes?sel=only`)
      if (res2.data.meta.status === 200) {
        this.staticParams = res2.data.data
      }
    },
    // 请求-编辑动静态参数
    async reqEditParams (attr, sel) {
      // 更新参数名
      this.reqForm.attr_name = attr.attr_name
      if (sel === 'many') {
        this.reqForm.attr_sel = 'many'
        this.reqForm.attr_vals = attr.attr_vals.join(',')
      } else {
        this.reqForm.attr_sel = 'only'
      }
      const res = await this.$http.put(`categories/${this.reqCateId}/attributes/${attr.attr_id}`, this.reqForm)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 删除tags-动态参数
    // eslint-disable-next-line
    deleteTags (attr, tag) {
      let ind = attr.attr_vals.findIndex((item) => {
        return item === tag
      })
      attr.attr_vals.splice(ind, 1)
      this.reqEditParams(attr, 'many')
    },
    showInput () {
      this.inputTagVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // 添加tag
    // eslint-disable-next-line
    handleInputConfirm (attr) {
      let inputValue = this.inputTagValue
      if (inputValue) {
        attr.attr_vals.push(inputValue)
      }
      this.reqEditParams(attr, 'many')
      this.inputTagVisible = false
      this.inputTagValue = ''
    },
    showAddDyna () {
      if (this.reqCateId !== '') {
        this.showAddDialog1 = true
      } else {
        this.$message.warning('请先选择商品分类')
      }
    },
    // 对话框-添加分类参数
    async addCate () {
      const res = await this.$http.post(`categories/${this.reqCateId}/attributes`, this.addDynaForm)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.showAddDialog = false
        this.addDynaForm = {}
        this.handleChange()
      } else {
        this.$message.warning(msg)
      }
    },
    // 删除分类
    deleteParams (attr) {
      this.$confirm('是否确定删除该分类', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`categories/${attr.cat_id}/attributes/${attr.attr_id}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
        } else {
          this.$message.warning(msg)
        }
        this.handleChange()
      })
    },
    showEidtD (attr) {
      this.currentParamId = attr.attr_id
      this.editParamName = attr.attr_name
      this.showEditDyna = true
    },
    async editDyna () {
      this.reqForm.attr_name = this.editParamName
      this.reqForm.attr_sel = 'many'
      const res = await this.$http.put(`categories/${this.reqCateId}/attributes/${this.currentParamId}`, this.reqForm)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
      this.showEditDyna = false
      this.handleChange()
    },
    // 对话框-添加静态参数-展示
    showAddStatic () {
      if (this.reqCateId !== '') {
        this.showAddDialog2 = true
      } else {
        this.$message.warning('请先选择商品分类')
      }
    },
    // 对话框-添加静态参数-提交
    async addStatic () {
      const res = await this.$http.post(`categories/${this.reqCateId}/attributes`, this.addStaticForm)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.showAddDialog2 = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
      this.handleChange()
    },
    showEditS (attr) {
      this.currentParamId = attr.attr_id
      this.editStaticForm.attr_name = attr.attr_name
      this.editStaticForm.attr_vals = attr.attr_vals
      this.showEditStatic = true
    },
    async editStatic () {
      this.reqForm.attr_name = this.editStaticForm.attr_name
      this.reqForm.attr_sel = 'only'
      this.reqForm.attr_vals = this.editStaticForm.attr_vals
      const res = await this.$http.put(`categories/${this.reqCateId}/attributes/${this.currentParamId}`, this.reqForm)
      const {meta: {msg, status}} = res.data
      console.log(res)
      if (status === 200) {
        this.showEditStatic = false
        this.handleChange()
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style scoped>
  .box-card {
    height: 99%;
  }
  .attention {
    margin: 20px 0;
  }
  .cascader-label {
    color: grey;
    font-size: 15px;
    margin-right: 10px;
  }
  .tabs {
    margin-top: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
