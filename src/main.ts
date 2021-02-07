import { createApp } from 'vue'

import App from './App.vue'
// @ts-ignore
import $ from './jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/ bootstrap.bundle.min.js '
import 'bootstrap/dist/js/bootstrap.min.js'
import 'font-awesome/css/font-awesome.min.css'
import router from "@/router";
import store from './store'

const app = createApp(App,$)
app.use(router);
app.use(store);
app.mount('#app')
/*createApp(App,$).mount('#app')
createApp(App).use(router)*/

