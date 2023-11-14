<template>
  <Transition name="fade">
    <div id="map" style="width: 100%; height: 25vw"></div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { Address } from '@/services/api/types'

const props = defineProps<{ address?: Address }>()

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  version: 'weekly',
  libraries: ['places']
})

const buildMapUri = async (address?: Address) => {
  if (!address) {
    return
  }

  const { Map } = await loader.importLibrary('maps')

  const mapOptions: google.maps.MapOptions = {
    center: {
      lat: address.lat as number,
      lng: address.lng as number
    },
    zoom: 16
  }

  const map = new Map(document.getElementById('map') as HTMLElement, mapOptions)

  new google.maps.Marker({
    position: map.getCenter(),
    map
  })
}

onMounted(() => {
  buildMapUri(props.address)
})
</script>

<style scoped>
iframe {
  border: 0;
}
</style>
