import { ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, ProductCategory } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent } from 'primevue/datatable'
import router from '@/router'

export const useListPartnerUsers = () => {
  const limit = 25

  const data = ref<FindEntitiesResponse<ProductCategory>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const isLoading = ref(false)

  const findPartnerUsers = async (params: FindEntitiesPaging = { limit }) => {
    isLoading.value = true
    data.value = await Api.partners.users.find(params)
    isLoading.value = false
  }

  const onPage = async (e: DataTablePageEvent) => {
    await findPartnerUsers({
      skip: data.value.limit * e.page,
      limit
    })
  }

  const goToPartnerUser = async (partnerId: number, id?: number) => {
    if (id) {
      await router.push({
        name: 'edit-partner-user',
        params: { partnerId, id }
      })

      return
    }

    await router.push({
      name: 'create-partner-user',
      params: { partnerId }
    })
  }

  return {
    data,
    isLoading,
    findPartnerUsers,
    onPage,
    goToPartnerUser
  }
}
