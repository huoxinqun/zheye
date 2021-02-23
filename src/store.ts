import axios from 'axios'
import { createStore,Commit } from 'vuex'

export interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number
}
export interface ColumnProps {
  _id:string;
  title:string;
  avatar ?: ImageProps;
  description ?: string;
}
export interface ImageProps {
  _id ?: string;
  url ?: string;
  createdAt ?: string;
}
export interface PostProps {
  _id:string;
  title:string;
  excerpt ?: string;
  content:string;
  image?: ImageProps;
  createdAt : string;
  column:string;   
}
export interface GlobalDataProps {
  user: UserProps;
  columns:ColumnProps[];
  posts:PostProps[];
  
}
//定义get 公共async方法
const getAndCommit = async (url:string,mutationName:string,commit:Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName,data)
}
const store = createStore<GlobalDataProps>({
    state: {
      user: { isLogin: false },
      columns: [],
      posts: []
    },
    mutations: {
      login(state) {
        state.user = {...state.user,isLogin: true,name: 'hxq'}
      },
      fetchColumns(state,rawData){
        state.columns = rawData.data.list
      },
      fetchColumn(state,rawData){
        state.columns = [rawData.data]
      },
      fetchPosts(state,rawData){
        state.posts = rawData.data.list
      }
      // createPost(state,newPost) {
      //   state.posts.push(newPost)
      // }
    },
    actions:{
      // 获取首页文章列表
      // async fetchColumns(context) {
      //   axios.get('/columns').then(resp =>{
      //      context.commit('fetchColumns',resp.data)
      //   })
      // },
     fetchColumns({ commit }) {
       getAndCommit('/columns','fetchColumns',commit)
        // const { data } = await axios.get('/columns')  
        // commit('fetchColumns',data)
      },
      // 获得一个专栏详情
      async fetchColumn({ commit },cid) {
        getAndCommit(`/columns/${cid}`,'fetchColumn',commit)
      },
      // 获取专栏的文章列表
      async fetchPosts({ commit },cid) {
        getAndCommit(`/columns/${cid}/posts`,'fetchPosts',commit)       
      },
    },
    getters :{
      getColumnById:(state) => (id:string) => {
        return state.columns.find(c => c._id === id)
      },
      getPostsByCid:(state) => (cid:string) => {
        return state.posts.filter(post => post.column === cid)
      }
    }
  })

  export default store