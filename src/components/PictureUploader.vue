<template>
  <img
    v-if="pictureUri && !temporaryPicture"
    :src="`${store.getters.getBaseUrl}/${pictureUri}`"
    class="uploader-img pb-5"
  />
  <img v-if="temporaryPicture" :src="temporaryPicture" class="uploader-img pb-5" />
  <div class="text-center">
    <FileUpload
      mode="basic"
      class="max-w-13rem"
      name="demo[]"
      accept="image/*"
      :url="undefined"
      :maxFileSize="1000000"
      @select="onFileSelection"
      customUpload
      chooseLabel="Selecionar Foto"
    />
  </div>
</template>

<script setup lang="ts">
import { store } from '@/store'
import { ref } from 'vue'
import { FileUploadSelectEvent } from 'primevue/fileupload'

defineProps({
  pictureUri: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['onFileSelected'])

const file = ref<File | null>(null)
const temporaryPicture = ref<string | null>(null)

const onFileSelection = async (e: FileUploadSelectEvent) => {
  const [selectedFile] = e.files
  temporaryPicture.value = selectedFile.objectURL

  file.value = selectedFile

  emit('onFileSelected', file.value)
}
</script>

<style lang="scss" scoped>
.uploader-img {
  width: 100%;
}
</style>
