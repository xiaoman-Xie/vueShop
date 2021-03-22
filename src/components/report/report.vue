<template>
  <el-card>
    <custom-bread class="my-bread" level1="数据统计" level2="数据报表"></custom-bread>
    <div id="main" style="width: 700px;height:500px"></div>
  </el-card>
</template>

<script>
let echarts = require('echarts')
export default {
  data () {
    return {

    }
  },
  mounted () {
    this.useEchart()
  },
  methods: {
    async useEchart () {
      let myChart = echarts.init(document.getElementById('main'))
      const res = await this.$http.get(`reports/type/1`)
      let option2 = res.data.data
      let option1 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
      let option = {...option1, ...option2}
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.my-bread {
  margin-bottom: 15px;
}
</style>
