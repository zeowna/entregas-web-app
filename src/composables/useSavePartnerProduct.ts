import { computed, ref } from 'vue'
import { PartnerProduct, PartnerProductStatus } from '@/services/api/types'
import { helpers, required } from '@vuelidate/validators'
import { Api } from '@/services/api/Api'
import { ToastServiceMethods } from 'primevue/toastservice'
import { NotFoundError } from '@/services/api/errors'
import router from '@/router'
import { useVuelidate } from '@vuelidate/core'
import { centsToValue } from '@/utils'

const partnerId = ref<number | null>()

const isLoading = ref(false)
const partnerProduct = ref<PartnerProduct>({
  value: 0,
  inStockQuantity: 0,
  status: PartnerProductStatus.Active
})

const rules = computed(() => ({
  value: { required: helpers.withMessage('Nome é obrigatório', required) },
  inStockQuantity: { required: helpers.withMessage('Data de nascimento é obrigatório', required) },
  status: {}
}))

const v$ = useVuelidate(rules, partnerProduct)

const reset = () => {
  partnerProduct.value = {
    value: 0,
    inStockQuantity: 0,
    status: PartnerProductStatus.Active
  }

  v$.value.$reset()
}

const findByPartnerIdAndId = async (partnerId: number, id: number) => {
  try {
    isLoading.value = true
    const found = await Api.partners.products.findByPartnerIdAndId(partnerId, id)

    partnerProduct.value = {
      ...found,
      value: centsToValue(found.value)
    }

    isLoading.value = false
  } catch (err) {
    if (err instanceof NotFoundError) {
      await router.push({ name: 'create-partner' })
    }

    throw err
  }
}

const createPartnerProduct = async () => {
  const payload = {
    ...partnerProduct.value,
    value: partnerProduct.value.value * 1000
  }

  const created = await Api.partners.products.create(partnerId.value as number, payload)

  partnerProduct.value = {
    ...created,
    value: centsToValue(created.value)
  }
}

const updatePartnerProduct = async () => {
  const payload = {
    ...partnerProduct.value,
    value: partnerProduct.value.value * 100
  }

  const updated = await Api.partners.products.update(
    partnerId.value as number,
    partnerProduct.value!.id as number,
    payload
  )

  partnerProduct.value = {
    ...updated,
    value: centsToValue(updated.value)
  }
}

const goToPartnerProducts = async (toast: ToastServiceMethods) => {
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Produto salvo com sucesso',
    life: 2000
  })

  await router.push({
    name: 'list-partner-products',
    params: { partnerId: partnerId.value }
  })
}

const savePartnerProduct = (toast: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (partnerProduct.value.id) {
      await updatePartnerProduct()
      await goToPartnerProducts(toast)
      return
    }

    await createPartnerProduct()
    await goToPartnerProducts(toast)
  } catch (err) {
    toast?.add({
      severity: 'error',
      summary: 'Erro ao Salvar',
      detail: (err as Error).message ?? 'Não foi possível salvar o Produto!',
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}

export const useSavePartnerProduct = (_partnerId: number, toast: ToastServiceMethods) => {
  partnerId.value = _partnerId

  return {
    isLoading,
    partnerProduct,
    v$,
    findByPartnerIdAndId,
    savePartnerProduct: savePartnerProduct(toast),
    reset
  }
}
