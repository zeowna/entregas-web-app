import { createStore } from 'vuex'
import { getters } from '@/store/getters'
import { actions } from '@/store/actions'
import { mutations } from '@/store/mutations'
import { User } from '@/services/api/types'

export interface AppState {
  baseURL: string
  user?: User | null
  token?: string | null
}

const initialState: AppState = {
  baseURL: import.meta.env.VITE_API_URI,
  user: null,
  token: null
}
export const store = createStore({
  state: initialState,
  getters: getters,
  actions: actions,
  mutations: mutations
})
