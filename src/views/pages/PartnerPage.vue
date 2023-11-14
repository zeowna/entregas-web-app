<template>
  <div class="grid" v-if="partner.id">
    <div class="col-12 md:col-4">
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
            <div class="col-12 md:col-3">
              <Fieldset legend="Foto">
                <PictureUploader :pictureUri="partner.pictureURI" @onFileSelected="file = $event" />
              </Fieldset>
            </div>

            <div class="col-12 md:col-9">
              <Fieldset legend="Dados do Parceiro">
                <div class="grid">
                  <div class="field col-12 md:col-6">
                    <label for="name">Nome</label>
                    <InputText
                      type="text"
                      v-model="v$.name.$model"
                      id="name"
                      placeholder="Nome do Parceiro"
                    />
                    <FieldError :errors="v$.name.$errors" />
                  </div>
                  <div class="field col-12 md:col-6">
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
                  <div class="field col-12 md:col-6">
                    <label for="">Horário de abertura</label>
                    <Calendar id="calendar-timeonly" v-model="v$.openingHours.$model" timeOnly />
                  </div>
                  <div class="field col-12 md:col-6">
                    <label for="">Horário de encerramento</label>
                    <Calendar id="calendar-timeonly" v-model="v$.closingHours.$model" timeOnly />
                  </div>
                  <div class="field col-12 md:col-6">
                    <label for="status">Status</label>
                    <div class="grid">
                      <div class="field-radiobutton col-12 md:col-6">
                        <RadioButton
                          v-model="v$.status.$model"
                          id="status-active"
                          name="status"
                          value="active"
                        />
                        <label for="ingredient1" class="ml-2">Ativo</label>
                      </div>
                      <div class="field-radiobutton col-12 md:col-6">
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
            <div class="col-12 md:col-12">
              <Fieldset legend="Endereço">
                <div class="grid">
                  <div class="field col-12 md:col-2">
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
                  <div class="field col-12 md:col-5">
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

                  <div class="field col-12 md:col-5">
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

                  <div class="field col-12 md:col-4">
                    <label for="size">Número</label>
                    <InputNumber
                      v-model="v$.address.number.$model"
                      id="number"
                      :useGrouping="false"
                      placeholder="Número do Parceiro"
                    />
                    <FieldError :errors="v$.address.number.$errors" />
                  </div>

                  <div class="field col-12 md:col-4">
                    <label for="size">Complemento</label>
                    <InputText
                      type="text"
                      v-model="partner.address.complement"
                      id="complement"
                      placeholder="Complemento do Parceiro"
                    />
                  </div>

                  <div class="field col-12 md:col-4">
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

                  <div class="field col-12 md:col-2">
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
import { onMounted } from 'vue'
import { useFindAddress, useSavePartner } from '@/composables'
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import { useRoute, useRouter } from 'vue-router'
import PictureUploader from '@/components/PictureUploader.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

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
.uploader-img {
  width: 100%;
}
</style>
