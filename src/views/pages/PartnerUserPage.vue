<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Cadastro de Usuário Parceiro</h5>
        <form @submit.prevent="savePartnerUser">
          <div class="grid">
            <div class="md:col-3 sm:col-12">
              <Fieldset legend="Foto">
                <img
                  v-if="partnerUser.profilePictureURI && !temporaryPicture"
                  :src="`${store.getters.getBaseUrl}/${partnerUser.profilePictureURI}`"
                  class="product-img pb-5"
                />
                <img v-if="temporaryPicture" :src="temporaryPicture" class="product-img pb-5" />
                <div class="text-center">
                  <FileUpload
                    mode="basic"
                    name="demo[]"
                    accept="image/*"
                    :url="undefined"
                    :maxFileSize="1000000"
                    @select="onFileSelection"
                    customUpload
                    chooseLabel="Carregar Foto do Produto"
                  />
                </div>
              </Fieldset>
            </div>
            <div class="md:col-9 sm:col-12">
              <Fieldset legend="Dados do Produto">
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { userSavePartnerUser } from '@/composables'
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'

const route = useRoute()
const toast = useToast()
const temporaryPicture = ref('')

const {
  isLoading,
  v$,
  partnerUser,
  file,
  eighteenYearsAgo,
  findByPartnerIdAndId,
  reset,
  savePartnerUser
} = userSavePartnerUser(toast)

const onFileSelection = async (e: FileUploadSelectEvent) => {
  const [selectedFile] = e.files
  temporaryPicture.value = selectedFile.objectURL

  file.value = selectedFile
}

onMounted(async () => {
  reset()

  if (route.params?.partnerId && route.params?.id) {
    await findByPartnerIdAndId(+route.params?.partnerId, +route.params?.id)
  }
})
</script>

<style scoped>
.product-img {
  width: 100%;
}
</style>
