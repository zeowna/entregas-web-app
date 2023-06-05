<template>
  <Transition name="fade">
    <iframe height="100%" width="100%" :src="buildMapUri(address)"/>
  </Transition>

</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ address: any }>()

const showingMap = ref(false)
const toggleMap = () => showingMap.value = !showingMap.value


const buildMapUri = (address: any) => {
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.2318174806633!2d-49.290342123826385!3d-25.46393363423657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce37cec6384a1%3A0x483f2404ba979160!2sR.%20Mato%20Grosso%2C%20293%20-%20%C3%81gua%20Verde%2C%20Curitiba%20-%20PR%2C%2080620-070!5e0!3m2!1spt-BR!2sbr!4v1684792017854!5m2!1spt-BR!2sbr"`
}

</script>

<style scoped>
iframe {
  border: 0;
}

</style>
