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
  categoryId: null,
  size: null,
  pictureURI: null,
  status: ProductStatus.Active
})

const base64data = ref<string | ArrayBuffer | null>(null)

const rules = computed(() => ({
  name: { required: helpers.withMessage('Preencha o Nome do Produto', required) },
  categoryId: { required: helpers.withMessage('Selecione a Categoria do Produto', required) },
  size: { required: helpers.withMessage('Selecione o Tamanho do Produto', required) },
  status: { required: helpers.withMessage('Selecione o Status do Produto', required) }
}))

const v$ = useVuelidate(rules, product)

const reset = () => {
  product.value = {
    name: '',
    categoryId: null,
    size: null,
    pictureURI: null,
    status: ProductStatus.Active
  }
  v$.value.$reset()
}

const findProductById = async (id: number) => {
  try {
    isLoading.value = true
    product.value = await Api.products.findById(id)
    product.value.categoryId = product.value.category.id
    isLoading.value = false
  } catch (err) {
    if (err instanceof NotFoundError) {
      await router.push({ name: 'create-product' })
    }

    throw err
  }
}

const uploadPicture = async () => {
  await Api.products.uploadPicture(product.value!.id, base64data.value)
}
const createProduct = async () => {
  product.value = await Api.products.create(product.value)

  if (base64data.value) {
    await uploadPicture()
  }
}

const updateProduct = async () => {
  product.value = await Api.products.update(product.value!.id as number, product.value)

  if (base64data.value) {
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
      detail: err?.response?.data?.message ?? err.message ?? 'Não foi possível salvar o Produto!',
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
    base64data,
    v$,
    findProductById,
    saveProduct: saveProduct(toast),
    reset
  }
}
