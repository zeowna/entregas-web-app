<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Pedidos</h5>
        <DataTable :value="orders" paginator :rows="15">
          <Column field="id" header="Número"></Column>
          <Column field="address" header="Endereço">
            <template #body="{ data }">
              {{ `${data.address.street}, ${data.address.number}` }}
            </template>
          </Column>
          <Column field="createdAt" header="Data Criação">
            <template #body="{ data }">
              {{
                new Date(data.createdAt).toLocaleDateString() +
                ' ' +
                new Date(data.createdAt).toLocaleTimeString()
              }}
            </template>
          </Column>
          <Column field="statusUpdatedAt" header="Data Ultima Atualização">
            <template #body="{ data }">
              {{
                new Date(data.statusUpdatedAt).toLocaleDateString() +
                ' ' +
                new Date(data.statusUpdatedAt).toLocaleTimeString()
              }}
            </template>
          </Column>
          <Column field="status" header="Status"></Column>
          <Column field="totalValue" header="Valor Total">
            <template #body="{ data }">
              {{ formatValue(data.totalValue) }}
            </template>
          </Column>
          <Column header="Ações">
            <template #body>
              <Button label="Ver Pedido" severity="success" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const formatValue = (value: number) => 'R$ ' + (value / 100).toFixed(2).replace('.', ',')

const orders = ref([])

onMounted(async () => {
  const service = {
    getProductsWithOrdersSmall: async (): Promise<any> => []
  }

  orders.value = await service.getProductsWithOrdersSmall()
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
