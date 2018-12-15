<template>

  <div class="dashboard-container">
    <div class=" clearfix">
      <pan-thumb :image="avatar" style="float: left">提示:
        <pre>{{ tips }}</pre>
      </pan-thumb>
    </div>
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
    this.roleTips()
    // alert(this.$store.state.user.orgCount)
  },
  methods: {
    roleTips() {
      var email = 'EMail:' + this.$store.state.user.email + '。\n'
      var fullname = 'FULLNAME:' + this.$store.state.user.fullname + '。\n'
      var role = 'role:' + this.$store.state.user.role + '。\n'
      var type = 'type:' + this.$store.state.user.type + '。\n'
      var roles = 'roles:' + this.$store.state.user.roles + '。\n'
      this.tips = email + fullname + role + type + roles
    }
  }
}
</script>

