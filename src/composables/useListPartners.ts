import { ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, Partner } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent } from 'primevue/datatable'
import router from '@/router'

export const useListPartners = () => {
  const limit = 25

  const data = ref<FindEntitiesResponse<Partner>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const isLoading = ref(false)

  const findPartners = async (params: FindEntitiesPaging = { limit }) => {
    isLoading.value = true
    data.value = await Api.partners.find(params)
    isLoading.value = false
  }

  const onPage = async (e: DataTablePageEvent) => {
    await findPartners({
      skip: data.value.limit * e.page,
      limit
    })
  }

  const goToPartner = async (id?: number) => {
    if (id) {
      await router.push({
        name: 'edit-partner-category',
        params: { id }
      })

      return
    }

    await router.push({
      name: 'create-partner-category'
    })
  }

  return {
    data,
    isLoading,
    findPartners,
    onPage,
    goToPartner
  }
}
