<script>
import u from '../../js/utils'

export default {
  data() {
    return {
      all: '',
      get: '',
      company: '',
      phone: ''
    }
  },
  watch:{
    updateCount(newValue) {
      this.update()
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    getNow() {
      window.open('https://007vin.com/user/profile')
    },
    update() {
      u.post('/balance_info_agency', {}, res => {
        this.all = res.data.bonus_balance
        this.get = res.data.available_balance
        this.company = res.company
        this.phone = res.phone
      })
    }
  },
  props: ['updateCount']
}
</script>

<template>
  <div class="delegate-visual-info">
    <div class="delegate-visual-info-normal">
      <span>{{company}}</span>
      <div class="all-balance">
        <span>奖励金余额:</span>
        <span class="money">{{all}}</span>
      </div>
      <div class="get-balance">
        <span>可提现金额:</span>
        <span class="money">{{get}}</span>
      </div>
      <div class="get-now"
        @click="getNow">前往提现</div>
    </div>
    <div class="delegate-visual-info-phone">{{phone}}</div>
  </div>
</template>


<style lang="less" scoped>
.delegate-visual-info {
  width: 100%;
  height: 40px;
  font-size: 14px;
  background-color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  @normal-red: #ff6c61;

  .delegate-visual-info-normal {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    margin-left: 0;
    display: flex;
    align-items: center;

    &>div {
      margin-left: 40px;

      .money {
        margin-left: 20px;
        color: @normal-red;
      }
    }

    .all-balance {
      
    }

    .get-balance {
      padding-left: 12px;
      border-left: 1px solid #666;
    }

    .get-now {
      color: @normal-red;
      border: 1px solid @normal-red;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
    }
  }

  .delegate-visual-info-phone {
    margin-right: 20px;
  }
}
</style>
