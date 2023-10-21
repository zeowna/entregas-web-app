import { ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, ProductCategory } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent } from 'primevue/datatable'
import router from '@/router'

export const useListProductCategories = () => {
  const limit = 25

  const data = ref<FindEntitiesResponse<ProductCategory>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const isLoading = ref(false)

  const findProductCategories = async (params: FindEntitiesPaging = { limit }) => {
    isLoading.value = true
    data.value = await Api.products.categories.find(params)
    isLoading.value = false
  }

  const onPage = async (e: DataTablePageEvent) => {
    await findProductCategories({
      skip: data.value.limit * e.page,
      limit
    })
  }

  const goToProductCategory = async (id?: number) => {
    if (id) {
      await router.push({
        name: 'edit-product-category',
        params: { id }
      })

      return
    }

    await router.push({
      name: 'product-category'
    })
  }

  return {
    data,
    isLoading,
    findProductCategories,
    onPage,
    goToProductCategory
  }
}
