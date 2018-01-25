<template>
  <div class="app">
    <delegate-header @change="headerChange"></delegate-header>
    <delegate-visual-info :updateCount="updateCount"></delegate-visual-info>
    <delegate-content></delegate-content>
  </div>
</template>

<script>
import u from '../js/utils'
import delegateHeader from './header/header.vue'
import delegateVisualInfo from './visual-info/visual-info.vue'
import delegateContent from './content/content.vue'

export default {
  data() {
    return {
      visualInfoUpdate: null,
      updateCount: 0 // 计数处理点击 header 然后更新 visual info, visual info 监听边和
    }
  },
  mounted() {

  },
  computed: {

  },
  methods: {
    headerChange() {
      this.updateCount++
    }
  },
  components: {
    delegateHeader,
    delegateVisualInfo,
    delegateContent
  }
}
</script>


<style scoped lang='less'>
.app {
  width: 100%;
  min-width: 960px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #edeef5;
}
</style>
