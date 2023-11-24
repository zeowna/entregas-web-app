<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-2">
        <DataTable
          :value="data.list"
          lazy
          paginator
          :first="0"
          :rows="data.limit"
          :totalRecords="data.count"
          :loading="isLoading"
          @page="onPage($event)"
          @sort="onSort"
          sortField="updatedAt"
          :sortOrder="-1"
        >
          <template #header>
            <div class="flex flex-wrap align-items-center justify-content-between">
              <h5>Listar Pedidos</h5>
            </div>
            <div class="flex justify-content-start">
              <Button
                v-if="!realTimeEnabled"
                label="Ativar carregamento em tempo real"
                @click="enableRealtime"
                :icon="PrimeIcons.REPLAY"
                icon-pos="right"
              />

              <Button
                v-if="realTimeEnabled"
                label="Parar carregamento em tempo real"
                @click="disableRealTime"
                :icon="PrimeIcons.STOP_CIRCLE"
                icon-pos="right"
                severity="danger"
              />
            </div>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  type="number"
                  v-model="orderNumber"
                  placeholder="Número do Pedido"
                  @blur="onSearch"
                />
              </span>
            </div>
          </template>
          <Column field="id" header="Número" :sortable="!realTimeEnabled">
            <template #body="slotProps"> #{{ formatOrderNumber(slotProps.data.id) }}</template>
          </Column>
          <Column field="address" header="Endereço">
            <template #body="slotProps">
              {{ formatAddressSmall(slotProps.data.address) }}
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="!realTimeEnabled">
            <template #body="slotProps">
              <Tag
                :value="formatOrderStatus(slotProps.data.status)"
                :severity="getOrderStatusColorWeb(slotProps.data.status!)"
              />
            </template>
          </Column>
          <Column field="totalValue" header="Valor Total" :sortable="!realTimeEnabled">
            <template #body="slotProps">
              {{ centsToCurrency(slotProps.data.totalValue) }}
            </template>
          </Column>
          <Column
            field="statusUpdatedAt"
            header="Atualização de Status"
            :sortable="!realTimeEnabled"
          >
            <template #body="slotProps">
              {{ new Date(slotProps.data.statusUpdatedAt).toLocaleDateString() }} -
              {{ new Date(slotProps.data.statusUpdatedAt).toLocaleTimeString() }}
            </template>
          </Column>
          <Column field="updatedAt" header="Data Edição" :sortable="!realTimeEnabled">
            <template #body="slotProps">
              {{ new Date(slotProps.data.updatedAt).toLocaleDateString() }} -
              {{ new Date(slotProps.data.updatedAt).toLocaleTimeString() }}
            </template>
          </Column>
          <Column header="Ações">
            <template #body="slotProps">
              <Button
                severity="success"
                v-tooltip="'Ver Pedido'"
                :icon="PrimeIcons.MONEY_BILL"
                @click="goToOrder(+route.params.partnerId, slotProps.data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useListPartnerOrders } from '@/composables'
import { useRoute, useRouter } from 'vue-router'
import { PrimeIcons } from 'primevue/api'
import {
  centsToCurrency,
  formatAddressSmall,
  formatOrderNumber,
  formatOrderStatus,
  getOrderStatusColorWeb
} from '@/utils'
import { store } from '@/store'
import { PartnerUser } from '@/services/api/types'
import { socket } from '@/services/socket/Socket'

const route = useRoute()
const router = useRouter()

const { isLoading, params, orderNumber, data, onSearch, onSort, onPage, findOrders, goToOrder } =
  useListPartnerOrders()
const user = computed(() => store.getters.getUser)

const realTimeEnabled = ref(false)

const enableRealtime = async () => {
  realTimeEnabled.value = true

  socket.connect()

  socket.on(`partner-order-updated-${user.value.partner.id}`, (order) => {
    const found = data.value.list.findIndex(({ id }) => id === order.id)

    if (found > -1) {
      data.value.list.splice(found, 1)
    }

    data.value.list.unshift(order)
  })
}

const disableRealTime = async () => {
  params.value = {
    conditions: {},
    skip: 0,
    limit: 25,
    sort: { statusUpdatedAt: -1 }
  }

  realTimeEnabled.value = false

  await findOrders(+route.params.partnerId)
  socket.disconnect()
}

onMounted(async () => {
  const partnerUser = user.value as PartnerUser

  if (partnerUser?.partner && partnerUser?.partner?.id !== +route.params.partnerId) {
    await router.push({
      name: 'list-partner-orders',
      params: {
        partnerId: partnerUser?.partner?.id
      }
    })
  }

  await findOrders(+route.params.partnerId)
})

onUnmounted(() => {
  disableRealTime()
})
</script>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
