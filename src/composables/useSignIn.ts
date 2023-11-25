import { store } from '@/store'
import { ActionTypes } from '@/store/actions'
import { Api } from '@/services/api/Api'
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { email, helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useRouter } from 'vue-router'
import { UserTypes } from '@/services/api/types'

export const useSignIn = () => {
  const router = useRouter()
  const toast = useToast()
  const user = computed(() => store.getters.getUser)

  const credentials = ref({
    email: '',
    password: ''
  })

  const isLoading = ref(false)

  const rules = computed(() => ({
    email: {
      required: helpers.withMessage('Preencha seu E-mail', required),
      email: helpers.withMessage('Preencha com um E-mail válido', email)
    },
    password: {
      required: helpers.withMessage('Preencha sua Senha', required)
    }
  }))

  const v$ = useVuelidate(rules, credentials)

  const signIn = async () => {
    try {
      isLoading.value = true

      const formValidation = await v$.value.$validate()

      if (!formValidation) {
        throw new Error(v$.value.$errors.map((e) => e.$message).join())
      }

      await store.dispatch(ActionTypes.SIGN_IN, {
        email: credentials.value.email,
        password: credentials.value.password
      })

      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Redirecionando...',
        life: 2000
      })

      if (user.value.type === UserTypes.Partner) {
        setTimeout(
          async () =>
            await router.push({
              name: 'list-partner-orders',
              params: { partnerId: user.value.partner.id }
            }),
          2000
        )
        return
      }

      setTimeout(async () => await router.push({ name: 'list-admin-users' }), 2000)
    } catch (err) {
      if (err instanceof Error) {
        toast.add({
          severity: 'error',
          summary: 'Erro ao entrar',
          detail: err?.message ?? 'Não foi possível realizar o login!',
          life: 5000
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  const forgotPassword = async () => {
    try {
      if (!credentials.value.email) {
        toast.add({
          severity: 'error',
          summary: 'Erro ao processar',
          detail: 'Precisamos do seu E-mail para te enviar uma nova senha',
          life: 5000
        })
        return
      }

      await Api.auth.forgotPassword(credentials.value.email)

      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Te enviamos uma nova senha',
        life: 5000
      })
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: 'Erro ao processar',
        detail: (err as Error).message ?? 'Não foi possível processar uma nova senha!',
        life: 5000
      })
    }
  }

  const disableSubmitButton = computed(
    () =>
      !credentials.value.email || !credentials.value.password || isLoading.value || v$.value.$error
  )

  return { credentials, isLoading, signIn, forgotPassword, disableSubmitButton, v$ }
}
