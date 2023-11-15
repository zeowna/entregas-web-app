import { computed, ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, PartnerProduct } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent } from 'primevue/datatable'
import router from '@/router'
import { useRoute } from 'vue-router'

export const useListPartnerProducts = () => {
  const route = useRoute()
  const limit = 25
  const partnerId = computed(() =>
    route.params.partnerId ? Number.parseInt(route.params.partnerId as string) : null
  )

  const data = ref<FindEntitiesResponse<PartnerProduct>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const isLoading = ref(false)

  const findPartnerProducts = async (partnerId: number, params: FindEntitiesPaging = { limit }) => {
    isLoading.value = true
    data.value = await Api.partners.products.find(partnerId, params)
    isLoading.value = false
  }

  const onPage = async (e: DataTablePageEvent) => {
    await findPartnerProducts(partnerId.value as number, {
      skip: data.value.limit * e.page,
      limit
    })
  }

  const goToPartnerProduct = async (partnerId: number, id?: number) => {
    if (id) {
      await router.push({
        name: 'edit-partner-product',
        params: { partnerId, id }
      })

      return
    }

    await router.push({
      name: 'create-partner-product',
      params: { partnerId }
    })
  }

  return {
    data,
    isLoading,
    findPartnerProducts,
    onPage,
    goToPartnerProduct
  }
}
