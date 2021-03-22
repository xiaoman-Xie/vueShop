<template>
  <el-card class="box-card">
    <custom-bread level1="商品管理" level2="商品分类"></custom-bread>
    <el-button type="success" class="add-btn" @click="showAdd">添加商品分类</el-button>
    <el-table
      style="width: 100%"
      @expand-change="getCatelist(2)"
      :data="catelist1">
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称">
      </el-table-column> -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        folderIcon="">
      </el-tree-grid>
      <el-table-column
        label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if= "scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效">
        <template slot-scope="scope">
          <span v-if=scope.row.cat_deleted>有效</span>
          <span v-else>无效</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="showEdit(scope.row)" plain circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteCate(scope.row)" plain circle></el-button>
          <el-dialog title="编辑分类" :visible.sync="showEditCate">
            <el-form rules="rules">
              <el-form-item label="分类名称" prop="goodsName" label-width="80px">
                <el-input v-model="editCateName"></el-input>
              </el-form-item>
              <el-row class="dialog-footer">
                <el-button @click="showEditCate = false">取 消</el-button>
                <el-button type="primary" @click="editCate()">确 定</el-button>
              </el-row>
            </el-form>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <div class="page-block">
      <el-pagination
        :page-sizes="[5, 10, 15, 20]"
        :current-page="pagenum"
        :page-size="pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加分类" :visible.sync="showAddCate">
      <el-form v-model="addCateForm" :rules="rules">
        <el-form-item prop="goodsName" label="分类名称" label-width="80px">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item prop="cate" label="分类" label-width="80px">
          <el-cascader
            :options="options"
            :props="defaultProp"
            v-model="selectedOptions"
            :show-all-levels="false"
            clearable>
          </el-cascader>
          <span class="tips">不选择则默认添加到一级分类</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddCate = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
let ElTreeGrid = require('element-tree-grid')
export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 5,
      total: 0,
      catelist1: [],
      showAddCate: false, // 对话框-展示-添加分类
      showEditCate: false, // 对话框-展示-编辑分类,
      rules: {
        goodsName: [{required: true, message: '商品名称不能为空', trigger: 'blur'}]
      },
      addCateForm: { // 表单内容-添加分类
        cat_pid: -1,
        cat_name: '',
        cat_level: -1
      },
      // 级联选择框-相关数据
      options: [],
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      selectedOptions: [],
      currentCateId: 0,
      editCateName: ''
    }
  },
  created () {
    this.getCatelist(this.pagenum, this.pagesize)
  },
  methods: {
    // 请求数据-获取列表数据
    async getCatelist (pagenum, pagesize) {
      this.pagenum = pagenum
      this.pagesize = pagesize
      const res = await this.$http.get(`categories?pagenum=${pagenum}&pagesize=${pagesize}`)
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.total = data.total
        this.catelist1 = data.result
      }
    },
    async showAdd () {
      // 获取级联选择框数据
      const res = await this.$http.get(`categories?type=2`)
      if (res.data.meta.status === 200) {
        this.options = res.data.data
      }
      this.showAddCate = true
    },
    async addCate () {
      this.addCateForm.cat_level = this.selectedOptions.length
      let level = this.selectedOptions.length
      if (level === 0) {
        this.addCateForm.cat_pid = 0
      } else if (level === 1) {
        this.addCateForm.cat_pid = this.selectedOptions[0]
      } else {
        this.addCateForm.cat_pid = this.selectedOptions[1]
      }
      const res = await this.$http.post('categories', this.addCateForm)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.showAddCate = false
        this.selectedOptions = []
        this.addCateForm = {}
        this.getCatelist(this.pagenum, this.pagesize)
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getCatelist(this.pagenum, this.pagesize)
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCatelist(this.pagenum, this.pagesize)
    },
    showEdit (cate) {
      this.currentCateId = cate.cat_id
      this.editCateName = cate.cat_name
      this.showEditCate = true
    },
    async editCate () {
      let reqData = {
        id: this.currentCateId,
        cat_name: this.editCateName
      }
      const res = await this.$http.put(`categories/${this.currentCateId}`, reqData)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.showEditCate = false
        this.getCatelist(this.pagenum, this.pagesize)
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 删除分类
    deleteCate (cate) {
      this.$confirm('是否确定删除该分类', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`categories/${cate.cat_id}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.getCatelist(this.pagenum, this.pagesize)
          this.$message.success(msg)
        }
      })
    }
  },
  components: {
    ElTreeGrid
  }
}
</script>

<style scoped>
  .box-card {
    height: 99%;
  }
  .add-btn {
    margin: 15px 0;
  }
  .cascader-label {
    display: block;
    margin-bottom: 10px;
  }
  .page-block {
    margin-top: 10px;
  }
  .dialog-footer {
    text-align: right;
  }
  .tips {
    display: inline-block;
    color: #a7a4a4;
    margin-left: 10px;
  }
</style>
