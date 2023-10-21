import { computed, ref } from 'vue'
import { ProductCategory } from '@/services/api/types'
import { helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { Api } from '@/services/api/Api'
import router from '@/router'
import { ToastServiceMethods } from 'primevue/toastservice'

const isLoading = ref(false)
const productCategory = ref<ProductCategory>({
  name: ''
})

const rules = computed(() => ({
  name: { required: helpers.withMessage('Preencha o Nome da Categoria', required) }
}))

const v$ = useVuelidate(rules, productCategory)

const findProductCategoryById = async (id: number) => {
  isLoading.value = true
  productCategory.value = await Api.products.categories.findById(id)
  isLoading.value = false
}

const createProductCategory = async () => {
  await Api.products.categories.create(productCategory.value)
}

const updateProductCategory = async () => {
  await Api.products.categories.update(productCategory.value!.id as number, productCategory.value)
}

const goToProductCategories = async (toast: ToastServiceMethods) => {
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Categoria salva com sucesso',
    life: 2000
  })

  await router.push({
    name: 'product-categories'
  })
}

const saveProductCategory = (toast: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    productCategory.value.name = productCategory.value.name.trim()

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (productCategory.value.id) {
      await updateProductCategory()
      await goToProductCategories(toast)
      return
    }

    await createProductCategory()
    await goToProductCategories(toast)
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Erro ao Salvar',
      detail: err?.response?.data?.message ?? err.message ?? 'Não foi possível salvar a Categoria!',
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}

export const useSaveProductCategory = (toast: ToastServiceMethods) => {
  return {
    isLoading,
    productCategory,
    v$,
    findProductCategoryById,
    saveProductCategory: saveProductCategory(toast)
  }
}
