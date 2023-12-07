<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Meus Dados</h5>
        <form @submit.prevent="saveMe">
          <div class="grid">
            <div class="md:col-3 col-12">
              <Fieldset legend="Foto">
                <PictureUploader
                  :pictureUri="me.profilePictureURI"
                  @onFileSelected="file = $event"
                />
              </Fieldset>
            </div>
            <div class="md:col-9 col-12">
              <Fieldset legend="Meus Dados">
                <div class="grid">
                  <div class="field md:col-6 col-12">
                    <label for="name">Nome</label>
                    <InputText
                      type="text"
                      v-model="v$.name.$model"
                      id="name"
                      placeholder="Nome do Produto"
                    />
                    <FieldError :errors="v$.name.$errors" />
                  </div>
                  <div class="field md:col-6 col-12">
                    <label for="category">Data de nascimento</label>
                    <Calendar
                      v-model="v$.birthday.$model"
                      dateFormat="dd/mm/yy"
                      :maxDate="eighteenYearsAgo"
                      placeholder="Data de nascimento do Usuário"
                    />
                    <FieldError :errors="v$.birthday.$errors" />
                  </div>
                  <div class="field md:col-6 col-12">
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
                  <div class="field md:col-6 col-12">
                    <label for="status">E-mail</label>
                    <InputText
                      type="text"
                      v-model="v$.email.$model"
                      id="email"
                      placeholder="E-mail do Usuário"
                    />
                    <FieldError :errors="v$.email.$errors" />
                  </div>

                  <div class="field md:col-12 col-12">
                    <Button label="Alterar senha" severity="info" @click="togglePasswordFields" />
                  </div>

                  <div class="field md:col-6 col-12" v-if="passwordFieldEnabled">
                    <label for="status">Senha</label>
                    <InputText
                      type="password"
                      v-model="me.password"
                      id="password"
                      placeholder="Senha do Usuário"
                    />
                    <FieldError :errors="v$!.password!.$errors" v-if="v$!.password"/>
                  </div>

                  <div class="field md:col-6 col-12" v-if="passwordFieldEnabled">
                    <label for="status">Confirmar senha</label>
                    <InputText
                      type="password"
                      v-model="me.passwordConfirmation"
                      id="passwordConfirmation"
                      placeholder="Confirmar Senha do Usuário"
                    />
                    <FieldError :errors="v$!.passwordConfirmation!.$errors" v-if="v$!.passwordConfirmation"/>
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
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import { useSaveMe } from '@/composables/useSaveMe'
import PictureUploader from '@/components/PictureUploader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const toast = useToast()

const {
  isLoading,
  v$,
  me,
  file,
  eighteenYearsAgo,
  findMe,
  reset,
  saveMe,
  togglePasswordFields,
  passwordFieldEnabled
} = useSaveMe(toast)

onMounted(async () => {
  reset()

  await findMe()
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
