import axios,{ AxiosRequestConfig } from 'axios'
import { createStore,Commit } from 'vuex'

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

export interface GlobalErrorProps{
  status:boolean;
  message ?: string;
}
export interface GlobalDataProps {
  error:GlobalErrorProps;
  loading:boolean;
  user: UserProps;
  columns:ColumnProps[];
  posts:PostProps[];
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
const asyncAndCommit = async (url:string,mutationName:string,commit:Commit,config:AxiosRequestConfig ={ method: 'get' }) => {
  const { data } = await axios(url,config)
  commit(mutationName,data)
  return data
}
const store = createStore<GlobalDataProps>({
    state: {
      error:{ status:false },
      loading: false,
      user: { isLogin: false },
      columns: [],
      posts: [],
      token: localStorage.getItem('token') || ''
    },
    mutations: {
      // login(state) {
      //   state.user = {...state.user,isLogin: true,name: 'hxq'}
      // },
      updatePost(state, { data }) {
        state.posts = state.posts.map(post => {
          if (post._id === data._id) {
            return data
          } else {
            return post
          }
        })
      },
      postDetail(state,rawData) {
        state.posts = [rawData.data]
      },
      createPost(state, newPost) {
        state.posts.push(newPost)
      },
      fetchColumns(state,rawData){
        state.columns = rawData.data.list
      },
      fetchColumn(state,rawData){
        state.columns = [rawData.data]
      },
      fetchPosts(state,rawData){
        state.posts = rawData.data.list
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
     fetchColumns({ commit }) {
      return asyncAndCommit('/columns','fetchColumns',commit)
      },
      // 获得一个专栏详情
      async fetchColumn({ commit },cid) {
        return asyncAndCommit(`/columns/${cid}`,'fetchColumn',commit)
      },
      // 获取专栏的文章列表
      async fetchPosts({ commit },cid) {
        return asyncAndCommit(`/columns/${cid}/posts`,'fetchPosts',commit)       
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
      postDetail({ commit }, cid) {
        return asyncAndCommit(`/posts/${cid}`, 'postDetail', commit)
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
      getColumnById:(state) => (id:string) => {
        return state.columns.find(c => c._id === id)
      },
      getPostsByCid:(state) => (cid:string) => {
        return state.posts.filter(post => post.column === cid)
      },
      getCurrentPost: (state) => (id: string) => {
        return state.posts.find(post => post._id === id)
      }
    }
  })

  export default store