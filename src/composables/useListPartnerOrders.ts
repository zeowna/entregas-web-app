import { computed, ref } from 'vue'
import { FindEntitiesPaging, FindEntitiesResponse, Order, OrderStatus } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import { useRoute, useRouter } from 'vue-router'
import { DateTime } from 'luxon'

export const useListPartnerOrders = () => {
  const router = useRouter()
  const route = useRoute()

  const partnerId = computed(() => (route.params.partnerId ? +route.params.partnerId : null))
  const params = ref<FindEntitiesPaging>({
    conditions: {
      status: {
        in: [
          OrderStatus.AwaitingPartner,
          OrderStatus.CanceledByPartner,
          OrderStatus.CanceledByCustomer,
          OrderStatus.AcceptedByPartner,
          OrderStatus.RefusedByPartner,
          OrderStatus.AwaitingExecution,
          OrderStatus.InDelivery,
          OrderStatus.Settled
        ]
      }
    },
    skip: 0,
    limit: 25,
    sort: { statusUpdatedAt: -1 }
  })
  const data = ref<FindEntitiesResponse<Order>>({
    list: [],
    count: 0,
    skip: 0,
    limit: 0,
    pages: 0
  })
  const filter = ref<{
    orderNumber: string | null
    startDate: Date | null
    finalDate: Date | null
  }>({
    orderNumber: null,
    startDate: null,
    finalDate: null
  })

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
    if (filter.value.orderNumber?.length) {
      params.value.conditions = {
        ...params.value.conditions,
        id: { eq: Number.parseInt(filter.value.orderNumber) }
      }
    } else {
      params.value.conditions = {
        ...params.value.conditions,
        id: undefined
      }
    }

    if (filter.value.startDate) {
      params.value.conditions = {
        ...params.value.conditions,
        statusUpdatedAt: {
          gte: DateTime.fromJSDate(filter.value.startDate as unknown as Date)
            .startOf('day')
            .toJSDate()
        }
      }
    } else {
      params.value.conditions = {
        ...params.value.conditions,
        statusUpdatedAt: undefined
      }
    }

    if (filter.value.finalDate) {
      params.value.conditions = {
        ...params.value.conditions,
        statusUpdatedAt: {
          ...params.value.conditions.statusUpdatedAt,
          lte: DateTime.fromJSDate(filter.value.finalDate as unknown as Date)
            .endOf('day')
            .toJSDate()
        }
      }
    } else {
      params.value.conditions = {
        ...params.value.conditions,
        statusUpdatedAt: undefined
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
      const routeData = router.resolve({
        name: 'partner-order-details',
        params: { partnerId, id }
      })

      window.open(routeData.href, '_blank')
    }
  }

  return {
    params,
    filter,
    data,
    isLoading,
    findOrders,
    onSort,
    onSearch,
    onPage,
    goToOrder
  }
}
