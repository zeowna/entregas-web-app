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
              <h5>Listar Usuários</h5>
            </div>
            <div class="flex flex-wrap justify-content-between">
              <div class="flex justify-content-start">
                <Button
                  v-if="user.type === UserTypes.Admin"
                  label="Dados do Parceiro"
                  severity="info"
                  class="mr-2"
                  @click="goToPartner(+route.params!.partnerId)"
                />
                <Button label="Criar Usuário" @click="goToPartnerUser(+route.params.partnerId)" />
              </div>
              <div class="flexjustify-content-end">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="userName" placeholder="Nome do Usuário" @blur="onSearch" />
                </span>
              </div>
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
                @click="
                  goToPartnerUser(route.params.partnerId as unknown as number, slotProps.data.id)
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
import { useListPartnerUsers } from '@/composables/useListPartnerUsers'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/store'
import { PartnerUser, UserTypes } from '@/services/api/types'

const router = useRouter()
const route = useRoute()
const user = computed(() => store.getters.getUser)

const { isLoading, userName, data, onSearch, onPage, findPartnerUsers, goToPartnerUser } =
  useListPartnerUsers()

const goToPartner = async (partnerId: number) => {
  await router.push({
    name: 'edit-partner',
    params: {
      id: partnerId
    }
  })
}

onMounted(async () => {
  const partnerUser = user.value as PartnerUser

  if (partnerUser?.partner && partnerUser?.partner?.id !== +route.params.partnerId) {
    await router.push({
      name: 'list-partner-users',
      params: {
        partnerId: partnerUser?.partner?.id
      }
    })
  }

  await findPartnerUsers(+route.params.partnerId)
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
