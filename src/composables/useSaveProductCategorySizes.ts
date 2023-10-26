import { ToastServiceMethods } from 'primevue/toastservice'
import { computed, ref } from 'vue'
import { ProductCategorySize } from '@/services/api/types'
import { helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { Api } from '@/services/api/Api'
import { useSaveProductCategory } from '@/composables/useSaveProductCategory'

const { productCategory } = useSaveProductCategory()

const isLoading = ref(false)
const showCategoryForm = ref(false)
const productCategorySize = ref<ProductCategorySize>({
  name: ''
})

const reset = () => {
  isLoading.value = false
  productCategory.value = {
    name: ''
  }
}

const data = ref<ProductCategorySize[]>([])

const rulesProductCategory = computed(() => ({
  name: { required: helpers.withMessage('Nome é obrigatório', required) }
}))

const v$ = useVuelidate(rulesProductCategory, productCategorySize)

const findProductCategorySizes = async (id?: number) => {
  isLoading.value = true
  data.value = await Api.products.categories.sizes.findByCategoryId(
    id ?? (productCategory.value.id as number)
  )
  isLoading.value = false
}

const selectProductSize = async (selected: ProductCategorySize) => {
  showCategoryForm.value = true
  productCategorySize.value = selected
  productCategorySize.value.categoryId = productCategory.value.id
}

const createProductCategorySize = async () => {
  await Api.products.categories.sizes.create(productCategorySize.value)
}

const updateProductCategorySize = async () => {
  await Api.products.categories.sizes.update(
    productCategorySize.value!.id as number,
    productCategorySize.value
  )
}

const saveProductCategorySize = (toast: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    productCategorySize.value.name = productCategorySize.value.name.trim()
    productCategorySize.value.categoryId = productCategory.value.id

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
      detail: err?.response?.data?.message ?? err.message ?? 'Não foi possível salvar o Tamanho!',
      life: 5000
    })
  } finally {
    isLoading.value = false
    await findProductCategorySizes()
  }
}

export const useSaveProductCategorySizes = (toast: ToastServiceMethods) => {
  return {
    data,
    showCategoryForm,
    v$,
    findProductCategorySizes,
    selectProductSize,
    saveProductCategorySize: saveProductCategorySize(toast),
    reset
  }
}
