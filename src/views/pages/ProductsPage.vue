<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-2">
        <DataTable
          :value="data.list"
          lazy
          paginator
          row-hover
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
              <h5>Listar Produtos</h5>
            </div>

            <div class="flex flex-wrap align-items-center justify-content-between">
              <Button label="Criar Produto" @click="goToProduct()" />

              <form @submit.prevent="onSearch">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="productName" placeholder="Nome do Produto" />
                </span>
                <Button type="submit" v-show="false" />
            </form>
            </div>
          </template>

          <Column header="Foto">
            <template #body="slotProps">
              <img
                v-if="slotProps.data.pictureURI"
                :src="slotProps.data.pictureURI"
                class="w-6rem shadow-2 border-round"
              />
            </template>
          </Column>
          <Column field="name" header="Nome" sortable></Column>
          <Column field="size" header="Tamanho" sortable></Column>
          <Column field="category" header="Categoria" sortable>
            <template #body="slotProps">
              {{ slotProps.data.category.name }}
            </template>
          </Column>
          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <Tag
                v-if="slotProps.data.status === ProductStatus.Active"
                value="Ativo"
                severity="success"
              />
              <Tag
                v-if="slotProps.data.status === ProductStatus.Inactive"
                value="Inativo"
                severity="danger"
              />
            </template>
          </Column>
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
                v-tooltip="'Editar Produto'"
                :icon="PrimeIcons.PENCIL"
                @click="goToProduct(slotProps.data.id)"
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
import { useListProducts } from '@/composables'
import { ProductStatus } from '@/services/api/types'

const { isLoading, productName, data, onSearch, onSort, onPage, findProducts, goToProduct } =
  useListProducts()

onMounted(async () => {
  await findProducts()
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
