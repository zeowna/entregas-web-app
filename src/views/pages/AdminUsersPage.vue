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
              <h5>Listar Usuários Admin</h5>
            </div>
            <div class="flex flex-wrap justify-content-between">
              <Button label="Criar Usuário" @click="goToAdminUser()" />
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="userName" placeholder="Nome do Usuário" @blur="onSearch" />
              </span>
            </div>
          </template>
          <Column header="Foto">
            <template #body="slotProps">
              <img
                v-if="slotProps.data.profilePictureURI"
                :src="slotProps.data.profilePictureURI"
                class="w-6rem shadow-2 border-round"
              />
            </template>
          </Column>
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
                v-tooltip="'Editar Usuário'"
                :icon="PrimeIcons.PENCIL"
                @click="goToAdminUser(slotProps.data.id)"
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
import { useListAdminUsers } from '@/composables'

const { isLoading, userName, data, onSort, onSearch, onPage, findAdminUsers, goToAdminUser } =
  useListAdminUsers()

onMounted(async () => {
  await findAdminUsers()
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
