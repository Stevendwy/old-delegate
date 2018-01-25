<script>
import u from '../js/utils'

String.prototype.trimAll = function() {
  return this.replace(/\s/g, '')
}

export default {
  data() {
    return (
      {
        foundState: false, // 是否为找回密码状态
        isRemember: false,
        capsLock: false,
        loginPasswordLength: 0, // 登录密码长度
        verification: '', // 验证码
        forgetPasswordLength: 0, // 找回密码密码长度
        username: '', // 用户名, 两边通用
        loginPassword: '', // 登录的密码
        forgetPassword: '', // 忘记密码的密码
        isText: false, // 密码输入框状态
        verificationContent: '发送验证码', // 发送验证码处的显示内容
        verificationLock: false, // 发送验证码可执行判断, 默认未锁
        isLoading: false //是否登录请求中
      }
    )
  },
  mounted() {
    this.tryAny(() => this.$refs.loginUsername.focus())
    this.username = localStorage.getItem('ppy-delegate-username') || ''
    this.loginPassword = localStorage.getItem('ppy-delegate-password') || ''
    if(this.username && this.username.length > 0) this.isRemember = true
  },
  watch: {
    username(value) {
      this.username = value.trimAll()
    },
    verification(value) {
      this.verification = value.trimAll()
    },
    loginPassword(value) {
      this.loginPassword = value.trimAll()
      this.checkLoginPasswordUpper(value)
    },
    forgetPassword(value) {
      this.forgetPassword = value.trimAll()
      this.checkForgetPasswordUpper(value)
    }
  },
  computed: {
    rememberClass() {
      return 'checkbox' + (this.isRemember ? ' redMark' : '')
    },
    passwordType() {
      this.visualClass = !this.isText ? 'util-div visual' : 'util-div visual open-eye'
      return this.isText ? 'text' : 'password'
    },
    loginRequest() {
      return {
        username: this.username,
        password: this.loginPassword
      }
    },
    changePasswordRequest() {
      return {
        phone: this.username,
        sms_code: this.verification,
        new_pwd: this.forgetPassword
      }
    }
  },
  methods: {
    toggleRemember() {
      this.isRemember = !this.isRemember
      if(this.isRemember) { // 保存密码
        localStorage.setItem('ppy-delegate-username', this.username)
        localStorage.setItem('ppy-delegate-password', this.loginPassword)
      }
      else { // 删除保存的密码
        localStorage.setItem('ppy-delegate-username', '')
        localStorage.setItem('ppy-delegate-password', '')
      }
    },
    goForget() {
      this.foundState=true
      this.tryAny(() => this.$refs.forgetUsername.focus())
    },
    goLogin() {
      this.foundState=false
      this.tryAny(() => this.$refs.loginUsername.focus())
    },
    tryAny(callback) { // 防止可能出现的卡顿导致错误
      try{
        setTimeout(callback, 200)
      }catch(err) {
        console.log(err)
      }
    },
    login() {
      if(this.username.length < 1) {
          alert('输入用户名')
          return
      }
      if(this.loginPassword.length < 1) {
          alert('输入密码')
          return
      }

      this.isLoading = true
      u.post('/login', this.loginRequest, function(res) {
          // location.href = "/delegate.html"
          location.href = "/"
      })

      setTimeout(() => this.isLoading = false, 2000)
    },
    confirmChangePassword() {
      this.isLoading = true
      u.post('/findpwd', this.changePasswordRequest, res => {
        alert('修改成功')
        this.isLoading = false
        this.goLogin()
      })
      setTimeout(() => this.isLoading = false, 2000)
    },
    capsLockClick() {
      this.capsLock = !this.capsLock
    },
    checkLoginPasswordUpper(value) {
      let _newLength = value.length
      if(_newLength < 1) this.capsLock = false
      else {
          // 文字长度有变化
          if(_newLength !== this.loginPasswordLength) {
              // 文字是新增
              if(_newLength > this.loginPasswordLength) {
                  let _capsReg = new RegExp(/[A-Z]/)
                  let _lastCar = value.replace(/.*(.)$/, '$1')
                  let _isUpper = _capsReg.test(_lastCar)
                  if(_isUpper) this.capsLock = true
                  else this.capsLock = false
              }
          }
      }
      this.loginPasswordLength = _newLength
    },
    checkForgetPasswordUpper(value) {
      let _newLength = value.length
      if(_newLength < 1) this.capsLock = false
      else {
          // 文字长度有变化
          if(_newLength !== this.forgetPasswordLength) {
              // 文字是新增
              if(_newLength > this.forgetPasswordLength) {
                  let _capsReg = new RegExp(/[A-Z]/)
                  let _lastCar = value.replace(/.*(.)$/, '$1')
                  let _isUpper = _capsReg.test(_lastCar)
                  if(_isUpper) this.capsLock = true
                  else this.capsLock = false
              }
          }
      }
      this.forgetPasswordLength = _newLength
    },
    togglePsswordType() {
      this.isText = !this.isText
    },
    verificationClick() {
      if(this.verificationLock) return

      u.get('/findpwd_sms', {phone: this.username}, res => {
        this.verificationLock = true
        let timer = 60
        this.verificationContent = timer + 's'

        let interval = setInterval(() => {
          timer--

          if(timer < 58) {
            this.verificationContent = '发送验证码'
            this.verificationLock = false
            clearInterval(interval)
          }else this.verificationContent = timer + 's'
        }, 1000)
      })
    }
  }
}
</script>

