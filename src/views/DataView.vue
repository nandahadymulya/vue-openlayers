<script setup>
import { useLocationStore } from '../stores/location'

const locationStore = useLocationStore()

const resetStore = locationStore.$reset

const listLocation = locationStore.getLocations
const listLength = locationStore.getListLength

const location = {
  name: 'Lokasi D',
  latitude: -7.8037,
  longitude: 110.371
}
const createNewLocation = (location) => locationStore.createLocation(location)
const lastItem = listLocation[listLength - 1]
const deleteLocation = (lastItem) => locationStore.deleteLocation(lastItem)
const fetchData = () => locationStore.fetchLocations()
</script>

<template>
  <div class="p-12">
    <div>
      <h1 class="text-center font-bold text-3xl">DATA PINIA</h1>
      <h2 class="text-center font-bold text-xl">Locations Length: {{ listLength }}</h2>
      <div v-for="location in listLocation" :key="location.name" class="flex gap-12">
        <p>{{ location.name }}</p>
        <p>{{ location.longitude }}</p>
        <p>{{ location.latitude }}</p>
      </div>
    </div>

    <div class="mt-3">
      <button @click="createNewLocation(location)" class="bg-orange-500 text-white rounded p-3">
        Create New Location
      </button>
      <button @click="deleteLocation(lastItem)" class="bg-red-500 text-white rounded p-3">
        Delete Last Location
      </button>
      <button @click="resetStore" class="bg-green-500 text-white rounded p-3">
        Reset Location
      </button>
      <button @click="fetchData" class="bg-green-500 text-white rounded p-3">
        Fetch From JSON File
      </button>
    </div>
  </div>
</template>
