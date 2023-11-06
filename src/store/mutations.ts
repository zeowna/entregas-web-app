import { AppState } from '@/store/index'
import { User } from '@/services/api/types'
import { MutationTree } from 'vuex'

export enum MutationTypes {
  SET_USER = 'SET_USER',
  SET_TOKEN = 'SET_TOKEN'
}

export type Mutations<S = AppState> = {
  [MutationTypes.SET_USER](state: S, payload: User): void
  [MutationTypes.SET_TOKEN](state: S, token: string): void
}

export const mutations: MutationTree<AppState> & Mutations = {
  [MutationTypes.SET_USER]: (state, user) => {
    state.user = user
  },
  [MutationTypes.SET_TOKEN]: (state, token) => {
    state.token = token
  }
}
