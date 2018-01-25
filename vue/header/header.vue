<script>
import u from '../../js/utils'

export default {
  data() {
    return {
      selectors: ['开通账户', '用户列表', '支付列表', '优惠码'],
      paths: ['/', '/user-list', '/pay-list', '/promotion-code', '/delegate-certificate', '/change-password', '/logout'],
      selectedIndex: 0
    }
  },
  mounted() {
    if(location.hash && location.hash.length > 0) this.selectedIndex = this.paths.indexOf(location.hash.substr(1)) || 0
  },
  methods: {
    setSelectedIndex(index) {
      this.selectedIndex = index
      this.push(index)
      this.$emit('change') // 点击就认为更新内容
    },
    push(index) {
      let path = this.paths[index]

      if(path === '/logout') {
        u.get('/logout', {}, res => {
          location.href = '/login'
        })
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

<template>
  <div class="delegate-header">
    <span>零零汽代理销售管理系统</span>
    <div class="delegate-header-selector">
      <div v-for="(selector, index) in selectors" :key="selector"
        :class="selectedIndex === index ? 'selected' : ''"
        @click="setSelectedIndex(index)">
        {{selector}}
        <div class="border"></div>
        </div>
    </div>
    <div class="delegate-header-utils">
      <!-- <div class="delegate-header-utils-messages">
        <span>公告板</span>
        <div class="delegate-header-utils-messages-point">1</div>
      </div> -->
      <div class="logout"
          @click="setSelectedIndex(6)">退出</div>
      <div class="delegate-header-utils-mine">
        <span>我的</span>
        <div class="delegate-header-utils-mine-img"></div>
        <div class="delegate-header-utils-mine-list">
          <!-- <div :class="'delegate-header-utils-mine-list-certificate ' + (selectedIndex === 4 ? 'selected' : '')"
            @click="setSelectedIndex(4)">
            <div class="delegate-header-utils-mine-list-item-img certificate"></div>
            <span>代理证书</span>
          </div> -->
          <div :class="'delegate-header-utils-mine-list-password ' + (selectedIndex === 5 ? 'selected' : '')"
            @click="setSelectedIndex(5)">
            <div class="delegate-header-utils-mine-list-item-img password"></div>
            <span>修改密码</span>
          </div>
          <!-- <div :class="'delegate-header-utils-mine-list-logout ' + (selectedIndex === 6 ? 'selected' : '')"
            @click="setSelectedIndex(6)">
            <div class="delegate-header-utils-mine-list-item-img logout"></div>
            <span>退出登录</span>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.delegate-header {
  width: 100%; 
  height: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px;

  span {
    font-size: 16px;
    color: #333;
  }

  .delegate-header-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #333;
    height: 100%;
    
    &>div {
      position: relative;
      padding: 0 10px;
      height: 100%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      cursor: pointer;

      .border {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 4px;
        display: none;
        box-sizing: border-box;
        border-bottom: 4px solid #ff6c61;
      }
    }

    .selected {
      color: #ff6c61;
      
      .border {
        display: block;
      }
    }
  }

  .delegate-header-utils {
    height: 100%;
    display: flex;
    justify-content: space-between;

    span {
      font-size: 16px;
      color: #333;
    }

    .delegate-header-utils-messages {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      
      .delegate-header-utils-messages-point {
        position: absolute;
        top: 8px;
        right: -12px;
        background-color: #FF6C61;
        width: 16px;
        height: 16px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 12px;
      }
    }

    .logout {
      height: 100%;
      margin-right: 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .delegate-header-utils-mine {
      position: relative;
      margin-left: 20px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: default;

      &:hover {
        .delegate-header-utils-mine-list {
          display: flex;
        }
      }

      .delegate-header-utils-mine-img {
        width: 40px;
        height: 40px;
        background: url(../../img/spirit.png) 0 -400px ~'/' 40px auto no-repeat;
      }

      .delegate-header-utils-mine-list {
        position: absolute;
        display: none;
        top: 54px;
        right: 0;
        width: 140px;
        flex-direction: column;
        box-shadow: 0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24);
        border-radius: 4px;
        overflow: hidden;
        background-color: white;
        z-index: 1;

        .delegate-header-utils-mine-list-item {
          height: 44px;
          display: flex;
          align-items: center;
          cursor: pointer;

          &:hover, &active {

            span {
              color: white;
            }
          }

          &:hover {
            background-color: #F0655B;
          }

          &:active {
            background-color: #d45950;
          }

          .delegate-header-utils-mine-list-item-img {
            width: 40px;
            height: 40px;
            background: url(../../img/spirit.png) no-repeat;
            background-size: 40px auto;
          }

          .certificate {
            background-position: 0 -480px;
          }

          .password {
            background-position: 0 -520px;
          }

          .logout {
            background-position: 0 -560px;
          }
        }

        .selected {
          background-color: #ff6c61;

          span {
            color: white;
          }
        }

        .delegate-header-utils-mine-list-certificate {

          .delegate-header-utils-mine-list-item;

          &:hover, &:active, &.selected {

            .delegate-header-utils-mine-list-item-img {
              background-position: 0 -600px;
            }
          }
        }

        .delegate-header-utils-mine-list-password {

          .delegate-header-utils-mine-list-item;

          &:hover, &:active, &.selected {

            .delegate-header-utils-mine-list-item-img {
              background-position: 0 -640px;
            }
          }
        }

        .delegate-header-utils-mine-list-logout {

          .delegate-header-utils-mine-list-item;

          &:hover, &:active, &.selected {

            .delegate-header-utils-mine-list-item-img {
              background-position: 0 -680px;
            }
          }
        }
      }
    }
  }
}
</style>
