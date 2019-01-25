<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <lang-select class="set-language"/>
      </div>
      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.email"
          :placeholder="$t('login.email')"
          name="email"
          type="text"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item v-show="captchaShowFlag" id="captcha" prop="captcha">
        <div class="v-center">
          <el-input
            v-model="loginForm.captcha"
            :placeholder="$t('login.captcha')"
            name="captcha"
            type="text"
          />
          <img
            :src= "captchaUrl"
            class="captcha-img"
            type= "image"
            @click="setNewCaptcha"
          >
        </div>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { validateEmail } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    const isvalidateEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    const isvalidatePassword = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const isvalidateCaptcha = (rule, value, callback) => {
      if (value == '' && this.captchaShowFlag) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        email: 'multi@dev.com',
        password: '123456',
        captcha: ''
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: isvalidateEmail }],
        password: [{ required: true, trigger: 'blur', validator: isvalidatePassword }],
        captcha: [{ required: this.captchaShowFlag, trigger: 'blur', validator: isvalidateCaptcha }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      captchaShowFlag: false,
      captchaUrl: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }

  },
  created() {

  },
  destroyed() {

  },
  methods: {
    showPwd() {
      if (this.passwordType == 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(error => {
            if (error.response.status == 400) { // 显示验证码
              this.setCaptcha(error.response.data)
              this.loginForm.captcha = ''
              this.captchaShowFlag = true
            } else if (error.response.status == 401) {
              this.$message.error({
                message: '用户名或密码错误，登录失败'
              })
              this.loginForm.password = ''
              this.loginForm.captcha = ''
              this.captchaShowFlag = false
            } else if (error.response.status == 429) {
              this.$message.error({
                message: '登录失败次数过多，请稍候再试'
              })
              this.loginForm.captcha = ''
              this.captchaShowFlag = false
            }
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    setCaptcha(baseImgUrl) {
      this.captchaUrl = 'data:image/png;base64,' + baseImgUrl
      console.log(this.captchaUrl)
    },
    setNewCaptcha() {
      this.loginForm.captcha = ''// 置空防止已经输入验证码的时候点击刷新会提交输入的值
      this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
      }).catch(error => {
        if (error.response.status == 400) { // 400则正常，更新验证码
          this.setCaptcha(error.response.data)
        } else {
          this.$message.error({
            message: '更新验证码错误，请检查用户名密码'
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  .captcha-img {
    width: 70%;
    float: left;
  }
  .v-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
