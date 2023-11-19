import { ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, ProductCategory } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import router from '@/router'

export const useListProductCategories = () => {
  const data = ref<FindEntitiesResponse<ProductCategory>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const params = ref<FindEntitiesPaging>({
    conditions: {},
    skip: 0,
    limit: 25
  })
  const categoryName = ref<string | null>()
  const isLoading = ref(false)

  const findProductCategories = async () => {
    isLoading.value = true
    data.value = await Api.products.categories.find(params.value)
    isLoading.value = false
  }

  const onSearch = async () => {
    params.value.conditions = {
      name: { contains: (categoryName.value || '').trim() }
    }

    await findProductCategories()
  }

  const onSort = async (e: DataTableSortEvent) => {
    params.value.sort = {
      [e.sortField as string]: e.sortOrder
    }
    await findProductCategories()
  }

  const onPage = async (e: DataTablePageEvent) => {
    params.value.skip = data.value.limit * e.page

    await findProductCategories()
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
      name: 'create-product-category'
    })
  }

  return {
    data,
    categoryName,
    isLoading,
    findProductCategories,
    onSort,
    onSearch,
    onPage,
    goToProductCategory
  }
}
