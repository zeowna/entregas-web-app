import { computed, ref } from 'vue'
import { helpers, required, sameAs } from '@vuelidate/validators'
import { Api } from '@/services/api/Api'
import { ToastServiceMethods } from 'primevue/toastservice'
import { NotFoundError } from '@/services/api/errors'
import router from '@/router'
import { useVuelidate } from '@vuelidate/core'
import { DateTime } from 'luxon'
import { User } from '@/services/api/types'

const isLoading = ref(false)
const passwordFieldEnabled = ref(false)
const me = ref<User & { passwordConfirmation: string }>({
  name: '',
  birthday: null,
  cpf: '',
  email: '',
  password: '',
  profilePictureURI: '',
  passwordConfirmation: ''
})

const eighteenYearsAgo = computed(() => DateTime.now().minus({ years: 18 }).toJSDate())
const file = ref<File | null>(null)

const passwordRules = computed(() => ({
  password: {
    required: helpers.withMessage('Senha é obrigatório', required)
  },
  passwordConfirmation: {
    required: helpers.withMessage('Confirmar senha é obrigatório', required),
    sameAs: helpers.withMessage(
      'Confirmar senha tem que coincidir com a senha',
      sameAs(me.value.password)
    )
  }
}))

const rules = computed(() => ({
  name: { required: helpers.withMessage('Nome é obrigatório', required) },
  birthday: { required: helpers.withMessage('Data de nascimento é obrigatório', required) },
  cpf: { required: helpers.withMessage('CPF é obrigatório', required) },
  email: { required: helpers.withMessage('E-mail é obrigatório', required) },
  password: {},
  passwordConfirmation: {},
  ...(passwordFieldEnabled.value ? passwordRules.value : {})
}))

const v$ = useVuelidate(rules, me)

const reset = () => {
  me.value = {
    name: '',
    birthday: null,
    cpf: '',
    email: '',
    password: '',
    profilePictureURI: '',
    passwordConfirmation: ''
  }

  file.value = null
  passwordFieldEnabled.value = false
  v$.value.$reset()
}

const uploadPicture = async () => {
  await Api.me.uploadProfilePicture(file.value as File)
}

const findMe = async () => {
  try {
    isLoading.value = true
    const found = await Api.me.findMe()
    me.value = {
      ...found,
      passwordConfirmation: ''
    }
    me.value.birthday = new Date(me.value.birthday as unknown as string)

    isLoading.value = false
  } catch (err) {
    if (err instanceof NotFoundError) {
      await router.push({ path: '/' })
    }

    throw err
  }
}

const togglePasswordFields = () => {
  passwordFieldEnabled.value = !passwordFieldEnabled.value
}

const updateMe = async () => {
  const updated = await Api.me.update({
    ...me.value,
    password: undefined
  })

  me.value = {
    ...updated,
    passwordConfirmation: ''
  }

  me.value.birthday = new Date(me.value.birthday as unknown as string)

  if (file.value) {
    await uploadPicture()
  }
}

const updateMyPassword = async () => {
  await Api.me.updateMyPassword(me.value.password as string)
}

const saveMe = (toast: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    me.value.name = me.value.name.trim()

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (me.value.id) {
      if (passwordFieldEnabled.value) {
        await updateMyPassword()
      }

      await updateMe()

      passwordFieldEnabled.value = false

      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Usuário salvo com sucesso',
        life: 2000
      })
      return
    }
  } catch (err) {
    toast?.add({
      severity: 'error',
      summary: 'Erro ao Salvar',
      detail: (err as Error).message ?? 'Não foi possível salvar o Usuário!',
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}

export const useSaveMe = (toast: ToastServiceMethods) => {
  return {
    isLoading,
    me,
    eighteenYearsAgo,
    file,
    v$,
    findMe,
    saveMe: saveMe(toast),
    reset,
    togglePasswordFields,
    passwordFieldEnabled
  }
}