<template>
  <div class="app">
    <div class="login" v-if="!foundState">
      <span class="title">零零汽后台管理系统</span>
      <div class="container-username">
        <div class="img"></div>
        <input ref="loginUsername" type="text" placeholder="手机号" v-model="username">
      </div>
      <div class="container-password">
        <div class="img"></div>
        <input :type="passwordType" placeholder="密码" v-model="loginPassword" @keyup.13="login" @keyup.20="capsLockClick" @keydown.20="capsLockClick">
        <div v-show="capsLock" class="util-div lock"></div>
        <div :class="visualClass" @click="togglePsswordType"></div>
      </div>
      <div class="container-forget">
        <div class="forget">
          <div :class="rememberClass" @click="toggleRemember"></div>
          <span>记住密码</span>
        </div>
        <a class="go-forget" @click="goForget">忘记密码</a>
      </div>
      <button class="button-login" @click="login">
        登录
        <img v-if="isLoading" class="loading" src="../img/loading.gif" alt="loading">
      </button>
    </div>
    <div class="found-password" v-if="foundState">
      <span class="title">修改密码</span>
      <div class="container-username">
        <div class="img"></div>
        <input ref="forgetUsername" type="text" placeholder="手机号" v-model="username">
      </div>
      <div class="container-verification">
        <div class="img"></div>
        <input type="text" placeholder="验证码" v-model="verification">
        <div class="verification" @click="verificationClick">{{verificationContent}}</div>
      </div>
      <div class="container-password">
        <div class="img"></div>
        <input :type="passwordType" placeholder="新密码" v-model="forgetPassword" @keyup.13="confirmChangePassword" @keyup.20="capsLockClick" @keydown.20="capsLockClick">
        <div v-show="capsLock" class="util-div lock"></div>
        <div :class="visualClass" @click="togglePsswordType"></div>
      </div>
      <button class="button-login" @click="confirmChangePassword">
        确认修改
        <img v-if="isLoading" class="loading" src="../img/loading.gif" alt="loading">
      </button>
      <span class="go-login" @click="goLogin">立即登录</span>
    </div>
  </div>
</template>

