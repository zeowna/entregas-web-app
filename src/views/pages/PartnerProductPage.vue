<template>
  <div class="grid" v-if="!isLoading && !product.id">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Selecionar Produto</h5>
        <DataView :value="data.list" layout="grid">
          <template #header>
            <div class="grid">
              <div class="field col-12 md:col-6">
                <label for="category">Categoria</label>
                <Dropdown
                  id="category"
                  v-model="conditions.category"
                  :options="productCategories.list"
                  option-value="id"
                  option-label="name"
                  show-clear
                  filter
                  placeholder="Selecione a Categoria do Produto"
                  @change="searchWithCategory($event)"
                />
              </div>
              <div class="field col-12 md:col-6">
                <label for="name">Tamanho</label>
                <Dropdown
                  id="size"
                  v-model="conditions.size"
                  :options="sizes"
                  :disabled="!conditions.category"
                  option-value="name"
                  option-label="name"
                  show-clear
                  filter
                  placeholder="Selecione o Tamanho do Produto"
                  @change="searchWithSize($event)"
                />
              </div>
            </div>
          </template>

          <template #grid="slotProps">
            <div class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
              <div class="p-4 border-1 surface-border surface-card border-round">
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-tag"></i>
                    <span class="font-semibold">{{ slotProps.data.category.name }}</span>
                  </div>
                </div>
                <div class="flex flex-column align-items-center gap-3 py-5">
                  <img
                    class="w-9 shadow-2 border-round"
                    :src="slotProps.data.pictureURI"
                    :alt="`${slotProps.data.name} -  ${slotProps.data.size}`"
                  />
                  <div class="text-2xl font-bold">
                    {{ slotProps.data.name }} - {{ slotProps.data.size }}
                  </div>
                </div>
                <div class="flex align-items-center justify-content-between">
                  <Button
                    severity="primary"
                    label="Selecionar"
                    @click="selectProduct(slotProps.data)"
                  />
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>

  <div class="grid" v-if="product.id">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Cadastro de Produto</h5>
        <form @submit.prevent="savePartnerProduct">
          <div class="grid">
            <div class="md:col-3 sm:col-12">
              <Fieldset legend="Foto">
                <img
                  v-if="product?.pictureURI"
                  :src="product?.pictureURI"
                  class="uploader-img pb-5"
                />
              </Fieldset>
            </div>
            <div class="md:col-9 sm:col-12">
              <Fieldset legend="Dados do Produto">
                <div class="grid">
                  <div class="field md:col-6 sm:col-12">
                    <label for="name">Nome</label>
                    <InputText
                      type="text"
                      v-model="product!.name"
                      id="name"
                      disabled
                      placeholder="Nome do Produto"
                    />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="category">Tamanho</label>
                    <InputText
                      type="text"
                      v-model="product!.size"
                      id="size"
                      disabled
                      placeholder="Tamnho do Produto"
                    />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="size">Valor</label>
                    <InputNumber
                      v-model="v$.value.$model"
                      id="value"
                      :min="0"
                      :maxFractionDigits="2"
                      prefix="R$"
                      locale="pt-BR"
                      :minFractionDigits="2"
                      placeholder="Valor do Produto"
                    />
                    <FieldError :errors="v$.$errors" />
                  </div>
                  <div class="field md:col-6 sm:col-12">
                    <label for="status">Quantidade em estoque</label>
                    <InputNumber
                      v-model="v$.inStockQuantity.$model"
                      id="inStockQuantity"
                      :min="0"
                      :max="9999"
                      placeholder="Quantidade em estoque do Produto"
                    />
                    <FieldError :errors="v$.inStockQuantity.$errors" />
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
                          disabled
                        />
                        <label for="status-active" class="ml-2">Ativo</label>
                      </div>
                      <div class="field-radiobutton col-12 md:col-6">
                        <RadioButton
                          v-model="v$.status.$model"
                          id="status-inactive"
                          name="status"
                          value="inactive"
                          disabled
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
import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
  useListProductCategories,
  useListProducts,
  useSavePartnerProduct,
  useSaveProductCategorySizes
} from '@/composables'
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import { useRoute } from 'vue-router'
import { Product, ProductStatus } from '@/services/api/types'
import Dropdown, { DropdownChangeEvent } from 'primevue/dropdown'

const route = useRoute()
const toast = useToast()

const { data: productCategories, findProductCategories } = useListProductCategories()
const {
  data: sizes,
  findProductCategorySizes,
  reset: resetSizes
} = useSaveProductCategorySizes(toast)

const { data, findProducts } = useListProducts()

const { isLoading, v$, partnerProduct, findByPartnerIdAndId, reset, savePartnerProduct } =
  useSavePartnerProduct(+route.params?.partnerId, toast)

const conditions = ref({
  category: null,
  size: null
})

const product = ref<Product>({
  name: '',
  categoryId: undefined,
  size: '',
  pictureURI: '',
  status: ProductStatus.Active
})

const searchWithCategory = async (e: DropdownChangeEvent) => {
  await findProductCategorySizes(e.value)

  await findProducts({
    conditions: {
      category: { eq: conditions.value.category },
      // size: { eq: conditions.value.size },
      status: { eq: ProductStatus.Active }
    },
    sort: { category: 1 }
  })
}

const searchWithSize = async () => {
  await findProducts({
    conditions: {
      category: { eq: conditions.value.category },
      size: { eq: conditions.value.size },
      status: { eq: ProductStatus.Active }
    },
    sort: { category: 1 }
  })
}

const selectProduct = (selectedProduct: Product) => {
  product.value = selectedProduct
  partnerProduct.value.productId = product.value.id
}

onMounted(async () => {
  reset()

  if (route.params?.partnerId && route.params?.id) {
    await findByPartnerIdAndId(+route.params?.partnerId, +route.params?.id)
    if (partnerProduct.value) {
      product.value = partnerProduct.value.product as Product
    }
    return
  }

  await findProductCategories({ limit: 9999 })
})

watch(
  () => conditions.value.category,
  async (value) => {
    if (!value) {
      resetSizes()
      conditions.value.size = null
    }
  }
)

onUnmounted(() => {
  reset()
})
</script>

<style scoped>
.uploader-img {
  width: 100%;
}
</style>
