import { ActionContext, ActionTree } from 'vuex'
import { Api } from '@/services/api/Api'
import { AppState, store } from '@/store/index'
import { AdminUser, User } from '@/services/api/types'
import { PartnerUser } from '@/services/api/types/PartnerUser'
import { Mutations, MutationTypes } from '@/store/mutations'
import { jwtDecode } from 'jwt-decode'
import { DateTime } from 'luxon'
import { computed } from 'vue'

export enum ActionTypes {
  SIGN_IN = 'signIn',
  REFRESH_TOKEN = 'refreshToken',
  SET_USER = 'setUser',
  SET_TOKEN = 'setToken',
  SIGN_OUT = 'signOut'
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

  [ActionTypes.REFRESH_TOKEN](context: AugmentedActionContext, user: User): void

  [ActionTypes.SET_USER](context: AugmentedActionContext, user: User): void

  [ActionTypes.SET_TOKEN](context: AugmentedActionContext, token: string): void

  [ActionTypes.SIGN_OUT](context: AugmentedActionContext): void
}

export const actions: Actions & ActionTree<AppState, AppState> = {
  async [ActionTypes.SIGN_IN]({ dispatch }, { email, password }) {
    const { user, authorization_token } = await Api.auth.signIn(email, password)

    localStorage.setItem('token', authorization_token)

    dispatch(ActionTypes.SET_USER, user)
    dispatch(ActionTypes.SET_TOKEN, authorization_token)

    return user
  },

  async [ActionTypes.REFRESH_TOKEN]({ dispatch }) {
    const token = localStorage.getItem('token')
    dispatch(ActionTypes.SET_TOKEN, token)

    const user = computed(() => store.getters.getUser)

    try {
      if (!token) {
        return
      }

      const decoded = jwtDecode(token)
      const toExpire = DateTime.fromMillis(decoded.exp! * 1000)
      const now = DateTime.now()

      const diff = toExpire.diff(now, 'minutes').toObject()

      if (diff.minutes! <= 30 || !user.value) {
        const { user, authorization_token } = await Api.auth.refreshToken(token as string)

        localStorage.setItem('token', authorization_token)

        dispatch(ActionTypes.SET_USER, user)
        dispatch(ActionTypes.SET_TOKEN, authorization_token)

        return user
      }

      return
    } catch (err) {
      localStorage.setItem('token', '')
      dispatch(ActionTypes.SET_USER, null)
      dispatch(ActionTypes.SET_TOKEN, null)

      throw err
    }
  },
  [ActionTypes.SET_USER](
    { commit }: ActionContext<AppState, AppState>,
    user: AdminUser | PartnerUser
  ) {
    commit(MutationTypes.SET_USER, user)
  },
  [ActionTypes.SET_TOKEN]({ commit }, token) {
    commit(MutationTypes.SET_TOKEN, token)
  },

  [ActionTypes.SIGN_OUT]({ dispatch }) {
    localStorage.clear()

    dispatch(ActionTypes.SET_USER, null)
    dispatch(ActionTypes.SET_TOKEN, null)
  }
}
