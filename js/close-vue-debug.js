import Vue from 'vue'

export default function() {
    let isDebug = false
    
    Vue.config.debug = isDebug
    Vue.config.devtools = isDebug
    Vue.config.productionTip = isDebug
}