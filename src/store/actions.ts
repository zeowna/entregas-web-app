import { ActionContext } from 'vuex'
import { Api } from '@/services/api/Api'
import { AppState, store } from '@/store/index'
import { AdminUser, User } from '@/services/api/types'
import { PartnerUser } from '@/services/api/types/PartnerUser'
import { Mutations, MutationTypes } from '@/store/mutations'

export enum ActionTypes {
  SIGN_IN = 'signIn',
  REFRESH_TOKEN = 'refreshToken',
  SET_USER = 'setUser',
  SET_TOKEN = 'setToken'
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<AppState, AppState>, 'commit'>

export interface Actions {
  [ActionTypes.SIGN_IN](
    context: AugmentedActionContext,
    credentials: {
      email: string
      password: string
    }
  ): Promise<User>

  [ActionTypes.SET_USER](context: AugmentedActionContext, user: User): void

  [ActionTypes.SET_TOKEN](context: AugmentedActionContext, token: string): void
}

export const actions: Actions = {
  async [ActionTypes.SIGN_IN]({ dispatch }, { email, password }) {
    const { user, authorization_token } = await Api.auth.signIn(email, password)

    localStorage.setItem('token', authorization_token)

    dispatch(ActionTypes.SET_USER, user)
    dispatch(ActionTypes.SET_TOKEN, user)

    return user
  },
  async [ActionTypes.REFRESH_TOKEN]({ dispatch }) {
    const token = localStorage.getItem('token')

    if (!token) {
      return
    }

    store.dispatch(ActionTypes.SET_TOKEN, token)

    const { user, authorization_token } = await Api.auth.refreshToken(token as string)

    localStorage.setItem('token', authorization_token)

    dispatch(ActionTypes.SET_USER, user)
    dispatch(ActionTypes.SET_TOKEN, user)

    return user
  },
  [ActionTypes.SET_USER](
    { commit }: ActionContext<AppState, AppState>,
    user: AdminUser | PartnerUser
  ) {
    commit(MutationTypes.SET_USER, user)
  },
  [ActionTypes.SET_TOKEN]({ commit }, token) {
    commit(MutationTypes.SET_TOKEN, token)
  }
}
