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
            @click="searchGoods"></el-button>
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
        label="商品名称"
        width="500">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goods_number"
        label="商品数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间">
      </el-table-column>
      <el-table-column
        label="操作">
      </el-table-column>
    </el-table>
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
      showAddGood: false,
      getData: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },
      goodsData: []
    }
  },
  methods: {
    // 请求数据-获取商品列表信息
    async getGoodslist () {
      const res = await this.$http.get(`goods/?pagenum=${this.getData.pagenum}&pagesize=${this.getData.pagesize}`)
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.goodsData = data.goods
      }
    },
    // 请求数据-查询商品
    searchGoods () {

    }
    // 提交数据-添加商品
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
</style>
