<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <div class="grid">
          <div class="col-12 md:col-6">
            <h1>Pedido #{{ `${order?.id}`.padStart(4, '0') }}</h1>
            <Button severity="success" label="Finalizado" />

            <p v-for="cartProduct in order?.cart" :key="cartProduct.id">
              {{ cartProduct.quantity }}x {{ cartProduct.partnerProduct?.product?.name }}
              {{ cartProduct.partnerProduct?.product?.size }} <br />
              <b>{{ formatValue(cartProduct.value * cartProduct.quantity) }}</b>
            </p>

            <h4>Cartão de Crédito/Debito no momento da entrega</h4>
            <h4>{{ formatValue(order?.totalValue) }}</h4>
          </div>
          <div class="col-12 md:col-6">
            <h4>Rua Matro Grosso, 293 - Água Verde</h4>
            <MapContainer :address="order?.address" />
          </div>
        </div>

        <div class="grid">
          <div class="col-6 md:col">
            <Button label="Aceitar Pedido" severity="info" />
          </div>
          <div class="col-6 md:col">
            <Button label="Recusar Pedido" severity="danger" />
          </div>
          <div class="col-6 md:col">
            <Button label="Saiu para Entrega" severity="info" />
          </div>
          <div class="col-6 md:col">
            <Button label="Finalizar Pedido" severity="success" />
          </div>

          <div class="col-6 md:col">
            <Button label="Cancelar Pedido" severity="danger" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapContainer from '@/components/MapContainer.vue'
import { Order } from '@/services/api/types'

const formatValue = (value?: number) => 'R$ ' + (value ?? 0 / 100).toFixed(2).replace('.', ',')

const order = ref<Order | null>()
</script>

<style scoped lang="scss"></style>
