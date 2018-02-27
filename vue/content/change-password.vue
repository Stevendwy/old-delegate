<template>
  <div class="change-password">
    <div class="found-password">
      <div class="title">修改密码</div>
      <div class="container-username">
        <div class="img"></div>
        <input ref="forgetUsername" type="text" placeholder="手机号" v-model="showUsername">
      </div>
      <div class="container-verification">
        <div class="img"></div>
        <input type="text" placeholder="验证码" v-model="showVerification">
        <div class="verification" @click="verificationClick">{{verificationContent}}</div>
      </div>
      <div class="container-password">
        <div class="img"></div>
        <input :type="passwordType" placeholder="新密码" v-model="showForgetPassword" @keyup.13="confirmChangePassword" @keyup.20="capsLockClick" @keydown.20="capsLockClick">
        <div v-show="capsLock" class="util-div lock"></div>
        <div :class="visualClass" @click="togglePsswordType"></div>
      </div>
      <button class="button-confirm" @click="confirmChangePassword">
        确认修改
        <img v-if="isLoading" class="loading" src="../../img/loading.gif" alt="loading">  
      </button>
    </div>
  </div>
</template>

<script>
import u from '../../js/utils'

export default {
  data() {
    return (
      {
        capsLock: false,
        verification: '', // 验证码
        username: '', // 用户名, 两边通用
        forgetPassword: '', // 忘记密码的密码
        isText: false, // 密码输入框状态
        verificationContent: '发送验证码', // 发送验证码处的显示内容
        verificationLock: false, // 发送验证码可执行判断, 默认未锁
        isLoading: false
      }
    )
  },
  mounted() {
    this.username = localStorage.getItem('ppy-delegate-username')
  },
  computed: {
    rememberClass() {
      return 'checkbox' + (this.isRemember ? ' redMark' : '')
    },
    showUsername: {
      get() {
        return this.username
      },
      set(value) {
        this.username = value
      }
    },
    showVerification: {
      get() {
        return this.verification
      },
      set(value) {
        this.verification = value
      }
    },
    showForgetPassword: {
      get() {
        return this.forgetPassword
      },
      set(value) {
        this.forgetPassword = value
        this.checkForgetPasswordUpper(value)
      }
    },
    passwordType() {
      this.visualClass = !this.isText ? 'util-div visual' : 'util-div visual open-eye'
      return this.isText ? 'text' : 'password'
    }
  },
  methods: {
    tryAny(callback) { // 防止可能出现的卡顿导致错误
      try{
        setTimeout(callback, 200)
      }catch(err) {
        console.log(err)
      }
    },
    confirmChangePassword() {
      this.isLoading = true
      u.post('/changepwd', {
        phone: this.username,
        sms_code: this.verification,
        password: this.forgetPassword
      }, res => {
        this.isLoading = false
        alert('修改成功')
        this.$router.push('/')
      })
      setTimeout(() => this.isLoading = false, 2000)
    },
    capsLockClick() {
      this.capsLock = !this.capsLock
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

      u.get('/changepwd_sms?phone=' + this.username, {}, res => {
        this.verificationLock = true
        let timer = 60
        this.verificationContent = timer + 's'

        let interval = setInterval(() => {
          timer--

          if(timer < 1) {
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


<style scoped lang='less'>
.change-password {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .spirit(@pY) {
    background: url(../../img/spirit.png) 0 @pY ~'/' 40px auto no-repeat;
  }

  .box {
    background: rgba(255,255,255,0.80);
    border-radius: 8px;
    width: 400px;
    height: 304px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 14px;
      color: #666;
      width: 100%;
      line-height: 39px;
      box-sizing: border-box;
      padding-left: 20px;
      border-bottom: 1px solid #d8d8d8;
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

  .button-confirm {
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
}
</style>
