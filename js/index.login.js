import Vue from 'vue'
import login from '../vue/delegate-login.vue'

// import closeDebug from './close-vue-debug'
// closeDebug() // 关闭 debug 提示

new Vue({
  el: '#app',
  template: '<login />',
  components: {login}
})