<template>
  <el-row :gutter="40" class="panel-group">
    <el-col v-show="showOrgButton()" :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="jumpRouter('organizations')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="组织" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('panel.organizations') }}</div>
          <count-to :start-val="0" :end-val= "this.$store.state.user.orgCount" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="jumpRouter('Customers')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="客户" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('panel.customers') }}</div>
          <count-to :start-val="0" :end-val= "this.$store.state.user.customerCount" :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="jumpRouter('products')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="产品" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('panel.products') }}</div>
          <count-to :start-val="0" :end-val= "this.$store.state.user.productCount" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="jumpRouter('Devices')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="设备" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t('panel.devices') }}</div>
          <count-to :start-val="0" :end-val= "this.$store.state.user.deviceCount" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  created() {
    // alert( this.$store.state.user.role )
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    jumpRouter(url) {
      this.$router.push({ path: '/' + url + '/index' })
    },
    showOrgButton() {
      if (this.$store.state.user.roles === 'webAdmin') {
        return true
      } else return false
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: rgb(86, 174, 224);
      }
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
