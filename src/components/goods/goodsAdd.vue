<template>
  <el-card class="box-card">
    <custom-bread class="breadCrumb" level1="商品管理" level2="商品列表"></custom-bread>
    <el-alert class="tips" title="请添加商品信息" type="info" :closable="false" show-icon center>
    </el-alert>
    <el-steps class="steps" :active="parseInt(step_active)" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form :model="goods_form" class="good-forms" label-width="80px">
      <el-tabs v-model="step_active" @tab-click="tabChange()" class="tabs" tab-position="left">
          <el-tab-pane name="1" label="基本信息">
            <el-form-item label="商品名称">
              <el-input v-model="goods_form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goods_form.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goods_form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goods_form.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :options="options"
                :props="defaultProp"
                v-model="selectedOptions"
                clearable>
              </el-cascader>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="基本参数">
          <el-form-item v-for="(item1,i) in dynaParams" :label="item1.attr_name" :key="i">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox v-for="(item2,i) in item1.attr_vals" :label="item2" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item class="static-params" style="float:none" v-for="(item, i) in staticParams" :key="i">
            <p class="static-params-label">{{item.attr_name}}</p>
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-upload
            class="upload-container"
            :headers="headers"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <!-- 富文本编辑器 -->
            <quill-editor v-model="goods_form.goods_introduce"></quill-editor>
            <el-button @click="addGoods" class="admit-btn" type="primary">添加商品</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  data () {
    return {
      step_active: '1',
      goods_form: {
        goods_name: '',
        goods_cat: '', //
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [], //
        attrs: [] //
      },
      // 级联选择器绑定的数据
      options: [], // 可选项
      selectedOptions: [], // 选中项
      defaultProp: { // 匹配label与value
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      dynaParams: [], // 动态参数
      selectedDyna: [], // 选中的动态参数
      staticParams: [], // 静态参数
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    // 点击事件-切换不同tab
    async tabChange () {
      // 若点击第二个（商品参数）tab，且三级分类有值
      if (this.step_active === '2') {
        // 商品分类未选三级，则提示
        if (this.selectedOptions.length !== 3) {
          this.$message.warning('请先选择三级商品分类')
        } else {
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
          this.dynaParams = res.data.data
          this.dynaParams.forEach((item) => {
            item.attr_vals = (item.attr_vals.length === 0) ? [] : item.attr_vals = item.attr_vals.split(',')
          })
        }
      } else if (this.step_active === '3') {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning('请先选择三级商品分类')
        }
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
        this.staticParams = res.data.data
      }
    },
    async getGoodsCate () {
      const res = await this.$http.get('categories?type=3')
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 上传图片相关方法
    // 预览
    handlePreview (file) {

    },
    // 图片上传-移除（表单数据处理）
    handleRemove (file) {
      // 将图片从goods_form中移除
      let ind = this.goods_form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      this.goods_form.pics.splice(ind, 1)
    },
    // 图片上传-添加（表单数据处理）
    handleSuccess (file) {
      // 将图片加到goods_form中
      this.goods_form.pics.push({
        pic: file.data.tmp_path
      })
    },
    async addGoods () {
      // 处理goods_cat
      this.goods_form.goods_cat = this.selectedOptions.join(',')
      // 处理attrs
      this.dynaParams.forEach((item) => {
        item.attr_vals = item.attr_vals.join(',')
      })
      let attrs = this.staticParams.concat(this.dynaParams)
      this.goods_form.attrs = attrs
      const res = await this.$http.post(`goods`, this.goods_form)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.$router.push('/goods')
      } else {
        this.$message.warning(msg)
      }
    }
  },
  components: {
    quillEditor
  }
}
</script>

<style scoped>
  .box-card {
    height: 99%;
  }
  .tips {
    margin: 20px 0;
  }
  .steps {
    padding: 10px 110px;
  }
  .good-forms {
    height: 400px;
    overflow: auto;
  }
  .static-params-label {
    margin: 0;
    color: grey;
  }
  .upload-container {
    margin: 20px;
  }
  .ql-editor {
    min-height: 200px;
  }
  .admit-btn {
    float: right;
  }
  .quill-editor {
    margin-bottom: 20px;
  }
</style>
