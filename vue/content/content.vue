<template>
  <div class="delegate-content">
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>


<style lang="less" scoped>
.delegate-content {
  width: 100%;
  min-height: e('calc(100% - 98px)');
  box-sizing: border-box;
  padding: 20px;

  &>div {
    width: 100%;
    height: 100%;
  }
}
</style>
