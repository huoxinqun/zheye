<template>
    <div class="post-detail-page w-75 mx-auto">
        <div class="post-info row mb-4 border-bottom pb-4 align-items-center" >
            <img :src="currentImageUrl" :alt="currentPost.title"/>      
        </div>
        <div>
            <user-info 
            v-if="typeof currentPost.author === 'object'"
            :user="currentPost.author"
            >
            </user-info>
           <span class="text-muted col text-right font-italic">发表于：{{currentPost.createdAt}}</span>
        </div>
        <div v-html="currentHTML"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent,ref,onMounted,computed } from "vue";
    import { useRoute } from 'vue-router';
    import { useStore } from 'vuex';
    import { GlobalDataProps, PostProps,ImageProps } from '../store'
    import userInfo from '../components/userInfo.vue'
    import createMessage from '../components/createMessage'
 

    export default defineComponent({
        name: "postDetail",
        components: {
           userInfo
        },
        setup() {
            const route = useRoute()
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
                /*if (currentPost.value && currentPost.value.content) {
                    const { isHTML, content } = currentPost.value
                    return isHTML ? content : md.render(content)
                }*/
                return currentPost.value.content
            })
            return{
                currentPost,
                currentImageUrl,
                currentHTML
            }
        }
    })
</script>

<style scoped>

</style>
