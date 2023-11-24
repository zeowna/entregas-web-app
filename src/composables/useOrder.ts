import { ref } from 'vue'
import { Order, OrderStatus } from '@/services/api/types'
import { Api } from '@/services/api/Api'

const isLoading = ref(false)
const order = ref<Order | null>()

const reset = () => {
  order.value = null
}

const findOrder = async (partnerId: number, id: number) => {
  isLoading.value = true

  order.value = await Api.partners.orders.findById(partnerId, id)

  isLoading.value = false
}

const acceptOrder = async (partnerId: number) => {
  isLoading.value = true

  order.value = await Api.partners.orders.updateStatus(
    partnerId,
    order.value?.id!,
    OrderStatus.AcceptedByPartner
  )

  isLoading.value = false
}

const refuseOrder = async (partnerId: number) => {
  isLoading.value = true

  order.value = await Api.partners.orders.updateStatus(
    partnerId,
    order.value?.id!,
    OrderStatus.RefusedByPartner
  )

  isLoading.value = false
}

const deliverOrder = async (partnerId: number) => {
  isLoading.value = true

  order.value = await Api.partners.orders.updateStatus(
    partnerId,
    order.value?.id!,
    OrderStatus.InDelivery
  )

  isLoading.value = false
}

const settleOrder = async (partnerId: number) => {
  isLoading.value = true

  order.value = await Api.partners.orders.updateStatus(
    partnerId,
    order.value?.id!,
    OrderStatus.Settled
  )

  isLoading.value = false
}

const cancelOrder = async (partnerId: number) => {
  isLoading.value = true

  order.value = await Api.partners.orders.updateStatus(
    partnerId,
    order.value?.id!,
    OrderStatus.CanceledByPartner
  )

  isLoading.value = false
}

export const useOrder = () => {
  return {
    isLoading,
    order,
    reset,
    findOrder,
    acceptOrder,
    refuseOrder,
    deliverOrder,
    settleOrder,
    cancelOrder
  }
}
