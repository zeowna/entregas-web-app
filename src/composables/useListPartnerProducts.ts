import { computed, ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, PartnerProduct } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent } from 'primevue/datatable'
import router from '@/router'
import { useRoute } from 'vue-router'

export const useListPartnerProducts = () => {
  const route = useRoute()
  const partnerId = computed(() => (route.params.partnerId ? +route.params.partnerId : null))
  const params = ref<FindEntitiesPaging>({
    conditions: {},
    skip: 0,
    limit: 25
  })
  const data = ref<FindEntitiesResponse<PartnerProduct>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const productName = ref<string | null>()
  const isLoading = ref(false)

  const findPartnerProducts = async (partnerId: number) => {
    isLoading.value = true
    data.value = await Api.partners.products.find(partnerId, params.value)
    isLoading.value = false
  }

  const onSearch = async () => {
    params.value.conditions = {
      name: { contains: (productName.value || '').trim() }
    }

    await findPartnerProducts(partnerId.value as number)
  }

  const onPage = async (e: DataTablePageEvent) => {
    params.value.skip = data.value.limit * e.page

    await findPartnerProducts(partnerId.value as number)
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
    params,
    productName,
    data,
    isLoading,
    findPartnerProducts,
    onSearch,
    onPage,
    goToPartnerProduct
  }
}
