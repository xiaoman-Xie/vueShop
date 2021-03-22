<template>
  <el-card class="box-card">
    <custom-bread level1="订单管理" level2="订单列表"></custom-bread>
    <el-table
      :data="orderlist"
      style="width: 100%">
      <el-table-column
        type="index">
      </el-table-column>
      <!-- 表格下拉 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="客户类型">
              <span>{{ scope.row.order_fapiao_title }}</span>
            </el-form-item>
            <el-form-item  v-if="scope.row.order_fapiao_title === '公司'" label="公司名">
              <span>{{scope.row.order_fapiao_title}}</span>
            </el-form-item>
            <el-form-item label="订单地址">
              <span>{{scope.row.consignee_addr}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格">
      </el-table-column>
      <el-table-column
        prop="order_pay"
        label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay === 1" type="success">已付款</el-tag>
          <el-tag v-else type="warning">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间">
        <template slot-scope="scope">
          {{scope.row.create_time | fmdate}}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="showEdit(scope.row)" plain circle></el-button>
          <!-- 对话框-修改订单 -->
          <el-dialog title="修改订单地址" :visible.sync="showEditAddress">
            <el-form :model="editForm">
              <el-form-item label="省市区" label-width="80px">
                <el-cascader
                  :options="arealist"
                  :props="defaultProp"
                  :show-all-levels="false"
                  clearable>
                </el-cascader>
              </el-form-item>
              <el-form-item label="详细地址" label-width="80px">
                <el-input v-model="editForm.detail"></el-input>
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
import arealist from '../../assets/js/city_data2017_element'
export default {
  data () {
    return {
      orderlist: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      reqData: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      editForm: {
        detail: ''
      },
      arealist, // 上方引入中国省份数据
      showEditAddress: false,
      defaultProp: {
        label: 'label',
        value: 'value',
        children: 'children'
      }
    }
  },
  created () {
    this.getOrderlist()
  },
  methods: {
    async getOrderlist () {
      const res = await this.$http.get(`orders?pagenum=${this.reqData.pagenum}&pagesize=${this.pagesize}`)
      const {data, meta: {msg, status}} = res.data
      if (status === 200) {
        this.orderlist = data.goods
        this.total = data.total
      } else {
        this.$message.warning(msg)
      }
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getOrderlist()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getOrderlist()
    },
    showEdit (order) {
      this.showEditAddress = true
    },
    editReq () {

    }
  }
}
</script>

<style scoped>
  .box-card {
    height: 99%;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .dialog-footer {
    text-align: right;
  }
</style>
