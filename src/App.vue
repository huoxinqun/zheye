<template>
  <user-header :user="userData"></user-header>
  <message type="error" :message="error.message" v-if="error.status"></message>
  <loader  v-if="isLoading" text="玩命加载中..." background="rgba(0,0,0,0.8)"></loader>
  <div class="container">
    <router-view></router-view>
  </div>
  <footer class=" text-center py-4 text-secondary bg-light mt-6">
    <small>
      <ul class="list-inline mb-0">
        <li class="list-inline-item">@ 2020 者也专栏</li>
        <li class="list-inline-item">课程</li>
        <li class="list-inline-item">文档</li>
        <li class="list-inline-item">联系</li>
        <li class="list-inline-item">更多</li>
      </ul>
    </small>
  </footer>
</template>

<script lang="ts">
import { defineComponent,computed,onMounted } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import UserHeader from './components/GlobalHeader.vue'
import Loader from './components/loader.vue'
import { GlobalDataProps } from './store'
import Message from './components/Message.vue'
export default defineComponent({
  name: 'App',
  components: {
    UserHeader,
    Loader,
    Message
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const userData = computed( ()=> store.state.user );
    const isLoading = computed( ()=> store.state.loading );
    const error = computed(() => store.state.error )
    //初始化store localstorage 后，APP判断第一次加载是否登陆，若登陆，设置请求Authorization头发送fetchCurrentUser请求，成功显示，失败过期提示
    const token = computed(() => store.state.token)
    onMounted(() => {
      if(!userData.value.isLogin && token.value){
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    return {
      userData,
      isLoading,
      error
    }
  }
});
</script>


