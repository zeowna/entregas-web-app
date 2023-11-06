import { computed, ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, ProductCategory } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent } from 'primevue/datatable'
import router from '@/router'
import { useRoute } from 'vue-router'

export const useListPartnerUsers = () => {
  const route = useRoute()
  const limit = 25
  const partnerId = computed(() =>
    route.params.partnerId ? Number.parseInt(route.params.partnerId as string) : null
  )

  const data = ref<FindEntitiesResponse<ProductCategory>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const isLoading = ref(false)

  const findPartnerUsers = async (partnerId: number, params: FindEntitiesPaging = { limit }) => {
    isLoading.value = true
    data.value = await Api.partners.users.find(partnerId, params)
    isLoading.value = false
  }

  const onPage = async (e: DataTablePageEvent) => {
    await findPartnerUsers(partnerId.value as number, {
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
