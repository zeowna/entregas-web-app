<template>
  <Dialog
    :visible="isLoading"
    :closable="false"
    :header="header"
    modal
    :style="{ borderRadius: '12px' }"
  >
    <div class="text-center">
      <ProgressSpinner fill="var(--surface-ground)" />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
defineProps({
  header: { type: String, default: 'Processando...' },
  isLoading: { type: Boolean, default: false }
})
</script>
