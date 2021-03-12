import { createApp } from 'vue'
import router from "@/router";
import axios from 'axios'
import store from './store'

import App from './App.vue'
// @ts-ignore
import $ from './jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/ bootstrap.bundle.min.js '
import 'bootstrap/dist/js/bootstrap.min.js'
import 'font-awesome/css/font-awesome.min.css'
axios.defaults.baseURL= 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
    //显示loading
    store.commit('setLoading',true)
    store.commit('setError', { status: false, message: '' })
    //get 请求
    config.params = { ...config.params,icode: 'E4C27999702C2672'}
    //其他 请求
    if(config.data instanceof FormData) {
        config.data.append('icode','E4C27999702C2672')
    } else {
        config.data = { ...config.data,icode:'E4C27999702C2672'}
    }
    return config 
})
axios.interceptors.response.use(config => {
    //隐藏loading
    store.commit('setLoading',false)
    return config
},e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(e.response.data)
})

const app = createApp(App,$)
app.use(router);
app.use(store);
app.mount('#app')
/*createApp(App,$).mount('#app')
createApp(App).use(router)*/

