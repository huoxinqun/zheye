<template>
    <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
        <router-link to="/"><a class="navbar-brand" href="#">者也专栏</a></router-link>
        <ul v-if="!user.isLogin" class="list-inline mb-0">
            <li class="list-inline-item"><router-link to="/login"><div href="#" class="btn btn-outline-light my-2">登陆</div></router-link></li>
            <li class="list-inline-item"><router-link to="/signup"><div href="#" class="btn btn-outline-light my-2">注册</div></router-link></li>
        </ul>
        <ul v-else class="list-inline mb-0">
            <Dropdown :title="`你好，${ user.nickName }`">
                <DropdownItem closeAfterClick><a href="#" class="dropdown-item">新建新闻</a></DropdownItem>
                <DropdownItem closeAfterClick disabled><a href="#" class="dropdown-item">编辑资料</a></DropdownItem>
                <DropdownItem closeAfterClick><a href="#" class="dropdown-item" @click="handleLogout">退出登录</a></DropdownItem>
            </Dropdown>
        </ul>
    </nav>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { useRouter } from 'vue-router'
    import Dropdown from "@/components/Dropdown.vue";
    import DropdownItem from  '@/components/DropdowmItem.vue'
    import store,{ UserProps } from '../store'
    import createMessage from '../components/createMessage'

    export default defineComponent({
        name: 'GlobalHeader',
        components:{
            Dropdown,
            DropdownItem
        },
        props: {
            user: {
                type: Object as PropType<UserProps>,
                required: true
            }
        },
        setup(){
            const router = useRouter()
            const handleLogout = () => {
                store.commit('logout')
                createMessage('退出登录成功，2秒后跳转到首页', 'success', 2000)
                setTimeout(() => {
                    router.push('/')
                },2000)
            }

            return {
              handleLogout
            }
        }
    })
</script>

<style scoped>

</style>
