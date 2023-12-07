<template>
  <div class="grid" v-if="!isLoading && !product.id">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Selecionar Produto</h5>

        <div class="grid">
          <div class="col-12">
            <Fieldset legend="Filtro de Produtos">
              <form @submit.prevent="searchForProducts">
                <div class="grid">
                  <div class="field col-12 md:col-6">
                    <label for="category">Categoria</label>
                    <Dropdown
                      id="category"
                      v-model="conditionsParams.category"
                      :options="productCategories.list"
                      option-value="id"
                      option-label="name"
                      show-clear
                      filter
                      placeholder="Selecione a Categoria do Produto"
                      @change="loadSizes"
                    />
                  </div>
                  <div class="field col-12 md:col-6">
                    <label for="size">Tamanho</label>
                    <Dropdown
                      id="size"
                      v-model="conditionsParams.size"
                      :options="sizes.list"
                      :disabled="!conditionsParams.category"
                      option-value="name"
                      option-label="name"
                      show-clear
                      filter
                      placeholder="Selecione o Tamanho do Produto"
                    />
                  </div>
                  <div class="field col-12 md:col-12">
                    <label for="name">Nome</label>
                    <span class="p-input-icon-left">
                      <i class="pi pi-search" />
                      <InputText
                        v-model="conditionsParams.name"
                        placeholder="Buscar pelo Nome do Produto"
                        show-clear
                      />
                    </span>
                  </div>

                  <Button type="submit" severity="primary" label="Buscar" />
                </div>
              </form>
            </Fieldset>
          </div>
        </div>
        <div class="grid" v-if="isLoadingProducts">
          <div class="col-12 align-content-center text-center">
            <ProgressSpinner></ProgressSpinner>
          </div>
        </div>

        <div class="grid" v-if="!isLoadingProducts">
          <div class="col-12 col-12 md:col-3" v-for="product in data.list" :key="product.id">
            <div class="p-4 border-1 surface-border surface-card border-round">
              <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-tag"></i>
                  <span class="font-semibold">{{ product.category?.name }}</span>
                </div>
              </div>
              <div class="flex flex-column align-items-center gap-3 py-5">
                <img
                  class="w-9 shadow-2 border-round"
                  :src="product.pictureURI"
                  :alt="`${product.name} - ${product.size}`"
                />
                <div class="text-2xl font-bold">{{ product.name }} - {{ product.size }}</div>
              </div>
              <div class="flex align-items-center justify-content-between">
                <Button severity="primary" label="Selecionar" @click="selectProduct(product)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid" v-if="product.id">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Cadastro de Produto</h5>
        <form @submit.prevent="savePartnerProduct">
          <div class="grid">
            <div class="md:col-3 col-12">
              <Fieldset legend="Foto">
                <img
                  v-if="product?.pictureURI"
                  :src="product?.pictureURI"
                  class="uploader-img pb-5"
                />
              </Fieldset>
            </div>
            <div class="md:col-9 col-12">
              <Fieldset legend="Dados do Produto">
                <div class="grid">
                  <div class="field md:col-6 col-12">
                    <label for="name">Nome</label>
                    <InputText
                      type="text"
                      v-model="product!.name"
                      id="name"
                      disabled
                      placeholder="Nome do Produto"
                    />
                  </div>
                  <div class="field md:col-6 col-12">
                    <label for="category">Tamanho</label>
                    <InputText
                      type="text"
                      v-model="product!.size"
                      id="size"
                      disabled
                      placeholder="Tamnho do Produto"
                    />
                  </div>
                  <div class="field md:col-6 col-12">
                    <label for="size">Valor</label>
                    <InputNumber
                      v-model="v$.value.$model"
                      id="value"
                      :min="0.99"
                      :maxFractionDigits="2"
                      prefix="R$"
                      locale="pt-BR"
                      :minFractionDigits="2"
                      placeholder="Valor do Produto"
                    />
                    <FieldError :errors="v$.$errors" />
                  </div>
                  <div class="field md:col-6 col-12">
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
                  <!-- <div class="field col-12 md:col-6">
                    <label for="status">
                      Status
                      <i
                        class="pi pi-info-circle"
                        v-tooltip="'Apenas o Administrator pode alterar o Status'"
                      />
                    </label>
                    <div class="grid">
                      <div class="field-radiobutton col-12 md:col-6">
                        <RadioButton
                          v-model="partnerProduct.status"
                          id="status-active"
                          name="status"
                          value="active"
                          disabled
                        />
                        <label for="status-active" class="ml-2">Ativo</label>
                      </div>
                      <div class="field-radiobutton col-12 md:col-6">
                        <RadioButton
                          v-model="partnerProduct.status"
                          id="status-inactive"
                          name="status"
                          value="inactive"
                          disabled
                        />
                        <label for="status-inactive" class="ml-2">Inativo</label>
                      </div>
                    </div>
                  </div> -->
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
import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
  useListProductCategories,
  useListProducts,
  useSavePartnerProduct,
  useSaveProductCategorySizes
} from '@/composables'
import { useToast } from 'primevue/usetoast'
import FieldError from '@/components/FieldError.vue'
import { useRoute, useRouter } from 'vue-router'
import { Product, ProductStatus } from '@/services/api/types'
import Dropdown, { DropdownChangeEvent } from 'primevue/dropdown'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const {
  data: productCategories,
  params: categoryParams,
  findProductCategories
} = useListProductCategories()
const {
  data: sizes,
  findProductCategorySizes,
  reset: resetSizes
} = useSaveProductCategorySizes(toast)

const { isLoading: isLoadingProducts, params, data, findProducts } = useListProducts()

const {
  isLoading,
  v$,
  partnerProduct,
  findByPartnerIdAndId,
  findByPartnerIdAndProductId,
  reset,
  savePartnerProduct
} = useSavePartnerProduct(+route.params?.partnerId, toast)

const conditionsParams = ref({
  category: null,
  size: null,
  name: null
})

const product = ref<Product>({
  name: '',
  categoryId: undefined,
  size: '',
  pictureURI: '',
  status: ProductStatus.Active
})

const searchForProducts = async () => {
  const conditions: Record<string, any> = {}

  if (conditionsParams.value.category) {
    conditions.category = { eq: conditionsParams.value.category }
  }

  if (conditionsParams.value.size) {
    conditions.size = { eq: conditionsParams.value.size }
  }

  if (conditionsParams.value.name) {
    conditions.name = { contains: conditionsParams.value.name }
  }

  if (!Object.values(conditions).length) {
    data.value.list = []
    return
  }

  params.value.conditions = conditions
  params.value.sort = { category: 1 }

  await findProducts()
}

const loadSizes = async (e: DropdownChangeEvent) => {
  if (!e.value) {
    conditionsParams.value.size = null
    data.value.list = []
    return
  }

  await findProductCategorySizes(e.value)
}

const selectProduct = async (selectedProduct: Product) => {
  product.value = selectedProduct
  partnerProduct.value.productId = product.value.id
  partnerProduct.value.product = selectedProduct

  const existing = await findByPartnerIdAndProductId(
    +route.params.partnerId,
    selectedProduct.id as number
  )

  if (existing) {
    await findByPartnerIdAndId(+route.params.partnerId, existing.id as number)

    await router.push({
      name: 'edit-partner-product',
      force: true,
      params: {
        partnerId: +route.params.partnerId,
        id: existing.id
      }
    })
  }
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

  categoryParams.value.skip = 0
  categoryParams.value.limit = 9999
  await findProductCategories()
})

watch(
  () => conditionsParams.value.category,
  async (value) => {
    if (!value) {
      resetSizes()
      conditionsParams.value.size = null
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