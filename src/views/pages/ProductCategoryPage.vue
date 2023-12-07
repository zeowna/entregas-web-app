<template>
  <div class="grid">
    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <form @submit.prevent="saveProductCategory">
          <div class="grid">
            <div class="field col-12 md:col-12">
              <Fieldset legend="Dados da Categoria">
                <div class="grid">
                  <div class="field col-12 md:col-6">
                    <label for="name">Nome</label>
                    <InputText
                      type="text"
                      v-model="v$.name.$model"
                      id="name"
                      :class="v$.name.$error ? 'p-invalid' : ''"
                      placeholder="Nome da Categoria"
                    />
                    <FieldError :errors="v$.name.$errors" />
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

    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <div class="grid">
          <div class="col">
            <h5>Tamanhos</h5>

            <div class="grid">
              <div class="md:col-4 col-12">
                <Button
                  label="Criar Tamanho"
                  v-show="!showCategoryForm"
                  @click="showCategoryForm = !showCategoryForm"
                  :disabled="!productCategory.id"
                />
              </div>
            </div>

            <div class="grid" v-show="showCategoryForm">
              <div class="field col-12 md:col-12">
                <form @submit.prevent="saveProductCategorySize">
                  <div class="grid">
                    <div class="field col-12 md:col-12">
                      <Fieldset legend="Dados do Tamanho">
                        <div class="grid">
                          <div class="field col-12 md:col-6 pl-0">
                            <label for="name">Nome</label>
                            <InputText
                              type="text"
                              v-model="v$2.name.$model"
                              id="name"
                              :class="v$2.name.$error ? 'p-invalid' : ''"
                              placeholder="Nome do Tamanho"
                            />
                            <FieldError :errors="v$2.name.$errors" />
                          </div>
                        </div>
                      </Fieldset>
                    </div>
                  </div>

                  <div class="grid">
                    <div class="field col-12 md:col-12">
                      <Button
                        label="Salvar"
                        type="submit"
                        severity="success"
                        :disabled="isLoadingSize || v$2.$error"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div class="grid">
              <div class="col-12">
                <DataTable :value="data.list">
                  <Column field="name" header="Nome"></Column>
                  <Column field="createdAt" header="Data Criação">
                    <template #body="slotProps">
                      {{ new Date(slotProps.data.createdAt).toLocaleDateString() }} -
                      {{ new Date(slotProps.data.createdAt).toLocaleTimeString() }}
                    </template>
                  </Column>
                  <Column field="updatedAt" header="Data Edição">
                    <template #body="slotProps">
                      {{ new Date(slotProps.data.updatedAt).toLocaleDateString() }} -
                      {{ new Date(slotProps.data.updatedAt).toLocaleTimeString() }}
                    </template>
                  </Column>
                  <Column field="Ações">
                    <template #body="slotProps">
                      <Button
                        severity="success"
                        v-tooltip="'Editar Tamanho'"
                        :icon="PrimeIcons.PENCIL"
                        @click="selectProductSize(slotProps.data)"
                      />
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoadingSpinner :isLoading="isLoading" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import { PrimeIcons } from 'primevue/api'
import { useSaveProductCategory, useSaveProductCategorySizes } from '@/composables'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const toast = useToast()

const { isLoading, productCategory, v$, findProductCategoryById, saveProductCategory, reset } =
  useSaveProductCategory(toast)
const {
  isLoading: isLoadingSize,
  data,
  v$: v$2,
  findProductCategorySizes,
  selectProductSize,
  showCategoryForm,
  saveProductCategorySize,
  reset: resetProductCategorySize
} = useSaveProductCategorySizes(toast)

onMounted(async () => {
  reset()
  resetProductCategorySize()

  if (route.params?.id) {
    await findProductCategoryById(+route.params?.id)
    await findProductCategorySizes(+route.params?.id)
  }
})

onUnmounted(() => {
  reset()
  resetProductCategorySize()
})
</script>

<style scoped></style>
