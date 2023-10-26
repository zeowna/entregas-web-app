import { computed, ref } from 'vue'
import { PartnerUser } from '@/services/api/types'
import { helpers, required } from '@vuelidate/validators'
import { Api } from '@/services/api/Api'
import { ToastServiceMethods } from 'primevue/toastservice'
import { NotFoundError } from '@/services/api/errors'
import router from '@/router'
import { useVuelidate } from '@vuelidate/core'

const isLoading = ref(false)
const partnerUser = ref<PartnerUser>({
  name: '',
  birthday: null,
  cpf: '',
  email: '',
  password: '',
  profilePictureURI: '',
  partnerId: null
})

const file = ref<File | null>(null)

const rules = computed(() => ({
  name: { required: helpers.withMessage('Nome é obrigatório', required) },
  birthday: { required: helpers.withMessage('Data de nascimento é obrigatório', required) },
  cpf: { required: helpers.withMessage('CPF é obrigatório', required) },
  email: { required: helpers.withMessage('E-mail é obrigatório', required) }
}))

const v$ = useVuelidate(rules, partnerUser)

const reset = () => {
  partnerUser.value = {
    name: '',
    birthday: null,
    cpf: '',
    email: '',
    password: '',
    profilePictureURI: '',
    partnerId: null
  }

  file.value = null
  v$.value.$reset()
}

const findPartnerPartnerId = async (partnerId: number) => {
  try {
    isLoading.value = true
    partnerUser.value = await Api.partners.users.findByPartnerId(partnerId)
    partnerUser.value.partnerId = partnerUser.value.partner.id

    isLoading.value = false
  } catch (err) {
    if (err instanceof NotFoundError) {
      await router.push({ name: 'create-partner' })
    }

    throw err
  }
}

const createPartnerUser = async () => {
  partnerUser.value = await Api.partners.users.create(partnerUser.value)

  if (file.value) {
    await uploadPicture()
  }
}

const updatePartnerUser = async () => {
  partnerUser.value = await Api.partners.users.update(
    partnerUser.value!.id as number,
    partnerUser.value
  )

  if (file.value) {
    await uploadPicture()
  }
}

const savePartnerUser = (toast?: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    partnerUser.value.name = partnerUser.value.name.trim()

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (partnerUser.value.id) {
      await updatePartnerUser()
      return
    }

    await createPartnerUser()
  } catch (err) {
    toast?.add({
      severity: 'error',
      summary: 'Erro ao Salvar',
      detail: err?.response?.data?.message ?? err.message ?? 'Não foi possível salvar o Usuário!',
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}

export const userSavePartnerUser = (toast?: ToastServiceMethods) => {
  return {
    isLoading,
    partnerUser,
    file,
    v$,
    findPartnerPartnerId,
    savePartnerUser: savePartnerUser(toast),
    reset
  }
}
