<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <form>
          <div class="grid">
            <div class="field col-6">
              <label for="name">Nome</label>
              <InputText
                type="text"
                v-model="product.name"
                id="name"
                placeholder="Nome do Produto"
              />
            </div>
            <div class="field col-6">
              <label for="category">Categoria</label>
              <Dropdown
                id="category"
                v-model="product.categoryId"
                :options="categories"
                :option-value="(category) => category.id"
                :option-label="(category) => category.name"
                placeholder="Selecione a Categoria do Produto"
              />
            </div>
            <div class="field col">
              <label for="size">Tamanho</label>
              <Dropdown
                id="size"
                v-model="product.size"
                :options="sizes"
                :option-value="(size) => size.name"
                :option-label="(size) => size.name"
                placeholder="Selecione o Tamanho do Produto"
              />
            </div>
            <div class="field col-6">
              <label for="status">Status</label>
              <div class="formgrid grid">
                <div class="field-radiobutton col-2">
                  <RadioButton
                    v-model="product.status"
                    id="status-active"
                    name="status"
                    value="active"
                  />
                  <label for="ingredient1" class="ml-2">Ativo</label>
                </div>
                <div class="field-radiobutton col">
                  <RadioButton
                    v-model="product.status"
                    id="status-inactive"
                    name="status"
                    value="inactive"
                  />
                  <label for="ingredient1" class="ml-2">Inativo</label>
                </div>
              </div>
            </div>
            <div class="field col-6">
              <label for="status">Foto</label>
              <FileUpload
                mode="basic"
                name="demo[]"
                url="./upload.php"
                accept="image/*"
                :maxFileSize="1000000"
                @upload="onUpload"
                chooseLabel="Carregar Foto do Produto"
              />
            </div>
          </div>
          <Button label="Salvar" type="submit" severity="success" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FileUploadUploadEvent } from 'primevue/fileupload'

const categories = ref([
  { id: '1', name: 'Água Mineral' },
  { id: '2', name: 'Gás de Cozinha' }
])

const sizes = ref([] as any)
const product = ref({} as any)

const onUpload = (event: FileUploadUploadEvent) => {
  // implement upload here
}

watch(
  () => product.value.categoryId,
  (categoryId) => {
    sizes.value = [{ name: '2 Litros' }]
  }
)
</script>
