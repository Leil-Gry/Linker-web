<template>
  <el-container>
    <!-- chart主体 -->
    <el-container>
      <el-main><div :id = "id" :style = "style"/></el-main>
    </el-container>
  </el-container>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Chart',
  data() {
    return {
      chart: null
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.chart = echarts.init(document.getElementById(this.id))
    }
  }
}
</script>

