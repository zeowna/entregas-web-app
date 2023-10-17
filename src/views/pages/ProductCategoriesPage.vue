<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Api } from '@/services/api/Api'
import { FindEntitiesPaging, FindEntitiesResponse, ProductCategory } from '@/services/api/types'
import { DataTablePageEvent } from 'primevue/datatable'
import router from '@/router'
import { PrimeIcons } from 'primevue/api'

const data = ref<FindEntitiesResponse<ProductCategory>>({
  list: [],
  count: 0,
  skip: 0,
  limit: 0,
  pages: 0
})
const isLoading = ref(false)

const getProductCategories = async (params: FindEntitiesPaging = {}) => {
  isLoading.value = true
  data.value = await Api.productCategories.find(params)
  isLoading.value = false
}

const onPage = async (e: DataTablePageEvent) => {
  await getProductCategories({
    skip: data.value.limit * e.page
  })
}

const goToProductCategory = async (id?: number) => {
  if (id) {
    await router.push({
      name: 'edit-product-category',
      params: { id }
    })

    return
  }

  await router.push({
    name: 'product-category'
  })
}

onMounted(async () => {
  await getProductCategories()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <Button label="Criar nova Categoria" @click="goToProductCategory()" />
    </div>
  </div>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Categorias</h5>
        <DataTable
          :value="data.list"
          lazy
          paginator
          :first="0"
          :rows="15"
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
          <Column field="Ações">
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
