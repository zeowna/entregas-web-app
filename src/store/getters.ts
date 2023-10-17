import { AppState } from '@/store'
import { User } from '@/services/api/types'
import { GetterTree } from 'vuex'

export type Getters = {
  getBaseUrl(state: AppState): string
  getUser(state: AppState): User | undefined | null
  getToken(state: AppState): string | undefined | null
}

export const getters: GetterTree<AppState, AppState> & Getters = {
  getBaseUrl: (state: AppState) => state?.baseURL,
  getUser: (state: AppState) => state?.user,
  getToken: (state: AppState) => state?.token
}
