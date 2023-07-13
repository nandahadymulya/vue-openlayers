<script setup>
import MapComponent from '@/components/MapComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import { ref, computed, reactive } from 'vue'

const inputed = {
  name: 'Lokasi D',
  latitude: -7.8941,
  longitude: 110.3811
}
</script>
<template>
  <div>
    <h1 class="my-3 text-center text-xl font-bold">Vue 3 + Vite + Tailwind CSS + OpenLayers</h1>
    <InputComponent
      v-model:name="inputed.name"
      v-model:longitude="inputed.longitude"
      v-model:latitude="inputed.latitude"
    />
    <MapComponent />
  </div>
</template>