<style scoped lang='less'>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(http://yun.youfan.pub/img/delegate-back.png) center center ~'/' cover no-repeat;

  .spirit(@pY) {
    background: url(../img/spirit.png) 0 @pY ~'/' 40px auto no-repeat;
  }

  .box {
    background: rgba(255,255,255,0.80);
    box-shadow: 0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24);
    border-radius: 8px;
    width: 320px;
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 16px;
      color: #333333;
      margin-top: 28px;
    }

    .account {
      width: 280px;
      height: 40px;
      box-sizing: border-box;
      background: #FFFFFF;
      border: 1px solid #D8D8D8;
      border-radius: 4px;
      display: flex;
      align-items: center;
      overflow: hidden;

      .img {
        width: 40px;
        height: 40px;
        box-sizing: border-box;
        border-right: 1px solid #D8D8D8;
        background-color: #f2f2f2;
        .spirit(0);
      }

      input {
        width: 237px;
        height: 40px;
        box-sizing: border-box;
        padding-left: 12px;
        font-size: 14px;
      }

      .util-div {
        position: absolute;
        top: 0;
        width: 40px;
        height: 40px;
        .spirit(0);
      }

      .lock {
        right: 40px;
        background-position: 0 -120px;
      }

      .visual {
        right: 0;
        background-position: 0 -40px;
        cursor: pointer;
      }

      .open-eye {
        background-position: 0 -80px;
      }
    }
  }

  .login {
    .box;

    .container-username {
      .account;
      margin-top: 30px;
    }

    .container-password {
      position: relative;
      margin-top: 20px;
      .account;

      .img {
        background-position: 0 -520px;
      }
    }

    .container-forget {
      width: 280px;
      height: 40px;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      * {
        font-size: 14px;
      }

      .forget {
        display: flex;
        align-items: center;

        .checkbox {
          position: relative;
          left: -10px;
          display: inline-block;
          width: 40px;
          height: 40px;
          .spirit(-200px);
          cursor: pointer;
        }

        .redMark {
          .spirit(-160px);
        }

        span {
          position: relative;
          left: -16px;
          color: #666;
        }
      }

      a {
        color: #F67A6E;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .button-login {
    position: relative;
    background-color: #F67A6E;
    width: 280px;
    height: 40px;
    font-size: 14px;
    color: white;
    outline: none;
    border: 0;
    margin: 0;
    padding: 0;
    box-shadow: inset 0 -3px 0 0 #E56B60;
    border-radius: 4px;
    cursor: pointer;

    .loading {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
    }

    &:hover {
      background-color: #f0665b;
    }

    &:active {
      background-color: #d45950;
    }
  }

  .found-password {
    .box;

    .container-username {
      .account;
      margin-top: 10px;
    }

    .container-verification {
      position: relative;
      margin-top: 20px;
      .account;

      .img {
        background-position: 0 -720px;
      }

      .verification {
        position: absolute;
        top: 10px;
        right: 0;
        width: 90px;
        line-height: 20px;
        text-align: center;
        background-position: 0 -120px;
        font-size: 14px;
        color: #f67a6e;
        border-left: 1px solid #f67a6e;
        cursor: pointer;
      }
    }
    
    .container-password {
      position: relative;
      margin-top: 20px;
      .account;

      .img {
        background-position: 0 -520px;
      }
    }

    .container-forget {
      width: 280px;
      height: 40px;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      * {
        font-size: 14px;
      }

      .forget {
        display: flex;
        align-items: center;

        .checkbox {
          position: relative;
          left: -10px;
          display: inline-block;
          width: 40px;
          height: 40px;
          .spirit(-200px);
          cursor: pointer;
        }

        .redMark {
          .spirit(-160px);
        }

        span {
          position: relative;
          left: -16px;
          color: #666;
        }
      }

      a {
        color: #F67A6E;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .button-login {
    position: relative;
    background-color: #F67A6E;
    width: 280px;
    height: 40px;
    font-size: 14px;
    color: white;
    outline: none;
    border: 0;
    margin: 0;
    padding: 0;
    box-shadow: inset 0 -3px 0 0 #E56B60;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;

    .loading {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
    }

    &:hover {
      background-color: #f0665b;
    }

    &:active {
      background-color: #d45950;
    }
  }

  .go-login {
    color: #f67a6e;
    font-size: 14px;
    margin-top: 10px;
    cursor: pointer;
  }
}
</style>
