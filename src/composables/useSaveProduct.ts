import { computed, ref } from 'vue'
import { Product, ProductStatus } from '@/services/api/types'
import { helpers, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { Api } from '@/services/api/Api'
import router from '@/router'
import { ToastServiceMethods } from 'primevue/toastservice'
import { NotFoundError } from '@/services/api/errors'

const isLoading = ref(false)
const product = ref<Product>({
  name: '',
  categoryId: undefined,
  size: '',
  pictureURI: '',
  status: ProductStatus.Active
})

const file = ref<File | null>(null)

const rules = computed(() => ({
  name: { required: helpers.withMessage('Nome é obrigatório', required) },
  categoryId: { required: helpers.withMessage('Categoria é obrigatório', required) },
  size: { required: helpers.withMessage('Tamanho é obrigatório', required) },
  status: { required: helpers.withMessage('Status é obrigatório', required) }
}))

const v$ = useVuelidate(rules.value, product as any)

const reset = () => {
  product.value = {
    name: '',
    categoryId: null,
    size: '',
    pictureURI: '',
    status: ProductStatus.Active
  }
  v$.value.$reset()
}

const findProductById = async (id: number) => {
  try {
    isLoading.value = true
    product.value = await Api.products.findById(id)
    product.value.categoryId = product.value?.category?.id
  } catch (err) {
    if (err instanceof NotFoundError) {
      await router.push({ name: 'create-product' })
    }

    throw err
  } finally {
    isLoading.value = false
  }
}

const uploadPicture = async () => {
  await Api.products.uploadPicture(product.value?.id as number, file.value as File)
}
const createProduct = async () => {
  product.value = await Api.products.create(product.value)
  product.value.categoryId = product.value?.category?.id

  if (file.value) {
    await uploadPicture()
  }
}

const updateProduct = async () => {
  product.value = await Api.products.update(product.value!.id as number, product.value)
  product.value.categoryId = product.value?.category?.id

  if (file.value) {
    await uploadPicture()
  }
}

const goToProducts = async (toast: ToastServiceMethods) => {
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Produto salvo com sucesso',
    life: 2000
  })

  await router.push({
    name: 'list-products'
  })
}

const saveProduct = (toast: ToastServiceMethods) => async () => {
  try {
    isLoading.value = true

    product.value.name = product.value.name.trim()

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (product.value.id) {
      await updateProduct()
      await goToProducts(toast)
      return
    }

    await createProduct()
    await goToProducts(toast)
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Erro ao Salvar',
      detail: (err as Error).message ?? 'Não foi possível salvar o Produto!',
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}

export const useSaveProduct = (toast: ToastServiceMethods) => {
  return {
    isLoading,
    product,
    file,
    v$,
    findProductById,
    saveProduct: saveProduct(toast),
    reset
  }
}
