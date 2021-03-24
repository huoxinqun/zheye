import axios,{ AxiosRequestConfig } from 'axios'
import { createStore,Commit } from 'vuex'
import { objToArr,arrToObj } from './helper'

export interface ResponseType<P = {}>{
  code: number,
  msg: string,
  data: P
}
export interface UserProps {
    isLogin : boolean;
    nickName ?: string;
    _id ?: string;
    column ?: string;
    email ?: string;
    avatar ?: ImageProps;
}
export interface ColumnProps {
  _id:string;
  title:string;
  avatar ?: ImageProps;
  description ?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
export interface PostProps {
  _id ?:string;
  title:string;
  excerpt ?: string;
  isHTML ?: string;
  content:string;
  image?: ImageProps | string;
  createdAt ?: string;
  column:string;  
  author ?: string | UserProps
}

interface ListProps<P> {
  [id: string]: P;
}
export interface GlobalErrorProps{
  status:boolean;
  message ?: string;
}
export interface GlobalDataProps {
  error:GlobalErrorProps;
  loading:boolean;
  user: UserProps;
  columns:{ data:ListProps<ColumnProps>; isLoaded: boolean };
  posts:{ data:ListProps<PostProps>; loadedColumns: string[] };
  token: String
}
//定义get 公共async方法
const getAndCommit = async (url:string,mutationName:string,commit:Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName,data)
  return data
}

//定义post 公共async方法
const postAndCommit = async (url:string,mutationName:string,commit:Commit,payload:any) => {
  const { data } = await axios.post(url,payload)
  commit(mutationName,data)
  return data
}
//公共async方法
const asyncAndCommit = async (url:string,mutationName:string,commit:Commit,config:AxiosRequestConfig ={ method: 'get' },extraData?: any) => {
  const { data } = await axios(url,config)
  if(extraData) {
    commit(mutationName,{ data, extraData })
  }else{
    commit(mutationName,data)
  }
  return data
}
const store = createStore<GlobalDataProps>({
    state: {
      error:{ status:false },
      loading: false,
      user: { isLogin: false },
      columns: { data: {}, isLoaded: false },
      posts: { data: {}, loadedColumns: [] },
      token: localStorage.getItem('token') || ''
    },
    mutations: {
      // login(state) {
      //   state.user = {...state.user,isLogin: true,name: 'hxq'}
      // },
      deletePost(state, { data }) {
         delete state.posts.data[data._id]
      },
      updatePost(state, { data }) {
        state.posts.data[data._id] = data
      },
      postDetail(state,rawData) {
        //state.posts[rawData._id] undefined
        // console.log( state.posts[rawData._id])
        // console.log( rawData.data)
        state.posts.data[rawData.data._id] = rawData.data
      },
      createPost(state, newPost) {
        state.posts.data[newPost._id]
      },
      fetchColumns(state,rawData){
        state.columns.data = arrToObj(rawData.data.list)
        state.columns.isLoaded = true
      },
      fetchColumn(state,rawData){
        state.columns.data[rawData.data._id] = rawData.data
      },
      fetchPosts(state,{data: rawData,extraData: columnId}){
        state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
        state.posts.loadedColumns.push(columnId)
      },
      setLoading(state,status) {
        state.loading = status
      },
      setError(state,e: GlobalErrorProps){
        state.error = e
      },
      login(state,rawData){
        //1.获取token 2.设置header 3.更新状态,显示用户名
        const { token } = rawData.data
        state.token = token
        localStorage.setItem('token',token)
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
      },
      fetchCurrentUser(state, rawData) {
        state.user = { isLogin: true, ...rawData.data }
      },
      logout(state) {
        state.token = ''
        state.user = { isLogin: false }
        localStorage.removeItem('token')
        delete axios.defaults.headers.common.Authorization
      },
    },
    actions:{
      //获取首页专栏
     fetchColumns({ state, commit }) {
       if(!state.columns.isLoaded){
         return asyncAndCommit('/columns','fetchColumns',commit)
       }
      },
      // 获得一个专栏详情
      async fetchColumn({state, commit },cid) {
        if(!state.columns.data[cid]){
          return asyncAndCommit(`/columns/${cid}`,'fetchColumn',commit)
        }
      },
      // 获取专栏的文章列表
      async fetchPosts({ state, commit },cid) {
        if(!state.posts.loadedColumns.includes(cid)){
          return asyncAndCommit(`/columns/${cid}/posts`,'fetchPosts',commit,{ method: 'get'}, cid)       
        }
      },
      //登录
      login({commit},payload){
        return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: payload })
      },
      //获取用户信息
      fetchCurrentUser({ commit }) {
        return getAndCommit('/user/current', 'fetchCurrentUser', commit)
      },
      // axios登录请求后-请求用户信息接口
      loginAndFetch({ dispatch }, loginData) {
        return dispatch('login', loginData).then(() => {
            return dispatch('fetchCurrentUser')
        })
      },
       //新建文章
      creatPost({ commit }, payload) {
        return asyncAndCommit('/posts', 'createPost', commit, { method: 'post', data: payload })
      },
      //获取文章详情
      postDetail({ state, commit }, cid) {
        const currentPost = state.posts.data[cid]
        if(!currentPost || !currentPost.content){
          return asyncAndCommit(`/posts/${cid}`, 'postDetail', commit)
        }else{
          return Promise.resolve({ data:currentPost })
        }
      },
      //更新文章详情
      updatePost({ commit }, { id, payload }) {
        return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
          method: 'patch',
          data: payload
        })
      }, 
      //删除文章详情
      deletePost({ commit }, id ) {
        return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
          method: 'delete'
        })
      }, 
    },
    getters :{
      getColumns: (state) => {
        return objToArr(state.columns.data)
      },
      getColumnById:(state) => (id:string) => {
        return state.columns.data[id]
      },
      getPostsByCid:(state) => (cid:string) => {
        return objToArr(state.posts.data).filter(post => post.column === cid)
      },
      getCurrentPost: (state) => (id: string) => {
        return state.posts.data[id]
      }
    }
  })

  export default store