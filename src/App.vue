<template>
  <user-header :user="userData"></user-header>
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
import { defineComponent,computed } from 'vue';
import { useStore } from 'vuex';
import UserHeader,{ UserProps } from './components/GlobalHeader.vue'
import Loader from './components/loader.vue'

export default defineComponent({
  name: 'App',
  components: {
    UserHeader,
    Loader
  },
  setup() {
    const store = useStore();
    const userData = computed( ()=> store.state.user );
    const isLoading = computed( ()=> store.state.loading );
    return {
      userData,
      isLoading
    }
  }
});
</script>


