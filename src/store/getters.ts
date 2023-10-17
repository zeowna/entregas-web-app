import { AppState } from '@/store'
import { User } from '@/services/api/types'
import { GetterTree } from 'vuex'

export type Getters = {
  getBaseUrl(state: AppState): string
  getUser(state: AppState): User | undefined
}

export const getters: GetterTree<AppState, AppState> & Getters = {
  getBaseUrl: (state: AppState) => state?.baseURL,
  getUser: (state: AppState) => () => state?.user
}
