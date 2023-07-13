import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLocationStore = defineStore({
  id: 'location',
  state: () => ({
    locations: [
      {
        name: 'Lokasi A',
        latitude: -7.7864,
        longitude: 110.3658
      },
      {
        name: 'Lokasi B',
        latitude: -7.8015,
        longitude: 110.3672
      },
      {
        name: 'Lokasi C',
        latitude: -7.7937,
        longitude: 110.3708
      }
    ]
  }),

  getters: {
    getLocations: (state) => state.locations,
    getListLength: (state) => state.locations.length
  },

  actions: {
    async fetchLocations() {
      try {
        // fetch data from JSON File
        const response = await fetch('../assets/data/data.json')
        const data = await response.json()
        console.log(data)
        this.locations = data
      } catch (error) {
        console.log(error)
      }
    },

    createLocation(location) {
      try {
        this.locations.push(location)
      } catch (error) {
        console.log(error)
      }
    },

    deleteLocation(index) {
      try {
        // remove last item
        this.locations.splice(index)
      } catch (error) {
        console.log(error)
      }
    }
  },

  persist: {
    enabled: true
  }
})
