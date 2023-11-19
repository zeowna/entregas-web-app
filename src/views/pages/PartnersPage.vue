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
              <h5>Listar de Parceiros</h5>
            </div>
            <div class="flex flex-wrap justify-content-between">
              <Button label="Criar Parceiro" @click="goToPartner()" />
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="partnerName" placeholder="Nome do Parceiro" @blur="onSearch" />
              </span>
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
          <Column header="Endereço">
            <template #body="slotProps">
              {{ slotProps.data?.address?.street }} {{ slotProps.data?.address?.number }}
            </template>
          </Column>
          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <Tag
                v-if="slotProps.data.status === PartnerStatuses.Active"
                value="Ativo"
                severity="success"
              />
              <Tag
                v-if="slotProps.data.status === PartnerStatuses.Inactive"
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
                v-tooltip="'Editar Parceiro'"
                :icon="PrimeIcons.PENCIL"
                @click="goToPartner(slotProps.data.id)"
                class="mr-2"
              />

              <Button
                severity="info"
                v-tooltip="'Listar Usuários'"
                :icon="PrimeIcons.USERS"
                @click="goToPartnerUsers(slotProps.data.id)"
                class="mr-2"
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
import { useListPartners } from '@/composables'
import { PartnerStatuses } from '@/services/api/types'
import { useRouter } from 'vue-router'

const router = useRouter()

const { isLoading, partnerName, data, onSort, onSearch, onPage, findPartners, goToPartner } =
  useListPartners()

const goToPartnerUsers = async (partnerId: number) => {
  await router.push({
    name: 'list-partner-users',
    params: {
      partnerId
    }
  })
}

onMounted(async () => {
  await findPartners()
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
