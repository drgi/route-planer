<template>
  <div id="map" class="map col s12"></div>
</template>
<script>
import L from 'leaflet';
import { addMarker } from './src/marker-class';
import { mapActions, mapGetters } from 'vuex';
import { getClientCoordsById } from '../../../controllers/api/ididentificate';
let mapCenterCoords = [51.505, -0.09];
export default {
  data() {
    return {
      selectStartCoord: null,
      selectEndCoord: null,
      polygon: null,
      map: null,
      geoJSONLayers: [],
      geoJSONLayersFromFiles: [],
      markerLayer: L.layerGroup(),
      markerOptions: {
        draggable: true,
        isRouteble: true,
      },
    };
  },
  computed: {
    selectAreaCoords() {
      const selectArea = [
        [this.selectStartCoord.lat, this.selectStartCoord.lng],
        [this.selectStartCoord.lat, this.selectEndCoord.lng],
        [this.selectEndCoord.lat, this.selectEndCoord.lng],
        [this.selectEndCoord.lat, this.selectStartCoord.lng],
      ];
      return selectArea;
    },
    latRange() {
      const latStart = this.selectStartCoord.lat;
      const latEnd = this.selectEndCoord.lat;
      const range = [latStart, latEnd];
      return latStart > latEnd ? range.reverse() : range;
    },
    lngRange() {
      const lngStart = this.selectStartCoord.lng;
      const lngEnd = this.selectEndCoord.lng;
      const range = [lngStart, lngEnd];
      return lngStart > lngEnd ? range.reverse() : range;
    },
  },
  methods: {
    ...mapGetters(['routeLegsFromFiles']),
    ...mapActions(['requestRouteFromApi']),
    async addMarker($evt) {
      await addMarker($evt.latlng, this.markerOptions);
    },
    filterRouteLegs() {
      const latRange = this.latRange;
      const lngRange = this.lngRange;
      const routeLegs = this.routeLegsFromFiles;
      routeLegs.forEach((r) =>
        r.filterCoords(latRange, lngRange).addToLayer(this.map)
      );
    },
  },
  async mounted() {
    try {
      mapCenterCoords = await getClientCoordsById();
    } catch (err) {
      console.log('IP identificate Error', err);
    }
    this.map = L.map('map', {
      center: mapCenterCoords,
      zoom: 10,
      zoomControl: false,
    });
    new L.Control.Zoom({ position: 'topright' }).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    );
    this.map.on('click', (e) => {
      if (e.originalEvent.ctrlKey) return;
      this.addMarker(e);
    });
    this.map.on('mousedown', (e) => {
      if (e.originalEvent.ctrlKey) {
        e.target.dragging.disable();
        e.target.on('mousemove', (e) => {
          this.selectEndCoord = e.latlng;
        });
        this.selectStartCoord = e.latlng;
      }
    });
    this.map.on('mouseup', (e) => {
      if (e.originalEvent.ctrlKey) {
        e.target.off('mousemove');
        e.target.dragging.enable();
        this.polygon.remove();
        this.filterRouteLegs();
      }
    });
  },
  watch: {
    points(now) {
      this.markerLayer.clearLayers();
      now.forEach((point) => {
        point.addToLayer(this.markerLayer);
      });
      this.markerLayer.addTo(this.map);
      this.requestRouteFromApi();
    },
    routeLegs(now) {
      if (this.geoJSONLayers.length > 0) {
        this.geoJSONLayers.forEach((l) => l.remove());
        this.geoJSONLayers = [];
      }
      now.forEach((g) => this.geoJSONLayers.push(L.geoJSON(g)));
      this.geoJSONLayers.forEach((l) => l.addTo(this.map));
    },
    routeLegsFromFiles(now) {
      if (now.length === 0) {
        this.geoJSONLayersFromFiles.forEach((l) => l.remove());
        this.geoJSONLayersFromFiles = [];
      }
      this.geoJSONLayersFromFiles.forEach((l) => l.remove());
      this.geoJSONLayersFromFiles = [];
      now.forEach((g) => this.geoJSONLayersFromFiles.push(g));
      this.geoJSONLayersFromFiles.forEach((l) => l.addToLayer(this.map));
    },
    selectEndCoord() {
      if (this.polygon) {
        this.polygon.remove();
      }
      this.polygon = L.polygon(this.selectAreaCoords).addTo(this.map);
    },
  },
  props: {
    points: Array,
    routeLegs: Array,
    routeLegsFromFiles: Array,
  },
  updated() {
    console.log('Dom Updated');
  },
};
</script>
<style scoped>
@import url('https://unpkg.com/leaflet@1.6.0/dist/leaflet.css');
.map {
  min-width: 100%;
  height: 1000px;
  padding: 0px;
  margin: 0px;
}
</style>
