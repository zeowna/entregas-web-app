import { computed, ref } from 'vue'
import { PartnerUser } from '@/services/api/types'
import { email, helpers, required } from '@vuelidate/validators'
import { Api } from '@/services/api/Api'
import { ToastServiceMethods } from 'primevue/toastservice'
import { NotFoundError } from '@/services/api/errors'
import router from '@/router'
import { useVuelidate } from '@vuelidate/core'
import { DateTime } from 'luxon'
import { cpf } from 'cpf-cnpj-validator';


const partnerId = ref<number | null>()

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

const eighteenYearsAgo = computed(() => DateTime.now().minus({ years: 18 }).toJSDate())
const file = ref<File | null>(null)

const rules = computed(() => ({
  name: { required: helpers.withMessage('Nome é obrigatório', required) },
  birthday: { required: helpers.withMessage('Data de nascimento é obrigatório', required) },
  cpf: { 
    required: helpers.withMessage('CPF é obrigatório', required),
    valid: helpers.withMessage('CPF inválido', (value: string) => cpf.isValid(value)) 
  },
  email: { 
    required: helpers.withMessage('E-mail é obrigatório', required),
    email: helpers.withMessage('E-mail precisa ser um e-mail', email)
  }
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

const uploadPicture = async () => {
  await Api.partners.users.uploadProfilePicture(
    partnerId.value as number,
    partnerUser.value.id as number,
    file.value as File
  )
}

const findByPartnerIdAndId = async (partnerId: number, id: number) => {
  try {
    isLoading.value = true
    partnerUser.value = await Api.partners.users.findByPartnerIdAndId(partnerId, id)
    partnerUser.value.birthday = new Date(partnerUser.value.birthday as unknown as string)

    isLoading.value = false
  } catch (err) {
    if (err instanceof NotFoundError) {
      await router.push({ name: 'create-partner' })
    }

    throw err
  }
}

const createPartnerUser = async () => {
  partnerUser.value = await Api.partners.users.create(partnerId.value as number, partnerUser.value)

  partnerUser.value.birthday = new Date(partnerUser.value.birthday as unknown as string)

  if (file.value) {
    await uploadPicture()
  }
}

const updatePartnerUser = async () => {
  partnerUser.value = await Api.partners.users.update(
    partnerId.value as number,
    partnerUser.value!.id as number,
    partnerUser.value
  )
  partnerUser.value.birthday = new Date(partnerUser.value.birthday as unknown as string)

  if (file.value) {
    await uploadPicture()
  }
}

const goToPartnerUsers = async (toast: ToastServiceMethods) => {
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Usuário salvo com sucesso',
    life: 2000
  })

  await router.push({
    name: 'list-partner-users',
    params: { partnerId: partnerId.value }
  })
}

const savePartnerUser = (toast: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    partnerUser.value.name = partnerUser.value.name.trim()

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (partnerUser.value.id) {
      await updatePartnerUser()
      await goToPartnerUsers(toast)
      return
    }

    await createPartnerUser()
    await goToPartnerUsers(toast)
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

export const useSavePartnerUser = (_partnerId: number, toast: ToastServiceMethods) => {
  partnerId.value = _partnerId

  return {
    isLoading,
    partnerUser,
    eighteenYearsAgo,
    file,
    v$,
    findByPartnerIdAndId,
    savePartnerUser: savePartnerUser(toast),
    reset
  }
}
