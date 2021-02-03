import { createApp } from 'vue'

import App from './App.vue'
// @ts-ignore
import $ from './jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/ bootstrap.bundle.min.js '
import 'bootstrap/dist/js/bootstrap.min.js'
import 'font-awesome/css/font-awesome.min.css'
import router from "@/router";
const app = createApp(App,$)
app.use(router);
app.mount('#app')
/*createApp(App,$).mount('#app')
createApp(App).use(router)*/

const win: any = window // 
if (process.env.NODE_ENV === 'development') {
  if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win) {
    // 这里__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue赋值一个createApp实例
    win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
  }
}