<template>
  <el-card class="box-card">
    <custom-bread class="breadCrumb" level1="商品管理" level2="商品列表"></custom-bread>
    <el-row class="search-box">
      <el-col>
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model="query"
            @clear="getGoodslist" class="search-input" clearable>
            <el-button slot="append"
            icon="el-icon-search"
            @click="getGoodslist"></el-button>
          </el-input>
          <el-button type="success" plain @click="$router.push({name: 'goodsAdd'})">添加商品</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="goodsData"
      style="width: 100%">
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        prop="goods_number"
        label="商品数量">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间">
        <template slot-scope="userslist">
          {{userslist.row.create_time | fmdate}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showEdit(scope.row)" plain circle></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteGood(scope.row)" plain circle></el-button>
          </el-row>
          <el-dialog :visible.sync="showEditGood">
            <el-form :data="editForm" :rules="rules">
              <el-form-item label="商品名称" prop="goodsName">
                <el-input v-model="editForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goodsPrice">
                <el-input v-model="editForm.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goodsNumber">
                <el-input v-model="editForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goodsWeight">
                <el-input v-model="editForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品介绍">
                <el-input v-model="editForm.goods_state"></el-input>
              </el-form-item>
              <el-row class="dialog-footer">
                <el-button @click="showEditGood = false">取 消</el-button>
                <el-button type="primary" @click="editReq()">确 定</el-button>
              </el-row>
            </el-form>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  created () {
    this.getGoodslist()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 5,
      total: 0,
      goodsData: [],
      showAddGood: false,
      showEditGood: false,
      currentGoodsId: 0,
      editForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_state: '',
        pics: {},
        attrs: []
      },
      rules: {
        goodsName: [{required: true, message: '商品名称不能为空', trigger: 'blur'}],
        goodsPrice: [{required: true, message: '商品价格不能为空', trigger: 'blur'}],
        goodsNumber: [{required: true, message: '商品数量不能为空', trigger: 'blur'}],
        goodsWeight: [{required: true, message: '商品重量不能为空', trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 请求数据-获取商品列表信息
    async getGoodslist () {
      const res = await this.$http.get(`goods/?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.total = data.total
        this.goodsData = data.goods
      }
    },
    // 分页条-改变页面条数
    handleSizeChange (val) {
      this.pagesize = val
      this.getGoodslist()
    },
    // 分页条-改变当前页面
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodslist()
    },
    showEdit (good) {
      this.currentGoodsId = good.goods_id
      this.editForm.goods_name = good.goods_name
      this.editForm.goods_price = good.goods_price
      this.editForm.goods_number = good.goods_number
      this.editForm.goods_weight = good.goods_weight
      this.showEditGood = true
    },
    // 提交数据-编辑商品
    async editReq () {
      const res = await this.$http.put(`goods/${this.currentGoodsId}`, this.editForm)
      console.log(res)
    },
    // 删除商品
    deleteGood (good) {
      this.$confirm('是否确定删除该商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`goods/${good.goods_id}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.getGoodslist()
          this.$message.success(msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  .box-card {
    height: 99%;
  }
  .search-input {
    width: 300px;
  }
  .dialog-footer {
    text-align: right;
  }
</style>
