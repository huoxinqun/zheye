<template>
    <div class="post-detail-page w-75 mx-auto">
        <div class="post-info row mb-4 border-bottom pb-4 align-items-center" >
            <img :src="currentImageUrl" :alt="currentTitle"/>      
        </div>
        <div class="border-bottom  mb-4 pb-4">
            <user-info 
            :user="currentPost.author" 
            v-if="currentPost && typeof currentPost.author === 'object'"
            class="col-md-8"
            >
            </user-info>
           <span class="text-muted col text-right font-italic col-md-4"  
                 v-if="currentPost" >发表于：{{currentPost.createdAt}}</span>
        </div>
        <div v-html="currentHTML"></div>
        <div v-if="showEditArea">
            <router-link 
             :to="{name:'create',query:{ id: currentPost._id }}"
             type="button" 
             class="btn btn-success"
            >
            编辑</router-link>
            <button type="button" class="btn btn-danger">删除</button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent,ref,onMounted,computed } from "vue";
    import MarkdownIt from 'markdown-it'
    import { useRoute } from 'vue-router';
    import { useStore } from 'vuex';
    import { GlobalDataProps, PostProps,ImageProps,UserProps } from '../store'
    import userInfo from '../components/userInfo.vue'

    export default defineComponent({
        name: "postDetail",
        components: {
           userInfo
        },
        setup() {
            const route = useRoute()
            const md = new MarkdownIt()
            const store = useStore<GlobalDataProps>()
            const currentId = route.params.id
            onMounted(() => {
              store.dispatch('postDetail', currentId)
            })
            const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
            const currentImageUrl = computed(() => {
                if (currentPost.value && currentPost.value.image) {
                    const { image } = currentPost.value
                    return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
                } else {
                    return null
                }
            })
            const currentHTML = computed(() => {
                if (currentPost.value && currentPost.value.content) {
                    const { isHTML, content } = currentPost.value
                    return isHTML ? content : md.render(content)
                }else{
                     return ''
                }
            })
            const currentTitle = computed(() => {
                if (currentPost.value && currentPost.value.title) {
                    const { title } = currentPost.value
                    return title 
                }else{
                     return ''
                }
            })
            const showEditArea = computed(() => {
                const { isLogin, _id } = store.state.user
                if(currentPost.value && currentPost.value.author && isLogin){
                    //因为currentPost.value.author有三种形态，undfined/srting/userprops,类型断言为userprops
                    const postAuthor = currentPost.value.author as UserProps
                    return postAuthor._id === _id
                }else{
                    return false
                }
            })
            return{
                currentPost,
                currentImageUrl,
                currentHTML,
                currentTitle,
                showEditArea
            }
        }
    })
</script>

<style scoped>

</style>
