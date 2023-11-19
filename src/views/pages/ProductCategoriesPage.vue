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
            <div class="flex flex-wrap align-items-center justify-content-start">
              <h5>Listar Categorias/Tamanhos</h5>
            </div>
            <div class="flex flex-wrap justify-content-between">
              <Button label="Criar Categoria" @click="goToProductCategory()" />
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="categoryName"
                  placeholder="Nome da Categoria"
                  @blur="onSearch"
                />
              </span>
            </div>
          </template>
          <Column field="name" header="Nome" sortable></Column>
          <Column field="updatedAt" header="Data Edição" sortable>
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

<script lang="ts" setup>
import { onMounted } from 'vue'
import { PrimeIcons } from 'primevue/api'
import { useListProductCategories } from '@/composables'

const {
  isLoading,
  categoryName,
  data,
  onPage,
  onSort,
  onSearch,
  findProductCategories,
  goToProductCategory
} = useListProductCategories()

onMounted(async () => {
  await findProductCategories()
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
