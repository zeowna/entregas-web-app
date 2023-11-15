import { ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, Product } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent } from 'primevue/datatable'
import router from '@/router'

export const useListProducts = () => {
  const limit = 25

  const data = ref<FindEntitiesResponse<Product>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const isLoading = ref(false)

  const findProducts = async (params: FindEntitiesPaging = { limit }) => {
    isLoading.value = true
    data.value = await Api.products.find(params)
    isLoading.value = false
  }

  const onPage = async (e: DataTablePageEvent) => {
    await findProducts({
      skip: data.value.limit * e.page,
      limit
    })
  }

  const goToProduct = async (id?: number) => {
    if (id) {
      await router.push({
        name: 'edit-product',
        params: { id }
      })

      return
    }

    await router.push({
      name: 'create-product'
    })
  }

  return {
    data,
    isLoading,
    findProducts,
    onPage,
    goToProduct
  }
}
