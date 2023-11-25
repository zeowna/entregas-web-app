<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-2">
        <DataTable
          :value="data.list"
          lazy
          :paginator="!realTimeEnabled"
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
            <div class="flex flex-wrap align-items-center justify-content-start">
              <h5>Listar Pedidos</h5>
            </div>
            <div class="grid">
              <div class="col-12 md:col-7">
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
              <div class="col-12 md:col-5">
                <form @submit.prevent="onSearch">
                  <div class="grid">
                    <div class="col-12 md:col-4">
                      <Calendar
                        v-model="filter.startDate"
                        dateFormat="dd/mm/yy"
                        :maxDate="new Date()"
                        placeholder="Data inicial"
                        showButtonBar
                      />
                    </div>
                    <div class="col-12 md:col-4">
                      <Calendar
                        v-model="filter.finalDate"
                        dateFormat="dd/mm/yy"
                        :maxDate="new Date()"
                        placeholder="Data final"
                        showButtonBar
                      />
                    </div>
                    <div class="col-12 md:col-4">
                      <InputText
                        type="number"
                        v-model="filter.orderNumber"
                        placeholder="Número do Pedido"
                      />
                    </div>

                    <Button type="submit" v-show="false"></Button>
                  </div>
                </form>
              </div>
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
import { DateTime } from 'luxon'

const route = useRoute()
const router = useRouter()

const { isLoading, params, filter, data, onSearch, onSort, onPage, findOrders, goToOrder } =
  useListPartnerOrders()
const user = computed(() => store.getters.getUser)

const realTimeEnabled = ref(false)

const enableRealtime = async () => {
  realTimeEnabled.value = true
  params.value.skip = 0
  params.value.limit = 1000
  params.value.sort = { statusUpdatedAt: -1 }

  filter.value.startDate = DateTime.now().startOf('day').toJSDate()
  filter.value.finalDate = DateTime.now().endOf('day').toJSDate()
  filter.value.orderNumber = null

  await onSearch()

  socket.on(`partner-order-updated-${user.value.partner.id}`, (updated) => {
    const found = data.value.list.findIndex(({ id }) => id === updated.id)

    if (found > -1) {
      data.value.list.splice(found, 1)
    }

    data.value.list.unshift(updated)
  })
}

const disableRealTime = async () => {
  filter.value.startDate = null
  filter.value.finalDate = null
  filter.value.orderNumber = null

  params.value.skip = 0
  params.value.limit = 25
  params.value.sort = { statusUpdatedAt: -1 }

  realTimeEnabled.value = false

  await findOrders(+route.params.partnerId)

  socket.on(`partner-order-updated-${user.value.partner.id}`, () => {})
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
