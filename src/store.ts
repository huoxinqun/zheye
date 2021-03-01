import axios,{ AxiosRequestConfig } from 'axios'
import { createStore,Commit } from 'vuex'

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
}

//定义post 公共async方法
const postAndCommit = async (url:string,mutationName:string,commit:Commit,payload:any) => {
  const { data } = await axios.post(url,payload)
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
      //登录
      login({commit},payload){
        return postAndCommit(`/user/login`,'login',commit,payload)
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
      }
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