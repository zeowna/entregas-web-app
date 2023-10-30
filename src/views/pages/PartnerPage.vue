<template>
  <div class="grid" v-if="partner.id">
    <div class="md:col-4 sm:col-12">
      <Button
        label="Usuários"
        severity="info"
        icon="pi pi-users"
        v-tooltip="`Visualizar Usuários deste Parceiro`"
        @click="goToPartnerUsers"
      />
    </div>
  </div>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Cadastro de Parceiro</h5>

        <form @submit.prevent="savePartner">
          <div class="grid">
            <div class="md:col-3 sm:col-12">
              <Fieldset legend="Foto">
                <img
                  v-if="partner.pictureURI && !temporaryPicture"
                  :src="`${store.getters.getBaseUrl}/${partner.pictureURI}`"
                  class="product-img pb-5"
                />
                <img v-if="temporaryPicture" :src="temporaryPicture" class="product-img pb-5" />
                <div class="text-center">
                  <FileUpload
                    mode="basic"
                    auto
                    name="demo[]"
                    accept="image/*"
                    :url="undefined"
                    :maxFileSize="1000000"
                    @select="onFileSelection"
                    customUpload
                    chooseLabel="Carregar Foto do Parceiro"
                    upload-label=""
                  />
                </div>
              </Fieldset>
            </div>

            <div class="md:col-9 sm:col-12">
              <Fieldset legend="Dados do Parceiro">
                <div class="grid">
                  <div class="field md:col-6 sm:col-12">
                    <label for="name">Nome</label>
                    <InputText
                      type="text"
                      v-model="v$.name.$model"
                      id="name"
                      placeholder="Nome do Parceiro"
                    />
                    <FieldError :errors="v$.name.$errors" />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="category">CNPJ</label>
                    <InputMask
                      type="text"
                      v-model="v$.cnpj.$model"
                      id="name"
                      mask="99.999.999/9999-99"
                      unmask
                      placeholder="CNPJ do Parceiro"
                    />
                    <FieldError :errors="v$.cnpj.$errors" />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="">Horário de abertura</label>
                    <Calendar id="calendar-timeonly" v-model="v$.openingHours.$model" timeOnly />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="">Horário de encerramento</label>
                    <Calendar id="calendar-timeonly" v-model="v$.closingHours.$model" timeOnly />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="status">Status</label>
                    <div class="grid">
                      <div class="field-radiobutton col-2">
                        <RadioButton
                          v-model="v$.status.$model"
                          id="status-active"
                          name="status"
                          value="active"
                        />
                        <label for="ingredient1" class="ml-2">Ativo</label>
                      </div>
                      <div class="field-radiobutton col">
                        <RadioButton
                          v-model="v$.status.$model"
                          id="status-inactive"
                          name="status"
                          value="inactive"
                        />
                        <label for="ingredient1" class="ml-2">Inativo</label>
                      </div>
                    </div>
                  </div>
                </div>
              </Fieldset>
            </div>
          </div>

          <div class="grid">
            <div class="md:col-12 sm:col-12">
              <Fieldset legend="Endereço">
                <div class="grid">
                  <div class="field md:col-2 sm:col-12">
                    <label for="size">CEP</label>
                    <InputMask
                      type="text"
                      v-model="v$.address.cep.$model"
                      id="cep"
                      mask="99999-999"
                      unmask
                      placeholder="CEP do Parceiro"
                      @blur="loadAddress"
                    />
                    <FieldError :errors="v$.address.cep.$errors" />
                  </div>
                  <div class="field md:col-5 sm:col-12">
                    <label for="size">Rua</label>
                    <InputText
                      type="text"
                      v-model="v$.address.street.$model"
                      id="street"
                      placeholder="Rua do Parceiro"
                      disabled
                    />
                    <FieldError :errors="v$.address.street.$errors" />
                  </div>

                  <div class="field md:col-5 sm:col-12">
                    <label for="size">Bairro</label>
                    <InputText
                      type="text"
                      v-model="v$.address.neighbourhood.$model"
                      id="neighbourhood"
                      placeholder="Bairro do Parceiro"
                      disabled
                    />
                    <FieldError :errors="v$.address.neighbourhood.$errors" />
                  </div>

                  <div class="field md:col-4 sm:col-12">
                    <label for="size">Número</label>
                    <InputNumber
                      v-model="v$.address.number.$model"
                      id="number"
                      :useGrouping="false"
                      placeholder="Número do Parceiro"
                    />
                    <FieldError :errors="v$.address.number.$errors" />
                  </div>

                  <div class="field md:col-4 sm:col-12">
                    <label for="size">Complemento</label>
                    <InputText
                      type="text"
                      v-model="v$.address.complement.$model"
                      id="complement"
                      placeholder="Complemento do Parceiro"
                    />
                    <FieldError :errors="v$.address.complement.$errors" />
                  </div>

                  <div class="field md:col-4 sm:col-12">
                    <label for="size">Cidade</label>
                    <InputText
                      type="text"
                      v-model="v$.address.city.$model"
                      id="city"
                      placeholder="Cidade do Parceiro"
                      disabled
                    />
                    <FieldError :errors="v$.address.city.$errors" />
                  </div>

                  <div class="field md:col-2 sm:col-12">
                    <label for="size">UF</label>
                    <InputText
                      type="text"
                      maxlength="2"
                      v-model="v$.address.state.$model"
                      id="state"
                      placeholder="UF do Parceiro"
                      disabled
                    />
                    <FieldError :errors="v$.address.state.$errors" />
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
import { useFindAddress, useSavePartner } from '@/composables'
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/store'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const temporaryPicture = ref('')
const { isLoading, v$, partner, savePartner, file, findPartnerById, reset } = useSavePartner(toast)
const { findAddressByCep } = useFindAddress()

const loadAddress = async () => {
  if (partner.value.address?.cep?.replace(/[^a-zA-Z0-9 ]/g, '').length < 8) {
    return
  }

  const address = await findAddressByCep(partner.value.address.cep)

  partner.value.address = {
    ...partner.value.address,
    ...address
  }
}

const onFileSelection = async (e: FileUploadSelectEvent) => {
  const [selectedFile] = e.files
  temporaryPicture.value = selectedFile.objectURL

  file.value = selectedFile
}

const goToPartnerUsers = async () => {
  await router.push({
    name: 'list-partner-users',
    params: {
      partnerId: partner.value.id as number
    }
  })
}

onMounted(async () => {
  reset()

  if (route.params?.id) {
    await findPartnerById(+route.params?.id)
  }
})
</script>

<style scoped>
.product-img {
  width: 100%;
}
</style>
