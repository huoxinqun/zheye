import { createStore } from 'vuex'
interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number
}
export interface GlobalDataProps {
  user: UserProps
}
const store = createStore<GlobalDataProps>({
    state: {
      user: { isLogin: false }
    },
    mutations: {
      login(state) {
        state.user = {...state.user,isLogin: true,name: 'hxq'}
      }
    }
  })

  export default store