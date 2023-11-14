<script lang="ts" setup>
import { onMounted } from 'vue'
import { PrimeIcons } from 'primevue/api'
import { useListProducts } from '@/composables'
import { ProductStatus } from '@/services/api/types'

const { isLoading, data, onPage, findProducts, goToProduct } = useListProducts()

onMounted(async () => {
  await findProducts()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <Button label="Criar Produto" @click="goToProduct()" />
    </div>
  </div>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Produtos</h5>
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
          <Column header="Foto">
            <template #body="slotProps">
              <img
                v-if="slotProps.data.pictureURI"
                :src="slotProps.data.pictureURI"
                class="w-6rem shadow-2 border-round"
              />
            </template>
          </Column>
          <Column field="name" header="Nome"></Column>
          <Column field="size" header="Tamanho"></Column>
          <Column header="Categoria">
            <template #body="slotProps">
              {{ slotProps.data.category.name }}
            </template>
          </Column>
          <Column header="Status">
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

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
