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
        >
          <template #header>
            <div class="flex flex-wrap align-items-center justify-content-start">
              <h5>Listar Produtos</h5>
            </div>

            <div class="flex flex-wrap align-items-center justify-content-between">
              <Button label="Criar Produto" @click="goToPartnerProduct(+route.params.partnerId)" />

              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="productName" placeholder="Nome do Produto" @blur="onSearch" />
              </span>
            </div>
          </template>
          <Column header="Foto">
            <template #body="slotProps">
              <img
                v-if="slotProps.data.product.pictureURI"
                :src="slotProps.data.product.pictureURI"
                class="w-6rem shadow-2 border-round"
              />
            </template>
          </Column>
          <Column header="Nome">
            <template #body="slotProps">
              {{ slotProps.data.product.name }} {{ slotProps.data.product.size }}
            </template>
          </Column>
          <Column header="Valor">
            <template #body="slotProps">
              {{ centsToCurrency(slotProps.data.value) }}
            </template>
          </Column>
          <Column header="Em estoque" field="inStockQuantity"></Column>
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
                @click="
                  goToPartnerProduct(route.params.partnerId as unknown as number, slotProps.data.id)
                "
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { PrimeIcons } from 'primevue/api'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/store'
import { PartnerUser, ProductStatus } from '@/services/api/types'
import { useListPartnerProducts } from '@/composables'
import { centsToCurrency } from '@/utils'

const router = useRouter()
const route = useRoute()
const user = computed(() => store.getters.getUser)

const { isLoading, productName, data, onSearch, onPage, findPartnerProducts, goToPartnerProduct } =
  useListPartnerProducts()

onMounted(async () => {
  const partnerUser = user.value as PartnerUser

  if (partnerUser?.partner && partnerUser?.partner?.id !== +route.params.partnerId) {
    await router.push({
      name: 'list-partner-products',
      params: {
        partnerId: partnerUser?.partner?.id
      }
    })
  }

  await findPartnerProducts(+route.params.partnerId)
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
