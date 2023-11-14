import { computed, ref } from 'vue'
import { Partner, PartnerStatuses } from '@/services/api/types'
import { helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { Api } from '@/services/api/Api'
import router from '@/router'
import { ToastServiceMethods } from 'primevue/toastservice'
import { NotFoundError } from '@/services/api/errors'

const isLoading = ref(false)
const partner = ref<Partner>({
  name: '',
  cnpj: '',
  pictureURI: '',
  openingHours: '07:00',
  closingHours: '18:00',
  status: PartnerStatuses.Active,
  address: {
    cep: '',
    street: '',
    neighbourhood: '',
    number: null,
    complement: '',
    city: '',
    state: ''
  }
})

const file = ref<File | null>(null)

const rules = computed(() => ({
  name: { required: helpers.withMessage('Nome é obrigatório', required) },
  cnpj: { required: helpers.withMessage('CNPJ é obrigatório', required) },
  openingHours: { required: helpers.withMessage('Horário de abertura é obrigatório', required) },
  closingHours: {
    required: helpers.withMessage('Horário de encerramento é obrigatório', required)
  },
  status: { required: helpers.withMessage('Status é obrigatório', required) },
  address: {
    cep: { required: helpers.withMessage('CEP é obrigatório', required) },
    street: { required: helpers.withMessage('Preencha a Rua do Parceiro', required) },
    neighbourhood: { required: helpers.withMessage('Número é obrigatório', required) },
    number: { required: helpers.withMessage('Número é obrigatório', required) },
    city: { required: helpers.withMessage('Preencha a Cidade do Parceiro', required) },
    state: { required: helpers.withMessage('UF é obrigatório', required) }
  }
}))

const v$ = useVuelidate(rules, partner)

const reset = () => {
  partner.value = {
    name: '',
    cnpj: '',
    openingHours: '07:00',
    closingHours: '18:00',
    pictureURI: '',
    status: PartnerStatuses.Active,
    address: {
      cep: '',
      street: '',
      neighbourhood: '',
      number: null,
      complement: '',
      city: '',
      state: ''
    }
  }

  file.value = null
  v$.value.$reset()
}

const findPartnerById = async (id: number) => {
  try {
    isLoading.value = true
    const found = await Api.partners.findById(id)

    partner.value = {
      ...partner.value,
      ...found,
      address: found.address ?? partner.value.address
    }

    isLoading.value = false
  } catch (err) {
    if (err instanceof NotFoundError) {
      await router.push({ name: 'create-partner' })
    }

    throw err
  }
}

const uploadPicture = async () => {
  await Api.partners.uploadPicture(partner.value.id as number, file.value as File)
}
const createPartner = async () => {
  const created = await Api.partners.create(partner.value)

  partner.value = {
    ...partner.value,
    ...created,
    address: partner.value.address ?? created.address
  }

  if (file.value) {
    await uploadPicture()
  }
}

const updatePartner = async () => {
  const updated = await Api.partners.update(partner.value!.id as number, partner.value)

  partner.value = {
    ...partner.value,
    ...updated,
    address: partner.value.address ?? updated.address
  }

  if (file.value) {
    await uploadPicture()
  }
}

const createAddress = async () => {
  partner.value.address = await Api.partners.addresses.create(
    partner.value.id as number,
    partner.value.address
  )
}

const updateAddress = async () => {
  partner.value.address = await Api.partners.addresses.update(
    partner.value.id as number,
    partner.value.address.id as number,
    partner.value.address
  )

  if (file.value) {
    await uploadPicture()
  }
}

const goToPartners = async (toast: ToastServiceMethods) => {
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Parceiro salvo com sucesso',
    life: 2000
  })

  await router.push({
    name: 'list-partners'
  })
}

const savePartner = (toast: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    partner.value.name = partner.value.name.trim()

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (partner.value.id) {
      await updatePartner()
      await updateAddress()
      await goToPartners(toast)
      return
    }

    await createPartner()
    await createAddress()
    await goToPartners(toast)
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Erro ao Salvar',
      detail: (err as Error).message ?? 'Não foi possível salvar o Parceiro!',
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}

export const useSavePartner = (toast: ToastServiceMethods) => {
  return {
    isLoading,
    partner,
    file,
    v$,
    findPartnerById,
    savePartner: savePartner(toast),
    reset
  }
}
