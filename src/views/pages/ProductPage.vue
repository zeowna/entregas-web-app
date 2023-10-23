<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Cadastro de Produto</h5>
        <form @submit.prevent="saveProduct">
          <Fieldset legend="Dados do Produto">
            <div class="grid">
              <div class="field col-6">
                <label for="name">Nome</label>
                <InputText
                  type="text"
                  v-model="v$.name.$model"
                  id="name"
                  placeholder="Nome do Produto"
                />
                <FieldError :errors="v$.name.$errors" />
              </div>
              <div class="field col-6">
                <label for="category">Categoria</label>
                <Dropdown
                  id="category"
                  v-model="v$.categoryId.$model"
                  :options="productCategories.list"
                  :option-value="(category) => category.id"
                  :option-label="(category) => category.name"
                  placeholder="Selecione a Categoria do Produto"
                  @change="loadSizes($event)"
                />
                <FieldError :errors="v$.categoryId.$errors" />
              </div>
              <div class="field col">
                <label for="size">Tamanho</label>
                <Dropdown
                  id="size"
                  v-model="v$.size.$model"
                  :options="sizes"
                  :option-value="(size) => size.name"
                  :option-label="(size) => size.name"
                  placeholder="Selecione o Tamanho do Produto"
                />
                <FieldError :errors="v$.size.$errors" />
              </div>
              <div class="field col-6">
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
          <div class="grid">
            <div class="field md:col-4 sm:col-12">
              <Fieldset legend="Foto">
                <img
                  v-if="product.pictureURI"
                  :src="`${store.getters.getBaseUrl}/${product.pictureURI}`"
                  class="product-img pb-5"
                />
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
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import {
  useListProductCategories,
  useSaveProduct,
  useSaveProductCategorySizes
} from '@/composables'
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import Dropdown, { DropdownChangeEvent } from 'primevue/dropdown'
import { useRoute } from 'vue-router'
import { store } from '@/store'

const route = useRoute()
const toast = useToast()

const { data: productCategories, findProductCategories } = useListProductCategories()
const { data: sizes, findProductCategorySizes } = useSaveProductCategorySizes()
const { isLoading, v$, product, saveProduct, base64data, findProductById, reset } =
  useSaveProduct(toast)

const onFileSelection = async (e: FileUploadSelectEvent) => {
  const file = e.files[0]

  product.value.pictureURI = file.objectURL
  base64data.value = file
}

const loadSizes = async (e: DropdownChangeEvent) => {
  await findProductCategorySizes(e.value)
}

onMounted(async () => {
  reset()
  await findProductCategories({ skip: 0, limit: 999 })

  if (route.params?.id) {
    await findProductById(+route.params?.id)
    await findProductCategorySizes(product.value.categoryId)
  }
})
</script>

<style scoped>
.product-img {
  width: 100%;
}
</style>
