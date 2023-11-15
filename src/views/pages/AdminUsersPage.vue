<template>
  <div class="grid">
    <div class="md:col-12 sm:col-12">
      <Button label="Criar Usuário" @click="goToAdminUser()" />
    </div>
  </div>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Usuários Admin</h5>
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
                v-if="slotProps.data.profilePictureURI"
                :src="slotProps.data.profilePictureURI"
                class="w-6rem shadow-2 border-round"
              />
            </template>
          </Column>
          <Column field="name" header="Nome"></Column>
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

const { isLoading, data, onPage, findAdminUsers, goToAdminUser } = useListAdminUsers()

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
