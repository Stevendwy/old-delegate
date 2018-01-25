<script>
import Vuex from 'vuex'
import pagination from './pagination.vue'
import u from '../../js/utils'

export default {
  data() {
    return {
      widths: ['4%', '10%', '6%', '13%', '5%', '8%', '8%', '12%', '6%', '6%', '8%', '8%','6'],
      headerTitles: ['序号', '账号', '姓名', '公司', '来源', '购买日期', '到期日期', '品牌权限', '到账金额', '优惠码来源', '有效用户奖励', '销售促进奖励',"奖励总计"],
      searchValue: '', // 搜索的手机号
      currentPage: 1, // 当前页码
      listData: {},
      searchValue: '',
      page: 1,
      hasAjaxed: false // 请求是否执行并返回, 用来处理是否显示无数据图片
    }
  },
  computed: {
    payListData() {
      return this.listData.data
    },
    pageCount() {
      return this.listData.amount_page
    },
    payListRequest() {
      return {
        page: this.page,
        phone: this.searchValue
      }
    }
  },
  methods: {
    ajaxPayList() {
      u.post('/payment_info_agency', this.payListRequest, res => {
        this.hasAjaxed = true
        this.listData = res
      })
    },
    search() {
      this.ajaxPayList()
    },
    clear() {
      this.searchValue = ''
      this.ajaxPayList()
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
        case 5: key = 'purchase_datetime'
        break
        case 6: key = 'valid_datetime'
        break
        case 7: key = 'privilege'
        break
        case 8: key = 'receipt_amount'
        break
        case 9: key = 'coupon_from'
        break
        case 10: key = 'advertise_bonus'
        break
        case 11: key = 'promotion_bonus'
        break
        case 12: key = 'total_bonus'
        break
        default: key = 'index'
      }
      return key
    },
    paginationPageClick(index) {
      this.page = index + 1

      this.ajaxPayList()
    }
  },
  components: {
    pagination
  }
}
</script>

<template>
  <div class="pay-list">
    <div class="pay-list-container">
      <div class="pay-list-title">用户列表</div>
      <div class="pay-list-search">
        <input class="pay-list-search-input" type="text" placeholder="输入手机号" v-model="searchValue" @keyup.13="search">
        <span><button class="pay-list-clear" @click="clear">显示全部</button></span>
        <div class="pay-list-search-glass" @click="search" />
      </div>
      <div class="pay-list-content">
        <div class="pay-list-content-header" v-if="headerTitles">
          <div class="pay-list-content-header-item"
            v-for="(title, index) in headerTitles" :key="title"
            :style="{width: widths[index]}">
              <span>{{title}}</span>
            </div>
        </div>
        <div class="pay-list-content-list" v-if="payListData">
          <div class="pay-list-content-list-row"
            v-for="(listItem, index) in payListData" :key="listItem.username + listItem.index">
              <div class="pay-list-content-list-item"
                v-for="(width, index) in widths" :key="width"
                :style="{width: widths[index]}">
                <!-- 根据 header 取响应日期数据 -->
                <span>{{listItem[getListItemKey(index)]}}</span>
              </div>
            </div>
        </div>
        <div class="pay-list-null-img" v-if="hasAjaxed && (!payListData || payListData.length < 1)" />
      </div>
      <pagination
        :countTotal="pageCount || 1"
        :initialSelectedIndex='0'
        :countPage='5'
        :pageClick="paginationPageClick"></pagination>
    </div>
    <div class="pay-list-special-remind">
      <div>特别提示</div>
      <ul>
        <li>金牌代理开通的用户最终完成支付，可获得有效用户奖励：成交金额的 18.6%（税后）；</li>
        <li>通过金牌代理优惠码完成支付，可获得销售促进奖励：成交金额的 9.3%（税后）。</li>
        <li>以上奖励比例已扣除奖励金额 7% 的税点。</li>
        <li>用户通过零零汽网站付款的，奖励金额当日到账，次日可提现。</li>
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pay-list {

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

  .pay-list-container {
    background-color: white;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #666;

    .pay-list-title {
      line-height: 39px;
      font-size: 16px;
      .bottom-line;
      padding-left: 20px;
    }

    .pay-list-search {
      position: relative;

      .pay-list-clear {
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

      .pay-list-search-input {
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

      .pay-list-search-glass {
        position: absolute;
        top: 6px;
        left: 144px;
        width: 40px;
        height: 40px;
        background: url(../../img/spirit.png) 0 -320px ~'/' 40px auto no-repeat;
        cursor: pointer;
      }
    }

    .pay-list-content {
      position: relative;
      width: e('calc(100% - 16px)');
      height: e('calc(100% - 154px)');
      margin-left: 8px;
      .border-line;

      .pay-list-content-header {
        height: 40px;
        display: flex;
        .bottom-line;

        .pay-list-content-header-item {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
        }
      }

      .pay-list-content-list {
        // overflow-y: scroll;
        min-height: e('calc(100% - 40px)');

        .pay-list-content-list-row {
          display: flex;
          min-height: 32px;
          .bottom-line;

          &:last-child {
            border-bottom: 0;
          }

          .pay-list-content-list-item {
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: @border-line;
          }

          .pay-list-content-list-item:last-child {
            border-right: 0;
          }
        }
      }

      .pay-list-null-img {
        width: 100%;
        height: 400px;
        background: url(../../img/p_pay.png) center center ~'/' 160px auto no-repeat;
      }
    }
  }

  .pay-list-special-remind {
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
