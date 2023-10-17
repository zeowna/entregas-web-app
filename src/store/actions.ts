import { ActionContext } from 'vuex'
import { Api } from '@/services/api/Api'
import { AppState } from '@/store/index'
import { AdminUser, User } from '@/services/api/types'
import { PartnerUser } from '@/services/api/types/PartnerUser'
import { Mutations, MutationTypes } from '@/store/mutations'

export enum ActionTypes {
  SIGN_IN = 'signIn',
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
  [ActionTypes.SignIn](
    context: AugmentedActionContext,
    credentials: { email: string; password: string }
  ): Promise<User>

  [ActionTypes.SET_USER](context: AugmentedActionContext, user: User): void

  [ActionTypes.SET_TOKEN](context: AugmentedActionContext, token: string): void
}

export const actions: Actions = {
  [ActionTypes.SIGN_IN]: async ({ dispatch }, { email, password }) => {
    const { user, authorization_token } = await Api.auth.signIn(email, password)

    localStorage.setItem('token', authorization_token)

    dispatch(ActionTypes.SET_USER, user)
    dispatch(ActionTypes.SET_TOKEN, user)

    return user
  },
  [ActionTypes.SET_USER]: (
    { commit }: ActionContext<AppState, AppState>,
    user: AdminUser | PartnerUser
  ) => {
    commit(MutationTypes.SET_USER, user)
  },
  [ActionTypes.SET_TOKEN]: ({ commit }, token) => {
    commit(MutationTypes.SET_TOKEN, token)
  }
}
