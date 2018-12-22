<template>
  <div class="dashboard-container">
    <div class="dashboardTips">
      <span class="roles">{{ this.$store.state.user.roles[0] }}</span>
      <span class="fullname">{{ this.$store.state.user.fullname }}</span>
    </div>
    <img src="https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3" class="emptyGif">
    <component :is="currentRole"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup
  },
  data() {
    return {
      currentRole: ''
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.currentRole = 'PanelGroup'
    // alert(this.$store.state.user.orgCount)
  },
  methods: {
  }
}
</script>

<style>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}
.dashboard-container{
  background-color: #e3e3e3;
}
.dashboardTips{
  width: 200px;
  margin: 0 20px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;
}
.fullname{
  font-size: 20px;
  padding-top: 20px;
  display: inline-block;
  line-height: 200px;
}
.roles{
  font-size: 48px;
  line-height: 48px;
  color: #212121;
  position: absolute;
  top: 25px;
}

</style>
