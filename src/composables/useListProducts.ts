import { ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, Product } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import router from '@/router'

export const useListProducts = () => {
  const data = ref<FindEntitiesResponse<Product>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const params = ref<FindEntitiesPaging>({
    conditions: {},
    skip: 0,
    limit: 25,
    sort: { updatedAt: -1 }
  })
  const productName = ref<string | null>()
  const isLoading = ref(false)

  const findProducts = async () => {
    isLoading.value = true
    data.value = await Api.products.find(params.value)
    isLoading.value = false
  }

  const onSort = async (e: DataTableSortEvent) => {
    params.value.sort = {
      [e.sortField as string]: e.sortOrder
    }
    await findProducts()
  }

  const onSearch = async () => {
    params.value.conditions = {
      name: { contains: (productName.value || '').trim() }
    }

    await findProducts()
  }

  const onPage = async (e: DataTablePageEvent) => {
    params.value.skip = data.value.limit * e.page

    await findProducts()
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
    params,
    productName,
    data,
    isLoading,
    findProducts,
    onSort,
    onSearch,
    onPage,
    goToProduct
  }
}
