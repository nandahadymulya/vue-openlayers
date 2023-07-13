<script setup>
import data from '../assets/data/data.json'
import { computed } from 'vue'

const props = defineProps({
  name: String,
  longitude: Number,
  latitude: Number
})
defineEmits(['update:name', 'update:longitude', 'update:latitude'])

const propsValue = computed({
  get() {
    return props
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const addLocationToJsonFile = () => {
  const newData = {
    name: props.name,
    longitude: props.longitude,
    latitude: props.latitude
  }
  //   permanent push to json file
  data.push(newData)
  console.log(data)

  //   reset input fields
  //   props.name = ''
  //   props.longitude = ''
  //   props.latitude = ''
}
</script>

<template>
  <div class="flex justify-center gap-2">
    <input v-model="props.name" class="border p-1 rounded" placeholder="Name" />
    <input v-model="props.longitude" class="border p-1 rounded" placeholder="Latitude" />
    <input v-model="props.latitude" class="border p-1 rounded" placeholder="Longitude" />
    <button @click="addLocationToJsonFile" class="bg-orange-500 text-white px-2 py-1 rounded">
      Add New Location
    </button>
  </div>
</template>
