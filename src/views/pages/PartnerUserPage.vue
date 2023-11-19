<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Cadastro de Usuário Parceiro</h5>
        <form @submit.prevent="savePartnerUser">
          <div class="grid">
            <div class="md:col-3 sm:col-12">
              <Fieldset legend="Foto">
                <PictureUploader
                  :pictureUri="partnerUser.profilePictureURI"
                  @onFileSelected="file = $event"
                />
              </Fieldset>
            </div>
            <div class="md:col-9 sm:col-12">
              <Fieldset legend="Dados do Usuário">
                <div class="grid">
                  <div class="field md:col-6 sm:col-12">
                    <label for="name">Nome</label>
                    <InputText
                      type="text"
                      v-model="v$.name.$model"
                      id="name"
                      placeholder="Nome do Produto"
                    />
                    <FieldError :errors="v$.name.$errors" />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="category">Data de nascimento</label>
                    <Calendar
                      v-model="v$.birthday.$model"
                      dateFormat="dd/mm/yy"
                      :maxDate="eighteenYearsAgo"
                      placeholder="Data de nascimento do Usuário"
                    />
                    <FieldError :errors="v$.birthday.$errors" />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="size">CPF</label>
                    <InputMask
                      type="text"
                      v-model="v$.cpf.$model"
                      mask="999.999.999-99"
                      unmask
                      id="cpf"
                      placeholder="CPF do Usuário"
                    />
                    <FieldError :errors="v$.cpf.$errors" />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="status">E-mail</label>
                    <InputText
                      type="text"
                      v-model="v$.email.$model"
                      id="email"
                      placeholder="E-mail do Usuário"
                    />
                    <FieldError :errors="v$.email.$errors" />
                  </div>
                </div>
              </Fieldset>
            </div>
          </div>

          <Button
            label="Salvar"
            type="submit"
            severity="success"
            :disabled="isLoading || v$.$error"
          />
        </form>
      </div>
    </div>
  </div>
  <LoadingSpinner :isLoading="isLoading" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useSavePartnerUser } from '@/composables'
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import { useRoute } from 'vue-router'
import PictureUploader from '@/components/PictureUploader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const toast = useToast()

const {
  isLoading,
  v$,
  partnerUser,
  file,
  eighteenYearsAgo,
  findByPartnerIdAndId,
  reset,
  savePartnerUser
} = useSavePartnerUser(+route.params?.partnerId, toast)

onMounted(async () => {
  reset()

  if (route.params?.partnerId && route.params?.id) {
    await findByPartnerIdAndId(+route.params?.partnerId, +route.params?.id)
  }
})

onUnmounted(() => {
  reset()
})
</script>

<style scoped>
.uploader-img {
  width: 100%;
}
</style>
