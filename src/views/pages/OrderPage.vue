<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <div class="grid">
          <div class="col-12 md:col-6">
            <h1>Pedido #{{ formatOrderNumber(order?.id!) }}</h1>
            <Tag
              :value="formatOrderStatus(order?.status!)"
              :severity="getOrderStatusColorWeb(order?.status!)"
            />

            <h2>Listagem de produtos</h2>
            <p v-for="cartProduct in order?.cart" :key="cartProduct.id">
              {{ cartProduct.quantity }}x {{ cartProduct.partnerProduct?.product?.name }}
              {{ cartProduct.partnerProduct?.product?.size }} <br />
              <b>{{ centsToCurrency(cartProduct.totalValue / cartProduct.quantity) }}</b>
            </p>

            <h4>{{ formatOrderPaymentMethod(order?.paymentMethod!) }}</h4>
            <p>{{ centsToCurrency(order?.totalValue!) }}</p>
            <h4 v-if="order?.paymentMethod === OrderPaymentMethods.CashLocation">Troco para</h4>
            <p v-if="order?.paymentMethod === OrderPaymentMethods.CashLocation">
              {{ centsToCurrency(order?.changeValue!) }}
            </p>
            <h4>Cliente</h4>
            <p>{{ order?.customer?.name?.split(' ')[0] }}</p>
          </div>
          <div class="col-12 md:col-6">
            <h4>{{ formatAddress(order?.address!) }}</h4>
            <MapContainer :address="order?.address" v-if="order?.address" />
          </div>
        </div>

        <div class="grid">
          <div class="col-6 md:col" v-if="order?.status === OrderStatus.AwaitingPartner">
            <Button
              label="Aceitar Pedido"
              severity="warning"
              @click="acceptOrder(+route.params.partnerId)"
            />
          </div>
          <div class="col-6 md:col" v-if="order?.status === OrderStatus.AwaitingPartner">
            <Button
              label="Recusar Pedido"
              severity="danger"
              @click="refuseOrder(+route.params.partnerId)"
            />
          </div>
          <div class="col-6 md:col" v-if="order?.status === OrderStatus.AcceptedByPartner">
            <Button
              label="Saiu para Entrega"
              severity="info"
              @click="deliverOrder(+route.params.partnerId)"
            />
          </div>
          <div class="col-6 md:col" v-if="order?.status === OrderStatus.InDelivery">
            <Button
              label="Finalizar Pedido"
              severity="success"
              @click="settleOrder(+route.params.partnerId)"
            />
          </div>

          <div
            class="col-6 sm:col"
            v-if="
              order?.status === OrderStatus.InDelivery ||
              order?.status === OrderStatus.AcceptedByPartner
            "
          >
            <Button
              label="Cancelar Pedido"
              severity="danger"
              @click="cancelOrder(+route.params.partnerId)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoadingSpinner :isLoading="isLoading" />
</template>

<script setup lang="ts">
import { useOrder } from '@/composables'
import {
  centsToCurrency,
  formatAddress,
  formatOrderNumber,
  formatOrderPaymentMethod,
  formatOrderStatus,
  getOrderStatusColorWeb
} from '@/utils'
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { OrderPaymentMethods, OrderStatus } from '@/services/api/types'
import MapContainer from '@/components/MapContainer.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { socket } from '@/services/socket/Socket'
import { store } from '@/store'

const route = useRoute()
const {
  isLoading,
  order,
  reset,
  findOrder,
  acceptOrder,
  refuseOrder,
  deliverOrder,
  settleOrder,
  cancelOrder
} = useOrder()

const user = computed(() => store.getters.getUser)

onMounted(async () => {
  reset()

  socket.connect()

  socket.on(`partner-order-updated-${user.value.partner.id}`, (updated) => {
    if (updated.id === order.value?.id) {
      isLoading.value = true
      order.value = updated
      isLoading.value = false
    }
  })

  await findOrder(+route.params.partnerId, +route.params.id)
})

onUnmounted(() => {
  reset()
})
</script>

<style scoped lang="scss"></style>
