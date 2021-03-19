<template>
    <Columnaddart></Columnaddart>
    <column-list :list="list"> </column-list>
</template>

<script lang="ts">
    import { defineComponent,computed,onMounted } from 'vue'
    import { useStore } from 'vuex'
    import { GlobalDataProps } from '../store'
    import Columnaddart from "@/components/Columnaddart.vue";
    import ColumnList from '../components/ColumnList.vue'
    

    export default defineComponent({
        name: 'Home',
        components: {
            Columnaddart,
            ColumnList
        },
        setup() {
            const store = useStore<GlobalDataProps>()
            onMounted(()=>{
                // 执行actions 的 fetchColumns 方法
                store.dispatch('fetchColumns')
            })
            const list = computed(() => store.getters.getColumns )
            return {
                list
            }
        }
    });
</script>

<style scoped>

</style>
