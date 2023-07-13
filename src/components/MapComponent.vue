<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Icon } from 'ol/style'

import { useLocationStore } from '../stores/location'
import pin from '../assets/icons/pin.png'

const locationStore = useLocationStore()
const listLocation = locationStore.getLocations

const mapContainer = ref(null)
const selectedMarker = ref(null)

let map

// Main coordinate
const mainCoordinate = {
  longitude: 110.3695,
  latitude: -7.7956
}

const initMap = () => {
  // Set the projection to EPSG:3857 (Web Mercator)
  const projection = 'EPSG:3857'

  const mainCoordinateInProjection = fromLonLat(
    [mainCoordinate.longitude, mainCoordinate.latitude],
    projection
  )

  map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: mainCoordinateInProjection,
      projection,
      zoom: 10
    })
  })
}

const initMarker = () => {
  const markerSource = new VectorSource()

  listLocation.forEach((location) => {
    const { name, latitude, longitude } = location

    const marker = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
      name: name,
      longitude: longitude,
      latitude: latitude
    })

    markerSource.addFeature(marker)
  })

  const markerStyle = new Style({
    image: new Icon({
      src: pin, // Replace with your own marker icon path
      scale: 1,
      anchor: [0.5, 1]
    })
  })

  const markerLayer = new VectorLayer({
    source: markerSource,
    style: markerStyle
  })

  map.addLayer(markerLayer)
}

const selectMarker = () => {
  map.on('click', (event) => {
    map.forEachFeatureAtPixel(event.pixel, (feature) => {
      selectedMarker.value = feature.getProperties()
    })
  })
}

onMounted(() => {
  initMap()
  setInterval(() => {
    initMarker()
  }, 2000)

  selectMarker()
})

onUnmounted(() => {
  if (map) {
    map.dispose()
    map = null
  }
})
</script>

<template>
  <div ref="mapContainer" class="h-[40rem] p-4 rounded-lg"></div>
  <div class="bg-orange-100 rounded m-4">
    <div v-if="selectedMarker">
      <div class="p-3 text-center">
        <div class="text-lg font-bold">{{ selectedMarker.name }}</div>
        <div class="border border-bottom solid my-1 border-orange-500"></div>
        <div class="text-sm">Latitude: {{ selectedMarker.latitude }}</div>
        <div class="text-sm">Longitude: {{ selectedMarker.longitude }}</div>
        <div class="text-right">
          <button
            class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-4 text-sm rounded"
            @click="selectedMarker = null"
          >
            X
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="text-center text-lg font-bold mt-3">
        Click on the marker to see the information
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 900px;
}

.marker-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
