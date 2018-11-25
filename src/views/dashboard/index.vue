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
import editorDashboard from './editor'
import webAdminDashboard from './webAdmin'
import organizationAdminDashboard from './organizationAdmin'
import customerAdminDashboard from './customerAdmin'
import {getToken} from '@/utils/auth'

export default {
  name: 'Dashboard',
  components: {
    adminDashboard,
    editorDashboard,
    webAdminDashboard,
    organizationAdminDashboard,
    customerAdminDashboard
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
    }
    else if(this.roles.includes('webAdmin')){
      this.currentRole = 'webAdminDashboard'
    }
    else if(this.roles.includes('organizationAdmin')) {
      this.currentRole = 'organizationAdminDashboard'
    }
    else if(this.roles.includes('customerAdmin')){
      this.currentRole = 'customerAdminDashboard'
    }

    this.roleTips()
  },
  methods:{
    roleTips(){
      var role = '权限是:'+getToken('Admin-Token')+'。'
      var own
      if(getToken('Admin-Token')=='webAdmin'){
        own = '您能管理：all'
      }
      else if(getToken('Admin-Token')=='organizationAdmin'){
        own = '您是组织管理员：'+getToken('myOwnOrganization')
      }
      else if(getToken('Admin-Token')=='customerAdmin'){
        own = '您是客户管理员：'+getToken('myOwnCustomer')
      }
      else{
        own = '您不是管理员'
      }
      this.tips = role + own
    }
  },
}
</script>
