<template>
  <small class="mb-5" v-for="error of errors" :key="error.$uid">{{ error.$message }}</small>
</template>

<script setup lang="ts">
import { ErrorObject } from '@vuelidate/core'
import { PropType } from 'vue'

defineProps({
  errors: {
    type: Array as PropType<ErrorObject[]>,
    default: () => []
  }
})
</script>

<style scoped>
small {
  color: #d32f2f;
}
</style>
