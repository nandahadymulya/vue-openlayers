<script setup>
import { computed } from 'vue'
import { useLocationStore } from '../stores/location'

const locationStore = useLocationStore()

const props = defineProps({
  name: String,
  longitude: Number,
  latitude: Number
})

defineEmits(['update:name', 'update:longitude', 'update:latitude'])

const value = computed({
  get() {
    return {
      name: props.name,
      longitude: props.longitude,
      latitude: props.latitude
    }
  },
  set(val) {
    console.log(val)
    emit('update:name', val)
    emit('update:latitude', val)
    emit('update:longitude', val)
  }
})

const addLocationToJsonFile = () => {
  const inputedLocation = {
    name: value.value.name,
    longitude: value.value.longitude,
    latitude: value.value.latitude
  }

  console.log(inputedLocation)

  try {
    locationStore.createLocation(inputedLocation)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="flex justify-center gap-2">
    <input v-model="value.name" type="text" class="border p-1 rounded" placeholder="Name" />
    <input
      v-model="value.longitude"
      type="number"
      class="border p-1 rounded"
      placeholder="Latitude"
    />
    <input
      v-model="value.latitude"
      type="number"
      class="border p-1 rounded"
      placeholder="Longitude"
    />
    <button @click="addLocationToJsonFile" class="bg-orange-500 text-white px-2 py-1 rounded">
      Add New Location
    </button>
  </div>
</template>
