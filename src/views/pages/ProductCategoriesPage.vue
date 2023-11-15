<script lang="ts" setup>
import { onMounted } from 'vue'
import { PrimeIcons } from 'primevue/api'
import { useListProductCategories } from '@/composables'

const { isLoading, data, onPage, findProductCategories, goToProductCategory } =
  useListProductCategories()

onMounted(async () => {
  await findProductCategories()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <Button label="Criar Categoria" @click="goToProductCategory()" />
    </div>
  </div>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Categorias e Tamanhos</h5>
        <DataTable
          :value="data.list"
          lazy
          paginator
          :first="0"
          :rows="data.limit"
          :totalRecords="data.count"
          :loading="isLoading"
          @page="onPage($event)"
        >
          <Column field="name" header="Nome"></Column>
          <Column field="createdAt" header="Data Criação">
            <template #body="slotProps">
              {{ new Date(slotProps.data.createdAt).toLocaleDateString() }} -
              {{ new Date(slotProps.data.createdAt).toLocaleTimeString() }}
            </template>
          </Column>
          <Column field="updatedAt" header="Data Edição">
            <template #body="slotProps">
              {{ new Date(slotProps.data.updatedAt).toLocaleDateString() }} -
              {{ new Date(slotProps.data.updatedAt).toLocaleTimeString() }}
            </template>
          </Column>
          <Column header="Ações">
            <template #body="slotProps">
              <Button
                severity="success"
                v-tooltip="'Editar Categoria'"
                :icon="PrimeIcons.PENCIL"
                @click="goToProductCategory(slotProps.data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
