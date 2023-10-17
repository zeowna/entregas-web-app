<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <form @submit.prevent="saveProductCategory">
          <div class="grid">
            <div class="field col-6">
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
import { computed, onMounted, ref } from 'vue'
import { ProductCategory } from '@/services/api/types'
import { Api } from '@/services/api/Api'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useToast } from 'primevue/usetoast'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import FieldError from '@/components/FieldError.vue'

const route = useRoute()
const toast = useToast()

const isLoading = ref(false)
const productCategory = ref<ProductCategory>({
  name: ''
})

const rules = computed(() => ({
  name: { required: helpers.withMessage('Preencha o Nome da Categoria', required) }
}))

const v$ = useVuelidate(rules, productCategory)

const findProductCategoryById = async (id: number) => {
  isLoading.value = true
  productCategory.value = await Api.productCategories.findById(id)
  isLoading.value = false
}

const createProductCategory = async () => {
  await Api.productCategories.create(productCategory.value)
}

const updateProductCategory = async () => {
  await Api.productCategories.update(productCategory.value.id, productCategory.value)
}

const goToProductCategories = async () => {
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Categoria salva com sucesso',
    life: 2000
  })

  await router.push({
    name: 'product-categories'
  })
}

const saveProductCategory = async () => {
  try {
    isLoading.value = true

    productCategory.value.name = productCategory.value.name.trim()

    const formValidation = await v$.value.$validate()

    if (!formValidation) {
      throw new Error(v$.value.$errors.map((e) => e.$message).join())
    }

    if (productCategory.value.id) {
      await updateProductCategory()
      await goToProductCategories()
      return
    }

    await createProductCategory()
    await goToProductCategories()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Erro ao Salvar',
      detail: err?.response?.data?.message ?? err.message ?? 'Não foi possível salvar a Categoria!',
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (route.params?.id) {
    await findProductCategoryById(+route.params?.id)
  }
})
</script>

<style scoped></style>
