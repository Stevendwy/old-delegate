import VueRouter from 'vue-router'
import newAccount from '../vue/content/new-account.vue'
import userList from '../vue/content/user-list.vue'
import payList from '../vue/content/pay-list.vue'
import promotionCode from '../vue/content/promotion-code.vue'
import delegateCertificate from '../vue/content/delegate-certificate.vue'
import changePassword from '../vue/content/change-password.vue'

const routes = [
  {path: '/new-account', component: newAccount, alias: '/'},
  {path: '/user-list', component: userList},
  {path: '/pay-list', component: payList},
  {path: '/promotion-code', component: promotionCode},
  {path: '/delegate-certificate', component: delegateCertificate},
  {path: '/change-password', component: changePassword}
]

export default new VueRouter({
  routes
})