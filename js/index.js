import Vue from 'vue'
import VueRouter from 'vue-router'
import delegate from '../vue/delegate.vue'
import router from '../router/content'

Vue.use(VueRouter)

// import closeDebug from './close-vue-debug'
// closeDebug() // 关闭 debug 提示

new Vue({
  el: '#app',
  router,
  template: '<delegate />',
  components: {delegate}
})