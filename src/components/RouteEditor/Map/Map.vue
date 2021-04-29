<template>
  <div id="map" class="map col s12"></div>
</template>
<script>
import L from 'leaflet';
import { addMarker } from './src/marker-class';
import { mapMutations, mapActions } from 'vuex';
import { getClientCoordsById } from '../../../controllers/api/ididentificate';
let mapCenterCoords = [51.505, -0.09];
export default {
  data() {
    return {
      map: null,
      geoJSONLayers: [],
      geoJSONLayersFromFiles: [],
      markerLayer: L.layerGroup(),
      markerOptions: {
        draggable: true,
        isRouteble: true,
      },
      //points: [],
    };
  },
  // computed: {
  //   ...mapState(['points']),
  //   // points() {
  //   //   return this.$store.getters.points;
  //   // },
  // },
  methods: {
    ...mapMutations(['addMarkerToState', 'removePoint']),
    ...mapActions(['requestRouteFromApi']),
    removeMarker(routeMarker) {
      this.removePoint(routeMarker);
    },
    async dragendMarker(routeMarker) {
      console.log('RouteMarker', routeMarker);

      await routeMarker.geoCodePointByCoords();
      await this.requestRouteFromApi();
      //this.requestRouteFromApiAfterDrag(routeMarker);
    },
    async addMarker($evt) {
      const marker = await addMarker($evt.latlng, this.markerOptions);
      const evt = [
        ['contextmenu', this.removeMarker],
        ['dragend', this.dragendMarker],
      ];
      marker.addEvents(evt);
      // marker.on('contextmenu', (e) => {
      //   console.log('Click evt', e);
      //   e.target.removeFrom(this.markerLayer);
      //   this.points = this.points.filter(
      //     (p) => p._leaflet_id !== e.target._leaflet_id
      //   );
      // });
      // marker.on('dragend', () => {
      //   this.points = [...this.points];
      // });
      //this.points = [...this.points, marker];
      //this.addMarkerToState(marker);
    },
  },
  async mounted() {
    try {
      mapCenterCoords = await getClientCoordsById();
      console.log('Coords', mapCenterCoords);
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
      console.log('Map event', e);
      //e.originalEvent.preventDefault();
      //e.originalEvent.stopPropagation();
      this.addMarker(e);
    });
  },
  watch: {
    points(now, el) {
      console.log('Watch Points', 'Now:', now, 'Prev:', el);
      // const pointToRoute = [];
      this.markerLayer.clearLayers();
      now.forEach((point) => {
        point.addToLayer(this.markerLayer);
        //point.marker.addTo(this.map);
      });
      this.markerLayer.addTo(this.map);
      this.requestRouteFromApi();
      //console.log('Point for routing', pointToRoute);
    },
    routeLegs(now, prev) {
      console.log('Route legs', now, prev);
      if (this.geoJSONLayers.length > 0) {
        this.geoJSONLayers.forEach((l) => l.remove());
        this.geoJSONLayers = [];
      }
      now.forEach((g) => this.geoJSONLayers.push(L.geoJSON(g)));
      this.geoJSONLayers.forEach((l) => l.addTo(this.map));
    },
    routeLegsFromFiles(now, prev) {
      console.log('Route legs', now, prev);
      if (now.length === 0) {
        this.geoJSONLayersFromFiles.forEach((l) => l.remove());
        this.geoJSONLayersFromFiles = [];
      }
      this.geoJSONLayersFromFiles.forEach((l) => l.remove());
      this.geoJSONLayersFromFiles = [];
      now.forEach((g) => this.geoJSONLayersFromFiles.push(g));
      this.geoJSONLayersFromFiles.forEach((l) => l.addToLayer(this.map));
    },
  },
  props: {
    points: Array,
    routeLegs: Array,
    routeLegsFromFiles: Array,
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
