<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">

      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>
        <h4 class="right-menu-item welcome">欢迎 {{ this.$store.state.user.email+','+this.$store.state.user.fullname }}</h4>
        <!-- <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip> -->

        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip> -->

        <lang-select class="international right-menu-item"/>

        <!-- <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip> -->
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <svg-icon icon-class="头像" class="user-avatar"/>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a> -->
          <el-dropdown-item v-show="this.$store.state.user.roles.length>1" divided>
            <span style="display:block;" @click="handleChangeCurrentRoles">{{ $t('navbar.changeRoles') }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <el-dialog
        :visible.sync="changeRolesdialogVisible"
        title= "切换权限"
        width="50%">
        <el-row class="panel-group">
          <el-col v-for="item in allRoles" :xs="12" :sm="12" :lg="12" :key="item" class="card-panel-col" >
            <div class="card-panel" @click="changeCurrentRoles(item)">
              <div class="card-panel-icon-wrapper">
                <svg-icon icon-class="客户" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">{{ item }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import { setCookie } from '@/utils/auth' // getToken from cookie
import router from '@/router'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data() {
    return {
      changeRolesdialogVisible: false,
      allRoles: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    handleChangeCurrentRoles() {
      for (var i = 0; i < this.$store.state.user.roles.length; i++) { // 二维数组转一维数组，不知道为什么存的时候只能存二维，如果存一维的话，.some()函数用不了
        this.allRoles[i] = this.$store.state.user.roles[i][0]
      }
      this.changeRolesdialogVisible = true
    },
    changeCurrentRoles(selectRole) {
      var tempRole = []
      tempRole[0] = selectRole
      this.$store.dispatch('GenerateRoutes', tempRole).then(() => { // 根据roles权限生成可访问的路由表
        router.addRoutes(this.$store.getters.addRouters) // 动态添加可访问路由表
      })
      this.changeRolesdialogVisible = false
      this.$store.state.user.currentRoles = tempRole
      setCookie('changedCurrentRoles', selectRole)
      router.push({
        path: '/'
      })
      location.reload() // 为了清空打开的标签页，没找到更好的办法，刷新一下就没了
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .welcome{
      vertical-align: top;
      font-family: 微软雅黑;
      color:gray
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    border-radius: 10px;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(39, 38, 38, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: rgb(28, 85, 117);
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
        text-align: right;
        line-height: 18px;
        color:#666;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-subText{
        line-height: 18px;
        color: darkgray;
        font-size: 12px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
