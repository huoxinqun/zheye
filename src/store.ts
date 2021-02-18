import axios from 'axios'
import { createStore } from 'vuex'

interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number
}
export interface ColumnProps {
  _id:number;
  title:string;
  avatar ?: ImageProps;
  description ?: string;
}
interface ImageProps {
  _id ?: string;
  url ?: string;
  createdAt ?: string;
}
export interface PostProps {
  id:string;
  title:string;
  content:string;
  image?: string;
  createdAt : string;
  columnId:　number;   
}
export interface GlobalDataProps {
  user: UserProps;
  columns:ColumnProps[];
  // posts:PostProps[];
  
}
const store = createStore<GlobalDataProps>({
    state: {
      user: { isLogin: false },
      columns: [],
      // posts: testPosts
    },
    mutations: {
      login(state) {
        state.user = {...state.user,isLogin: true,name: 'hxq'}
      },
      fetchColumns(state,rawData){
        state.columns = rawData.data.list
      }
      // createPost(state,newPost) {
      //   state.posts.push(newPost)
      // }
    },
    actions:{
      fetchColumns(context) {
        axios.get('/columns').then(resp =>{
          console.log(resp.data)
           context.commit('fetchColumns',resp.data)
        })
      }
    }
  })

  export default store