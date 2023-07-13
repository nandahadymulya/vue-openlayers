<script setup>
import MapComponent from '@/components/MapComponent.vue'
import InputComponent from '@/components/InputComponent.vue'

const newData = {
  name: 'Test',
  longitude: 5.54,
  latitude: 1.54
}
</script>
<template>
  <div>
    <h1 class="my-3 text-center text-xl font-bold">Vue 3 + Vite + Tailwind CSS + OpenLayers</h1>
    <InputComponent
      :name="newData.name"
      :longitude="newData.longitude"
      :latitude="newData.latitude"
    />
    <MapComponent />
  </div>
</template>
