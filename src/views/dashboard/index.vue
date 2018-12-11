<template>

  <div class="dashboard-container">
    <div class=" clearfix">
      <pan-thumb :image="avatar" style="float: left">权限提示:
        <span >{{ tips }}</span>
      </pan-thumb>
    </div>
    <component :is="currentRole"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import { getToken } from '@/utils/auth'
import PanelGroup from './components/PanelGroup'

export default {
  name: 'Dashboard',
  components: {
    adminDashboard,
    PanelGroup
  },
  data() {
    return {
      currentRole: 'editorDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.includes('admin')) {
      this.currentRole = 'adminDashboard'
    } else {
      this.currentRole = 'PanelGroup'
    }
    this.roleTips()
  },
  methods: {
    roleTips() {
      var role = '权限是:' + getToken('Admin-Token') + '。'
      var own
      if (getToken('Admin-Token') === 'webAdmin') {
        own = '您能管理：all'
      } else if (getToken('Admin-Token') === 'organizationAdmin') {
        own = '您是组织管理员：' + getToken('myOwnOrganization')
      } else if (getToken('Admin-Token') === 'customerAdmin') {
        own = '您是客户管理员：' + getToken('myOwnCustomer')
      } else {
        own = '您不是管理员'
      }
      this.tips = role + own
    }
  }
}
</script>

