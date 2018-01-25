<script>
import Vuex from 'vuex'
import pagination from './pagination.vue'
import u from '../../js/utils'

export default {
  data() {
    return {
      widths: ['4%', '9%', '7%', '17%', '9%', '9%', '27%', '6%', '4%', '4%', '4%'],
      searchValue: '', // 搜索的手机号
      currentPage: 1, // 当前页码
      listData: {},
      searchValue: '',
      page: 1,
      hasAjaxed: false // 请求是否执行并返回, 用来处理是否显示无数据图片
    }
  },
  computed: {
    headerTitles() {
      return this.listData.date_sequence
    },
    userListData() {
      return this.listData.data
    },
    pageCount() {
      return this.listData.amount_page
    },
    userListRequest() {
      return {
        page: this.page,
        phone: this.searchValue
      }
    }
  },
  methods: {
    ajaxUserList() {
      u.post('/user_list_agency', this.userListRequest, res => {
        this.hasAjaxed = true
        this.listData = res
      })
    },
    search() {
      this.ajaxUserList()
    },
    clear() {
      this.searchValue = ''
      this.ajaxUserList()
    },
    getListItemKey(index) {
      let key = 'index'
      switch(index) {
        case 0: key = 'index'
        break
        case 1: key = 'username'
        break
        case 2: key = 'full_name'
        break
        case 3: key = 'company'
        break
        case 4: key = 'user_from'
        break
        case 5: key = 'register_datetime'
        break
        case 6: key = 'privilege_validation'
        break
        case 7: key = 'paid'
        break
        case 8: key = 'query_status'
        break
        default: key = 'index'
      }
      return key
    },
    paginationPageClick(index) {
      this.page = index + 1

      this.ajaxUserList()
    }
  },
  components: {
    pagination
  }
}
</script>

<template>
  <div class="user-list">
    <div class="user-list-container">
      <div class="user-list-title">用户列表</div>
      <div class="user-list-search">
        <input class="user-list-search-input" type="text" placeholder="输入手机号" v-model="searchValue" @keyup.13="search">
        <span><button class="user-list-clear" @click="clear">显示全部</button></span>
        <div class="user-list-search-glass" @click="search" />
        <!-- <span class="has-remind">"+" 表示有过查询, "-" 表示没有查询</span> -->
      </div>
      <div class="user-list-content">
        <div class="user-list-content-header" v-if="headerTitles">
          <div class="user-list-content-header-item"
            v-for="(title, index) in headerTitles" :key="title"
            :style="{width: widths[index]}">
              <span v-if="index !== 6">{{title}}</span>
              <div v-else class="header-item-special">
                <span>{{title}}</span>
                <span>到期日期</span>
              </div>
            </div>
        </div>
        <div class="user-list-content-list" v-if="userListData">
          <div class="user-list-content-list-row"
            v-for="(listItem, index) in userListData" :key="listItem.username + index">
              <div class="user-list-content-list-item"
                v-for="(width, index) in widths" :key="width"
                :style="{width: widths[index]}">
                <!-- 根据 header 取响应日期数据 -->
                <span v-if="index > 7">{{listItem[getListItemKey(8)][headerTitles[index]] === 0 ? '-' : '+'}}</span>
                <span v-else-if="index === 7">{{listItem[getListItemKey(index)] === 0 ? '-' : '+'}}</span>
                <span v-else-if="index !== 6">{{listItem[getListItemKey(index)]}}</span>
                <div v-else class="list-item-special">
                  <div v-for="item in listItem[getListItemKey(index)]" :key="item.brand + item.valid_datetime"
                    :class="!item.past ? 'list-item-special-past' : ''">
                    <span>{{item.brand}}</span>
                    <span>{{item.valid_datetime}}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="user-list-null-img" v-if="hasAjaxed && (!userListData || userListData.length < 1)" />
      </div>
      <pagination
        :countTotal="pageCount || 1"
        :initialSelectedIndex='0'
        :countPage='5'
        :pageClick="paginationPageClick"></pagination>
    </div>
    <div class="user-list-special-remind">
      <div>特别提示</div>
      <ul>
        <li>"+" 表示有, "-" 表示没有</li>
        <!-- <li>金牌代理开通的用户最终完成支付，可获得有效用户奖励：成交金额的18.6%（税后）；</li>
        <li>通过金牌代理优惠码完成支付，可获得销售促进奖励：成交金额的9.3%（税后）。</li>
        <li>用户通过零零汽网站付款的，奖励金额当日到账，次日可提现。</li> -->
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user-list {
  @border-line: 1px solid #d8d8d8;

  .pagination {
    margin-left: 8px;
  }

  .border-line {
    border: @border-line;
  }

  .bottom-line {
    border-bottom: @border-line;
  }

  .user-list-container {
    background-color: white;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #666;

    .user-list-title {
      line-height: 39px;
      font-size: 16px;
      .bottom-line;
      padding-left: 20px;
    }

    .user-list-search {
      position: relative;

      .user-list-clear {
        width: 80px;
        height: 32px;
        outline: none;
        padding: 0;
        margin: 0;
        border: 0;
        border-radius: 16px;
        background-color: #ff6c61;
        color: white;
        cursor: pointer;

        &:hover {
          background-color: #f06658;
        }

        &:active {
          background-color: #e56b60;
        }
      }

      .user-list-search-input {
        outline: none;
        padding: 0 10px;
        margin: 10px 0 10px 8px;
        width: 180px;
        height: 32px;
        box-sizing: border-box;
        border-radius: 16px;
        .border-line;
        font-size: 14px;
        color: #333;
      }

      .user-list-search-glass {
        position: absolute;
        top: 6px;
        left: 144px;
        width: 40px;
        height: 40px;
        background: url(../../img/spirit.png) 0 -320px ~'/' 40px auto no-repeat;
        cursor: pointer;
      }

      .has-remind {
        position: absolute;
        top: 30px;
        right: 8px;
      }
    }

    .user-list-content {
      position: relative;
      width: e('calc(100% - 16px)');
      height: e('calc(100% - 154px)');
      margin-left: 8px;
      .border-line;

      .user-list-content-header {
        height: 40px;
        display: flex;
        .bottom-line;

        .user-list-content-header-item {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;

          .header-item-special {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 0 8px;
          }
        }
      }

      .user-list-content-list {
        // overflow-y: scroll;
        min-height: e('calc(100% - 40px)');

        .user-list-content-list-row {
          display: flex;
          min-height: 32px;
          .bottom-line;

          &:last-child {
            border-bottom: 0;
          }

          .user-list-content-list-item {
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: @border-line;

            .list-item-special {
              width: 100%;

              &>div {
                width: 100%;
                height: 32px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
                padding: 0 8px;
              }

              .list-item-special-past {
                color: #999;
              }
            }
          }

          .user-list-content-list-item:last-child {
            border-right: 0;
          }
        }
      }
    }

    .user-list-null-img {
      width: 100%;
      height: 400px;
      background: url(../../img/p_account.png) center center ~'/' 160px auto no-repeat;
    }
  }

  .user-list-special-remind {
    color: #333;
    background-color: white;
    margin-top: 12px;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 4px;

    ul {
      margin: 0;
      padding: 0;
      padding-left: 20px;

      li {
        font-size: 12px;
      }
    }
  }
}
</style>
