<script>
import u from '../../js/utils'

export default {
  data() {
    return {
      cartificateImgUrl: '#',
      agency: '公司名称'
    }
  },
  mounted() {
    u.post('/agency_certification', {}, res => {
      this.cartificateImgUrl = res.certif_url
      this.agency = res.agency
    })
  }
}
</script>

<template>
  <div class="delegate-certificate">
    <div class="delegate-certificate-title">
      <img src="../../img/flower.png" alt="flower">
      <span>代理证书</span>
      <img src="../../img/flower.png" alt="flower">
    </div>
    <span class="delegate-certificate-company">{{agency}}</span>
    <img class="delegate-certificate-img" :src="cartificateImgUrl" alt="代理证书">
  </div>
</template>

<style lang="less" scoped>
  .delegate-certificate {
    display: flex;
    flex-direction: column;
    align-items: center;

    .delegate-certificate-title {
      margin-top: 10px;

      span {
        margin: 0 16px;
      }

      img {
        width: 40px;
        height: auto;
      }
    }

    .delegate-certificate-company {
      margin-top: 30px;
    }

    .delegate-certificate-img {
      margin-top: 20px;
      width: 206px;
      height: auto;
    }
  }
</style>

