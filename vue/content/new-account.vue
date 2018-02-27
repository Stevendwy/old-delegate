<template>
  <div class="container-new-account">
    <div class="new-account">
      <div class="new-account-title">开通账户</div>
      <div class="new-account-input"
        v-for="(title, index) in titles" :key="title">
        <div class="new-account-input-title">{{title}}</div>
        <div class="new-account-input-point">*</div>
        <input class="new-account-input-account" type="text" v-model="showAccount[titleEns[index]]"
          :placeholder="placeholders[index]"
          @focus="check(index)">
      </div>

      <div class="new-account-input">
        <div class="new-account-input-title">选择城市</div>
        <div class="new-account-input-point">*</div>
        <div class="new-account-input-city">
          <n-city @backcode="backCode"></n-city>
        </div>
      </div>

      <div class="new-account-input">
        <div class="new-account-input-title">类型</div>
        <div class="new-account-input-point" style="margin-right: 6px">*</div>
        <div class="new-account-input-span">
            <span class="new-account-input-container-radio"
            v-for="type in types" :key="type">
            <input type="radio" name="type" :checked="type === account['类型']" :value="type" v-model="account.type">
            <label :for="type">{{type}}</label>
          </span>
        </div>
        
      </div>
      <div class="new-account-confirm">
        <button @click="confirm">
          开通试用3天
          <img v-if="isLoading" class="loading" src="../../img/loading.gif" alt="loading">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import u from '../../js/utils'
import nCity from './city.vue'

export default {
  data() {
    return {
      titles: ['手机号', '姓名', '公司'],
      placeholders: ['11位手机号', '真实姓名', '所在公司'],
      titleEns: ['phone', 'name', 'company'], // title 的英文对照
      types: ['汽配商', '修理厂', '4S店', '保险公司', '个人', '其他'],
      account: {type: '汽配商', phone: '', name: '', company: '' , city_code : ''},
      isLoading: false,
      phoneChange: false
    }
  },
  computed: {
    showAccount: {
      get() {
        Object.keys(this.account).forEach(key => {
          this.phoneChange = true
          let value = this.account[key]
          this.account[key] = value = value.replace(/\s/g, '')
          if(key === 'phone') this.account[key] = value.replace(/\D/g, '')
        })
        return this.account
      },
      set(value) {
        this.account = value
      }
    }
  },
  methods: {
    confirm() {
      if(this.account.phone.length < 1) {
        alert("请输入手机号")
        return
      }
      else if(this.account.name.length < 1) {
        alert('请输入姓名')
        return
      }
      else if(this.account.company.length < 1) {
        alert("请输入公司名")
        return
      }
      else if(this.account.city_code.length < 1 ) {
        alert("请选择城市")
        return
      }


      this.isLoading = true
      u.post('/create_account_agency', this.account, res => {
        this.isLoading = false
        alert('开通成功, 通知短信已发送')
      })
      setTimeout(() => this.isLoading = false, 2000)
    },
    check(index) {
      if(index !== 1) return

      let phone = this.showAccount.phone
      if(this.phoneChange) {
        if(phone.length !== 11) {
          this.phoneChange = false
          alert("手机号码不正确")
        }
        else {
          this.phoneChange = false
          u.post('/phone_check', {phone}, res => {
            // console.log(res.msg)
          })
        }
      }
      // if(phone.length !== 11) {
      //   if(this.phoneChange) {
      //     this.phoneChange = false
      //     alert("手机号码不正确")
      //   }
      // }
      // else u.post('/phone_check', {phone}, res => {
      //   console.log(res.msg)
      // })
    },
    backCode(code){
      // city_code:this.city_code,
      this.account.city_code = code
    }
  },
  components: {
    nCity,
  }
}
</script>

<style lang="less" scoped>
.container-new-account {
  display: flex;
  justify-content: center;
  align-items: center;

  @normal-red: #ff6c61;
  @d8: #d8d8d8;

  .new-account {
    width: 400px;
    height: 423px;
    background-color: white;
    border-radius: 4px;
    font-size: 14px;
    color: #666;

    &>div {
      box-sizing: border-box;
      padding: 0 10px;
    }
    
    .input {
      outline: none;
      border: 0;
      padding: 0;
      margin: 0;
    }

    input {
      .input;
      box-sizing: border-box;
      padding-left: 8px;
      color: #333;
    }

    .new-account-title {
      width: 100%;
      line-height: 39px;
      border-bottom: 1px solid @d8;
    }

    .new-account-input {
      display: flex;
      align-items: center;
      height: 40px;
      margin-top: 20px;

      .new-account-input-title {
        width: 64px;
      }

      .new-account-input-point {
        color: @normal-red;
      }

      .new-account-input-city{
        margin-left: 26px;
        width: 280px;
      }

      &>input.new-account-input-account {
        margin-left: 26px;
        width: 280px;
        height: 39px;
        border: 1px solid @d8;
        border-radius: 4px;
      }

      .new-account-input-span{
            margin-left: 26px;
            width: 280px;
          .new-account-input-container-radio {
            width: 33%;
            display: inline-block;
          }
          .new-account-input-container-radio:nth-child(n+3){
            margin-top: 5px;
          }
      }
    }

    &>.new-account-input:nth-child(6){
      margin-bottom: 10px;
    }

    .new-account-confirm {
      width: 100%;
      border-top: 1px solid @d8;
      display: flex;
      justify-content: center;

      button {
        position: relative;
        .input;
        margin-top: 20px;
        width: 200px;
        height: 40px;
        background-color: @normal-red;
        box-shadow: 0 2px 0 0 #DA554B;
        border-radius: 4px;
        color: white;
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
    }
  }
}
</style>

