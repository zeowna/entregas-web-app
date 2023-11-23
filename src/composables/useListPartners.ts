import { ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, Partner } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import router from '@/router'

export const useListPartners = () => {
  const data = ref<FindEntitiesResponse<Partner>>({
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
  const partnerName = ref<string | null>()
  const isLoading = ref(false)

  const findPartners = async () => {
    isLoading.value = true
    data.value = await Api.partners.find(params.value)
    isLoading.value = false
  }

  const onSort = async (e: DataTableSortEvent) => {
    params.value.sort = {
      [e.sortField as string]: e.sortOrder
    }
    await findPartners()
  }

  const onSearch = async () => {
    params.value.conditions = {
      name: { contains: (partnerName.value || '').trim() }
    }

    await findPartners()
  }

  const onPage = async (e: DataTablePageEvent) => {
    params.value.skip = data.value.limit * e.page

    await findPartners()
  }

  const goToPartner = async (id?: number) => {
    if (id) {
      await router.push({
        name: 'edit-partner',
        params: { id }
      })

      return
    }

    await router.push({
      name: 'create-partner'
    })
  }

  return {
    data,
    partnerName,
    isLoading,
    findPartners,
    onSort,
    onSearch,
    onPage,
    goToPartner
  }
}
