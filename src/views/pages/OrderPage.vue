<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <div class="grid">
          <div class="col-6">
            <h1>Pedido #{{ `${order.id}`.padStart(4, '0') }}</h1>
            <Button severity="success" label="Finalizado" />

            <p v-for="product in order.cart" :key="product.productId">
              {{ product.quantity }}x {{ product.name }} {{ product.size }} <br />
              <b>{{ formatValue(product.value * product.quantity) }}</b>
            </p>

            <h3>Cartão de Crédito/Debito no momento da entrega</h3>
            <h2>{{ formatValue(order.totalValue) }}</h2>
          </div>
          <div class="col-6">
            <MapContainer />
          </div>
        </div>

        <div class="grid">
          <div class="col">
            <Button label="Aceitar Pedido" severity="info" />
          </div>
          <div class="col">
            <Button label="Recusar Pedido" severity="danger" />
          </div>
          <div class="col">
            <Button label="Saiu para Entrega" severity="info" />
          </div>
          <div class="col">
            <Button label="Cancelar Pedido" severity="danger" />
          </div>
          <div class="col">
            <Button label="Finalizar Pedido" severity="success" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapContainer from '@/components/MapContainer.vue'

const formatValue = (value: number) => 'R$ ' + (value / 100).toFixed(2).replace('.', ',')

const order = ref({
  id: 2,
  status: 'settled',
  totalValue: 3400 + 4 * 12000,
  cart: [
    { name: 'Botijão de Gás', size: 'p13', quantity: 2, value: 12000, productId: 1 },
    { name: 'Galão D`agua Fontlife', size: '20l', quantity: 1, value: 3400, productId: 1 }
  ]
})
</script>

<style scoped lang="scss"></style>
