<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import 'ol/ol.css'
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Point } from 'ol/geom'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Cluster, OSM, Vector as VectorSource } from 'ol/source'
import { Icon, Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'
import { DragAndDrop } from 'ol/interaction'

import { useLocationStore } from '../stores/location'
import pin from '../assets/icons/pin.png'

const locationStore = useLocationStore()
const listLocation = locationStore.getLocations

const mapContainer = ref(null)
const markerCoordinates = ref(null)
const selectedCluster = ref(null)
const selectedMarker = ref(null)

let map
let markerLayer

// Main coordinate
const mainCoordinate = {
  longitude: 110.3695,
  latitude: -7.7956
}

// Zoom level
const zoomLevel = 10

const initMap = () => {
  // Set the projection to EPSG:3857 (Web Mercator)
  const projection = 'EPSG:3857'

  const mainCoordinateInProjection = fromLonLat(
    [mainCoordinate.longitude, mainCoordinate.latitude],
    projection
  )

  // raster layer
  const raster = new TileLayer({
    source: new OSM()
  })

  // set view
  const view = new View({
    center: mainCoordinateInProjection,
    projection,
    zoom: zoomLevel
  })

  // create map
  map = new Map({
    target: mapContainer.value,
    layers: [raster],
    view: view
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

  const clusterSource = new Cluster({
    distance: 50,
    source: markerSource
  })

  const clusterStyle = new Style({
    image: new CircleStyle({
      radius: 12,
      fill: new Fill({ color: '#1a6be3' }),
      stroke: new Stroke({ color: '#fff', width: 2 })
    }),
    text: new Text({
      text: clusterSource.getFeatures().length.toString(),
      fill: new Fill({ color: '#fff' }),
      font: 'bold 12px sans-serif'
    })
  })

  const markerStyle = (feature) => {
    const size = feature.get('features').length
    if (size > 1) {
      clusterStyle.getText().setText(size.toString())
      return clusterStyle
    } else {
      const { name } = feature.get('features')[0].getProperties()
      const style = new Style({
        image: new Icon({
          src: pin,
          scale: 1,
          anchor: [0.5, 1]
        }),
        text: new Text({
          text: name,
          offsetY: -36,
          fill: new Fill({ color: '#333' }),
          font: '12px sans-serif'
        })
      })
      return style
    }
  }

  markerLayer = new VectorLayer({
    source: clusterSource,
    style: markerStyle
  })

  map.addLayer(markerLayer)
}

const selectMarker = () => {
  map.on('click', (event) => {
    map.forEachFeatureAtPixel(event.pixel, (feature) => {
      if (feature.get('features').length > 1) {
        // cluster clicked
        selectedCluster.value = feature.getProperties()
        selectedMarker.value = null
      } else {
        // single marker clicked
        selectedCluster.value = null
        selectedMarker.value = feature.getProperties()
      }

      const coordinates = toLonLat(feature.getGeometry().getCoordinates())
      markerCoordinates.value = coordinates
    })
  })
}

// const enableMarkerDrag = () => {
//   dragInteraction = new DragAndDrop({
//     source: markerLayer.getSource(),
//     formatConstructors: [GeoJSON]
//   })
//   map.addInteraction(dragInteraction)

//   dragInteraction.on('dragend', (event) => {
//     const feature = event.features.item(0)
//     const coordinates = toLonLat(feature.getGeometry().getCoordinates())
//     const { name } = feature.getProperties()
//     selectedMarker.value = { name, latitude: coordinates[1], longitude: coordinates[0] }
//   })
// }

onMounted(() => {
  initMap()
  setInterval(() => {
    initMarker()
  }, 2000)
  selectMarker()
  // enableMarkerDrag()
})

onUnmounted(() => {
  if (map) {
    map.dispose()
    map = null
  }
  // if (dragInteraction) {
  //   map.removeInteraction(dragInteraction)
  // }
})
</script>

<template>
  <div ref="mapContainer" class="h-[36rem] p-4 rounded-lg"></div>
  <div class="bg-orange-500 text-white p-3 text-center mx-4">
    Current Coordinates: {{ markerCoordinates }}
  </div>
  <div class="bg-orange-100 p-4 mx-4">
    <div v-if="selectedCluster">
      <div class="flex justify-between">
        <div class="text-lg font-bold">
          Cluster of
          {{ selectedCluster.features.length }} Markers
        </div>
        <div class="text-right">
          <button
            class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-4 text-sm rounded"
            @click="selectedCluster = null"
          >
            X
          </button>
        </div>
      </div>
      <div>
        <div class="border border-bottom solid my-1 border-orange-500"></div>
        <div v-for="marker in selectedCluster.features" class="flex gap-2 items-center">
          <div class="text-lg font-bold">{{ marker.get('name') }}</div>
          &mdash;
          <div class="text-sm">Longitude: {{ marker.get('longitude') }}</div>
          <div class="text-sm">Latitude: {{ marker.get('latitude') }}</div>
        </div>
      </div>
    </div>
    <div v-else-if="selectedMarker">
      <div v-for="marker in selectedMarker.features" class="flex gap-2 items-center justify-center">
        <div class="text-lg font-bold">{{ marker.get('name') }}</div>
        &mdash;
        <div class="text-sm">Longitude: {{ marker.get('longitude') }}</div>
        <div class="text-sm">Latitude: {{ marker.get('latitude') }}</div>
      </div>
      <div class="text-right">
        <button
          class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-4 text-sm rounded"
          @click="selectedCluster = null"
        >
          X
        </button>
      </div>
    </div>
    <div v-else>
      <div class="text-center text-lg font-bold">Click on the marker to see the information</div>
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
