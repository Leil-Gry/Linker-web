<template>
  <el-container class="app">
    <el-aside width="400px">
      <el-row type="flex">
        <el-col :span="24" class="aside-title"><i class="el-icon-setting"/> 配置项</el-col>
      </el-row>
      <!-- 表单 -->
      <el-form ref="ruleform" :model="ruleform" :rules="rules" label-position="top" label-width="80px">
        <el-form-item label="用户UIE:" prop="UIE">
          <!-- 选择用户UIE -->
          <el-select
            v-model="ruleform.UIE"
            filterable
            clearable
            multiple
            collapse-tags
            placeholder="请选择用户UIE"
          >
            <el-option
              v-for="item in UIEOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- 选择数据项 -->
        <el-form-item label="数据项:" prop="dataItem">
          <el-select
            v-model="ruleform.dataItem"
            filterable
            clearable
            multiple
            collapse-tags
            placeholder="请选择数据项"
          >
            <el-option
              v-for="item in DataOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- 数据项条数 -->
        <!-- 选择时间 -->
        <el-form-item label="时间段:" prop="dateRange">
          <el-row>
            <el-date-picker
              v-model="dateRange"
              :picker-options="pickerOptions"
              type="datetimerange"
              range-separator="-"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"/>
          </el-row>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item class="down-item">
          <el-button type="primary" class="two-btn" icon="el-icon-success" @click="submitForm('ruleform')">确定</el-button>
          <el-button icon="el-icon-error" class="two-btn" @click="resetForm('ruleform')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-aside>
    <!-- chart主体 -->
    <el-container>
      <el-main>
        <div :id= "id" :style= "{height:height,width:width}" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import UIEOptions from '../../../static/tempData/UIE.json'
import DataOptions from '../../../static/tempData/Data.json'
import { getDeviceData } from '@/api/allData'

export default {
  name: 'Chart',
  props: {
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '600px'
    }
  },
  data() {
    return {
      chart: '',
      ruleform: {
        UIE: [],
        dataItem: [],
        dateBegin: '',
        dateEnd: ''
      },
      dateRange: '',
      UIEOptions: UIEOptions,
      DataOptions: DataOptions,
      rules: {
        UIE: [
          { required: true, message: '请选择至少一个用户UIE', trigger: 'change' }
          // {validator: validUIE, trigger: 'change'}
        ],
        dataItem: [
          { required: true, message: '请选择至少一个用户UIE', trigger: 'change' }
          // {validator: validDataItem, trigger: 'change'}
        ],
        dateRange: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ]
      },
      optioncheck: 0, // option set is done
      option: {
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter',
            start: 0,
            end: 30
          },
          {
            id: 'dataZoomY',
            type: 'slider',
            yAxisIndex: [0],
            filterMode: 'none'
          }],
        grid: { // 直角坐标系内绘图网格
          show: true,
          // borderColor:"#409EFF",//网格的边框颜色
          bottom: '20%'
        },
        title: {
          text: '数据'
        },
        toolbox: {
          show: true,
          right: 120,
          itemSize: 20,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [] // "液位", "压强"
        },
        xAxis: {
          type: 'category',
          data: [], // "2018-2-3 18:22:00", "2018-2-3 18:22:00", "2018-2-3 18:22:00", "2018-2-3 18:22:00", "2018-2-3 18:22:00", "2018-2-3 18:22:00"
          axisLabel: {
            interval: 0,
            rotate: '45'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: []
        // {
        //     name: "液位",
        //     type: "line",
        //     stack: "液位",
        //     data: [5, 20, 36, 10, 10, 1000]
        //   },
        //   {
        //     name: "压强",
        //     type: "line",
        //     stack: "压强",
        //     data: [6, 7, 6, 100, 120, 1200]
        //   }
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            console.log(picker)
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {

  },
  watch: {
    // 观察option的变化
    option: {
      handler(newVal, oldVal) {
        if (this.chart) {
          if (this.optionCheck) {
            this.chart.setOption(newVal)
          } else {
            this.chart.setOption(oldVal)
          }
        } else {
          this.init()
        }
      },
      deep: true // 对象内部属性的监听， 深度监听
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
      this.chart.setOption(this.option)
      window.addEventListener('resize', this.chart.resize)
    },
    // 替换指定位置字符
    replaceCharAt(str, n, c) {
      return str.substr(0, n) + c + str.substring(n + 2, str.length - 5)
    },
    getRes(res) {
      this.setSeries(res)
      if (res.data.flag == 0) {
        for (var i = 0; i < res.data.result.length; i++) {
          this.option.xAxis.data.push(this.replaceCharAt(res.data.result[i].time, 10, ' '))
          for (let key in res.data.result[i]) {
            for (let j = 0; j < this.option.series.length; j++) {
              if (key == this.option.series[j].stack) {
                this.option.series[j].data.push(res.data.result[i][key])
              }
            }
          }
        }
      } else {
        for (let i = 0; i < res.data.result[0].length; i++) {
          this.option.xAxis.data.push(this.replaceCharAt(res.data.result[0][i].time, 10, ' '))
        }
        for (let key in res.data.result[0][0]) {
          if (key.charAt(0) == 'd') {
            var dItem = key
          }
        }
        for (let i = 0; i < this.option.series.length; i++) {
          for (var j = 0; j < res.data.result[i].length; j++) {
            this.option.series[i].data.push(res.data.result[i][j][dItem])
          }
        }
        console.log(this.option)
      }
      this.optioncheck = 1
    },
    setSeries(res) {
      var scount = 0
      if (res.data.flag == 0) {
        // 一个UIE对应多个数据项
        for (let key in res.data.result[0]) {
          if (key.charAt(0) == 'd') {
            this.option.series[scount] = { name: key, type: 'line', stack: key, data: [] }
            this.option.legend.data.push(key)
            scount++
          }
        }
      } else {
        // 一个数据项对应多个UIE
        for (var i = 0; i < res.data.result.length; i++) {
          this.option.series[scount] = { name: res.data.result[i][0].sim, type: 'line', stack: res.data.result[i][0].sim, data: [] }
          this.option.legend.data.push(res.data.result[i][0])
          scount++
        }
      }
    },
    clearOption() {
      this.option.series = []
      this.option.xAxis.data = []
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleform.dateBegin = this.dateRange[0]
          this.ruleform.dateEnd = this.dateRange[1]
          this.chart.showLoading()
          getDeviceData(this.ruleform).then(res => {
            this.clearOption()
            this.chart.hideLoading()
            this.getRes(res)
          }, err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dateRange = ''
    }
  }
}
</script>

<style>
  .el-container {
    height: 100%;
  }

  .el-aside {
    background-color: #FFFFFF;
    color: #333;
    border-right: 1px solid #D3DCE6;
    padding-top: 30px;
  }

  .el-main {
    background-color: #FAFAFA;
    color: #333;
  }

  .down-item {
    margin-top: 30px;
  }

  .aside-title {
    font-size: 23px;
    margin-bottom: 25px;
  }

  .two-btn {
    width: 102px;
  }

  .el-form-item__content .el-input__inner {
    width: 370px;
  }

  .el-form-item__error {
    margin-left: 40px;
  }
  .app{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding:0px;
    margin:0px;
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
  }
</style>

