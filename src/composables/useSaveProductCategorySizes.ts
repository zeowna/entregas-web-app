import { ToastServiceMethods } from 'primevue/toastservice'
import { computed, ref } from 'vue'
import { ProductCategorySize } from '@/services/api/types'
import { helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { Api } from '@/services/api/Api'

const isLoading = ref(false)
const showCategoryForm = ref(false)
const productCategorySize = ref<ProductCategorySize>({
  name: ''
})
const data = ref<ProductCategorySize[]>([])
const productCategoryId = ref<number | null>()

const reset = () => {
  isLoading.value = false
  productCategoryId.value = null
  data.value = []
}

const rulesProductCategory = computed(() => ({
  name: { required: helpers.withMessage('Nome é obrigatório', required) }
}))

const v$ = useVuelidate(rulesProductCategory, productCategorySize)

const findProductCategorySizes = async (id: number) => {
  productCategoryId.value = id

  isLoading.value = true
  data.value = await Api.products.categories.sizes.findByCategoryId(productCategoryId.value)
  isLoading.value = false
}

const selectProductSize = async (selected: ProductCategorySize) => {
  showCategoryForm.value = true
  productCategorySize.value = selected
}

const createProductCategorySize = async () => {
  await Api.products.categories.sizes.create(
    productCategoryId.value as number,
    productCategorySize.value
  )

  productCategorySize.value = {
    name: ''
  }
}

const updateProductCategorySize = async () => {
  await Api.products.categories.sizes.update(
    productCategoryId.value as number,
    productCategorySize.value!.id as number,
    productCategorySize.value
  )

  productCategorySize.value = {
    name: ''
  }
}

const saveProductCategorySize = (toast: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    productCategorySize.value.name = productCategorySize.value.name.trim()

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (productCategorySize.value.id) {
      await updateProductCategorySize()
      showCategoryForm.value = false
      return
    }

    await createProductCategorySize()
    showCategoryForm.value = false
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Erro ao Salvar',
      detail: (err as Error).message ?? 'Não foi possível salvar o Tamanho!',
      life: 5000
    })
  } finally {
    isLoading.value = false
    await findProductCategorySizes(productCategoryId.value as number)
  }
}

export const useSaveProductCategorySizes = (toast: ToastServiceMethods) => {
  return {
    isLoading,
    data,
    showCategoryForm,
    v$,
    findProductCategorySizes,
    selectProductSize,
    saveProductCategorySize: saveProductCategorySize(toast),
    reset
  }
}
