import { computed, ref } from 'vue'
import { AdminUser } from '@/services/api/types'
import { email, helpers, required } from '@vuelidate/validators'
import { Api } from '@/services/api/Api'
import { ToastServiceMethods } from 'primevue/toastservice'
import router from '@/router'
import { useVuelidate } from '@vuelidate/core'
import { DateTime } from 'luxon'
import { NotFoundError } from '@/services/api/errors'
import { cpf } from 'cpf-cnpj-validator';


const isLoading = ref(false)
const adminUser = ref<AdminUser>({
  name: '',
  birthday: null,
  cpf: '',
  email: '',
  password: '',
  profilePictureURI: ''
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

const v$ = useVuelidate(rules, adminUser)

const reset = () => {
  adminUser.value = {
    name: '',
    birthday: null,
    cpf: '',
    email: '',
    password: '',
    profilePictureURI: ''
  }

  file.value = null
  v$.value.$reset()
}

const uploadPicture = async () => {
  await Api.admin.users.uploadPicture(adminUser.value.id as number, file.value as File)
}

const findById = async (id: number) => {
  try {
    isLoading.value = true
    adminUser.value = await Api.admin.users.findById(id)

    adminUser.value.birthday = new Date(adminUser.value.birthday as unknown as string)

    isLoading.value = false
  } catch (err) {
    if (err instanceof NotFoundError) {
      await router.push({ name: 'create-admin' })
    }

    throw err
  }
}

const createUserUser = async () => {
  adminUser.value = await Api.admin.users.create(adminUser.value)

  adminUser.value.birthday = new Date(adminUser.value.birthday as unknown as string)

  if (file.value) {
    await uploadPicture()
  }
}

const updateUserUser = async () => {
  adminUser.value = await Api.admin.users.update(adminUser.value!.id as number, adminUser.value)
  adminUser.value.birthday = new Date(adminUser.value.birthday as unknown as string)

  if (file.value) {
    await uploadPicture()
  }
}

const goToUserUsers = async (toast: ToastServiceMethods) => {
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Usuário salvo com sucesso',
    life: 2000
  })

  await router.push({
    name: 'list-admin-users'
  })
}

const saveAdminUser = (toast: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    adminUser.value.name = adminUser.value.name.trim()

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (adminUser.value.id) {
      await updateUserUser()
      await goToUserUsers(toast)
      return
    }

    await createUserUser()
    await goToUserUsers(toast)
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

export const useSaveAdminUser = (toast: ToastServiceMethods) => {
  return {
    isLoading,
    adminUser,
    eighteenYearsAgo,
    file,
    v$,
    findById,
    saveAdminUser: saveAdminUser(toast),
    reset
  }
}
