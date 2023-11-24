import { computed, ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, Order } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import router from '@/router'
import { useRoute } from 'vue-router'

export const useListPartnerOrders = () => {
  const route = useRoute()
  const partnerId = computed(() => (route.params.partnerId ? +route.params.partnerId : null))
  const params = ref<FindEntitiesPaging>({
    conditions: {},
    skip: 0,
    limit: 25
  })
  const data = ref<FindEntitiesResponse<Order>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const orderNumber = ref<string>('')
  const isLoading = ref(false)

  const findOrders = async (partnerId: number) => {
    isLoading.value = true
    data.value = await Api.partners.orders.find(partnerId, params.value)
    isLoading.value = false
  }

  const onSort = async (e: DataTableSortEvent) => {
    params.value.sort = {
      [e.sortField as string]: e.sortOrder
    }
    await findOrders(partnerId.value!)
  }

  const onSearch = async () => {
    if (orderNumber.value.length) {
      params.value.conditions = {
        ...params.value.conditions,
        id: { eq: Number.parseInt(orderNumber.value) }
      }
    } else {
      params.value.conditions = {
        ...params.value.conditions,
        id: undefined
      }
    }

    await findOrders(partnerId.value as number)
  }

  const onPage = async (e: DataTablePageEvent) => {
    params.value.skip = data.value.limit * e.page

    await findOrders(partnerId.value as number)
  }

  const goToOrder = async (partnerId: number, id?: number) => {
    if (id) {
      await router.push({
        name: 'partner-order-details',
        params: { partnerId, id }
      })

      return
    }
  }

  return {
    params,
    orderNumber,
    data,
    isLoading,
    findOrders,
    onSort,
    onSearch,
    onPage,
    goToOrder
  }
}
