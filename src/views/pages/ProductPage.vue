<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Cadastro de Produto</h5>
        <form @submit.prevent="saveProduct">
          <div class="grid">
            <div class="field col-12 md:col-3">
              <Fieldset legend="Foto">
                <PictureUploader :pictureUri="product.pictureURI" @onFileSelected="file = $event" />
              </Fieldset>
            </div>
            <div class="field col-12 md:col-9">
              <Fieldset legend="Dados do Produto">
                <div class="grid">
                  <div class="field col-12 md:col-6">
                    <label for="name">Nome</label>
                    <InputText
                      type="text"
                      v-model="v$.name.$model"
                      id="name"
                      placeholder="Nome do Produto"
                    />
                    <FieldError :errors="v$.name.$errors" />
                  </div>
                  <div class="field col-12 md:col-6">
                    <label for="category">Categoria</label>
                    <Dropdown
                      id="category"
                      v-model="v$.categoryId.$model"
                      :options="productCategories.list"
                      option-value="id"
                      option-label="name"
                      show-clear
                      filter
                      placeholder="Selecione a Categoria do Produto"
                      @change="loadSizes($event)"
                    />
                    <FieldError :errors="v$.categoryId.$errors" />
                  </div>
                  <div class="field col-12 md:col-6">
                    <label for="size">Tamanho</label>
                    <Dropdown
                      id="size"
                      v-model="v$.size.$model"
                      :options="sizes"
                      option-value="name"
                      option-label="name"
                      show-clear
                      filter
                      placeholder="Selecione o Tamanho do Produto"
                    />
                    <FieldError :errors="v$.size.$errors" />
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
                        <label for="status-active" class="ml-2">Ativo</label>
                      </div>
                      <div class="field-radiobutton col-12 md:col-6">
                        <RadioButton
                          v-model="v$.status.$model"
                          id="status-inactive"
                          name="status"
                          value="inactive"
                        />
                        <label for="status-inactive" class="ml-2">Inativo</label>
                      </div>
                    </div>
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
import { onMounted, onUnmounted } from 'vue'
import {
  useListProductCategories,
  useSaveProduct,
  useSaveProductCategorySizes
} from '@/composables'
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import Dropdown, { DropdownChangeEvent } from 'primevue/dropdown'
import { useRoute } from 'vue-router'
import PictureUploader from '@/components/PictureUploader.vue'

const route = useRoute()
const toast = useToast()

const { data: productCategories, findProductCategories } = useListProductCategories()
const {
  data: sizes,
  findProductCategorySizes,
  reset: resetSizes
} = useSaveProductCategorySizes(toast)
const { isLoading, v$, product, saveProduct, file, findProductById, reset } = useSaveProduct(toast)

const loadSizes = async (e: DropdownChangeEvent) => {
  await findProductCategorySizes(e.value)
}

onMounted(async () => {
  reset()
  resetSizes()

  await findProductCategories({ skip: 0, limit: 999 })

  if (route.params?.id) {
    await findProductById(+route.params?.id)
    await findProductCategorySizes(product?.value?.categoryId as number)
  }
})

onUnmounted(() => {
  reset()
  resetSizes()
})
</script>

<style scoped>
.uploader-img {
  width: 100%;
}
</style>
