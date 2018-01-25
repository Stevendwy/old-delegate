<script>
import u from '../../js/utils'
import pagination from './pagination.vue'

export default {
  data() {
    return {
      widths: ['20%', '20%', '35%', '25%'],
      headerTitles: ['优惠码', '优惠内容', '使用期限', '使用者'],
      listData: null,
      page: 1,
      pageCount: 1,
      hasAjaxed: false // 请求是否执行并返回, 用来处理是否显示无数据图片
    }
  },
  mounted() {
    this.ajaxListData(this.page)
  },
  methods: {
    paginationPageClick(index) {
      this.page = index + 1
      this.ajaxListData(this.page)
    },
    ajaxListData(page) {
      u.post('/promotion_info_agency', {page}, res => {
        this.hasAjaxed = true
        this.listData = res.data
        this.pageCount = res.amount_page
      })
    }
  },
  components: {
    pagination
  }
}
</script>

<template>
  <div class="promotion-code">
    <div class="promotion-code-container">
      <div class="promotion-code-title">我的优惠码</div>
      <div class="promotion-code-content">
        <div class="promotion-code-content-header">
          <div class="promotion-code-content-header-item"
            v-for="(title, index) in headerTitles" :key="title"
            :style="{width: widths[index]}">{{title}}</div>
        </div>
        <div class="promotion-code-content-list" v-if="listData">
          <div class="promotion-code-content-list-row"
             v-for="(listItem, index) in listData" :key="listItem.coupon_num">
            <div class="promotion-code-content-list-row-item"
              :style="{width: widths[0]}">{{listItem.coupon_num}}</div>
            <div class="promotion-code-content-list-row-item"
              :style="{width: widths[1]}">{{listItem.title}}</div>
            <div class="promotion-code-content-list-row-item"
              :style="{width: widths[2]}">{{listItem.valid_period}}</div>
            <div class="promotion-code-content-list-row-item"
              :style="{width: widths[3]}">{{listItem.actived_by}}</div>
          </div>
        </div>
        <div class="promotion-code-list-null-img" v-if="hasAjaxed && (!listData || listData.length < 1)" />
      </div>
      <pagination
        :countTotal="pageCount || 1"
        :initialSelectedIndex='0'
        :countPage='5'
        :pageClick="paginationPageClick"></pagination>
    </div>
    <div class="promotion-code-special-remind">
      <div>特别提示</div>
      <ul>
        <li>当您或他人购买或续费时，在订单页面可以选择（或输入）您的优惠码，获得相应的优惠。</li>
        <li>每个订单限使用一个优惠码。</li>
        <li>请注意：每个优惠码都有使用期限，请在期限之内使用，过期作废。</li>
        <li>当您使用优惠码购买的商品发生退货时，将不会退还该优惠码对应的优惠金额。</li>
        <li>订单享受某些特定的大力度促销优惠时，因为亏本销售，恕不支持使用优惠码。</li>
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
.promotion-code {
  font-size: 14px;
  color: #666;

  @border-line: 1px solid #d8d8d8;

  .border-line {
    border: @border-line;
  }

  .bottom-line {
    border-bottom: @border-line;
  }

  &>div {
    border-radius: 4px;
  }

  .promotion-code-container {
    background-color: white;
    min-height: 280px;
    padding-bottom: 8px;

    .pagination {
      margin-left: 8px;
    }

    .promotion-code-title {
      width: 100%;
      line-height: 39px;
      box-sizing: border-box;
      .bottom-line;
      padding-left: 20px;
    }

    .promotion-code-content {
      position: relative;
      width: e('calc(100% - 16px)');
      min-height: 40px;
      margin: 8px 0 0 8px;

      .promotion-code-content-header {
        height: 40px;
        background-color: #f6f6f6;
        box-sizing: border-box;
        .border-line;
        display: flex;

        .promotion-code-content-header-item {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .promotion-code-content-list {

        .promotion-code-content-list-row {
          min-height: 40px;
          .border-line;
          border-top: 0;
          display: flex;

          .promotion-code-content-list-row-item {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      .promotion-code-list-null-img {
        width: 100%;
        height: 400px;
        background: url(../../img/p_nully.png) center center ~'/' 160px auto no-repeat;
      }
    }
  }

  .promotion-code-special-remind {
    color: #333;
    background-color: white;
    margin-top: 12px;
    padding: 20px;
    box-sizing: border-box;
    margin-bottom: 20px;

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

