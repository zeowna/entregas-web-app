import { store } from '@/store'
import { ActionTypes } from '@/store/actions'
import { useRouter } from 'vue-router'

export const useSignOut = () => {
  const router = useRouter()

  const signOut = async () => {
    await router.push({ name: 'signIn' })

    store.dispatch(ActionTypes.SIGN_OUT)
  }

  return {
    signOut
  }
}
