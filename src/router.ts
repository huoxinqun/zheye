import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Login from './views/login.vue'
import Signup from './views/signup.vue'
import ColumnDetail from './views/columnDetail.vue'
import CreatePost from './views/createPost.vue'
import postDetail from './views/postDetail.vue'

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup,
            meta:{
                auth:false
            }
        },
        {
            path: '/column/:id',
            name: 'column',
            component: ColumnDetail
        },
        {
            path: '/create',
            name: 'create',
            component: CreatePost,
            meta:{
                auth:true
            }
        },
        {
            path: '/postDetail/:id',
            name: 'postDetail',
            component: postDetail
        },
        {
            path: "/:pathMatch(.*)*",  //注意vue3 不能用*直接代替，要用正则
            redirect: "/"
        }
    ]
})


// 路由守卫
router.beforeEach((to,from,next)=>{
    // to要跳转到的路径
    // from从哪个路径来
    // next往下执行的回调
    // 在localStorage中获取token
    let token=localStorage.getItem('token')
    // 判断该页面是否需要登录
    if(to.meta.auth){
        // 如果token存在直接跳转
        if(token){
            next()
        }else{
            // 否则跳转到login登录页面
            next({
                path:'/login',
                // 跳转时传递参数到登录页面，以便登录后可以跳转到对应页面
                query:{
                    redirect:to.fullPath
                }
            })
        }
    }else{
        // 如果不需要登录，则直接跳转到对应页面
        next()
    }
})


export default router
