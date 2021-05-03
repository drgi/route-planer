import { geoJSON } from 'leaflet';
import store from '../../../../../store/';
import { addMarker } from '../marker-class';
export default class RouteLeg {
  constructor(geoJson, opt) {
    this.id = Date.now();
    this.fileName = opt.name || 'Без имени';
    this.fileSize = opt.size || 0;
    this.LgeoJson = geoJSON(geoJson, {
      pointToLayer: (geoJsonPoint, latLng) => {
        const { properties } = geoJsonPoint;
        addMarker(latLng, {
          draggable: false,
          isRouteble: false,
          title: properties.name,
          description: properties.desc,
        });
        // const evt = [['contextmenu', this.removeMarker]];
        // marker.addEvents(evt);
        //store.commit('addMarkerToState', marker);
      },
    });
    this.geoJSON = geoJson;
  }
  addToLayer(map) {
    this.map = map;
    this.LgeoJson.addTo(map);
  }
  addEvents(events) {
    events.forEach((evt) => {
      const [key, fn] = evt;
      this.LgeoJson.on(key, () => {
        fn(this);
      });
    });
  }
  remove() {
    this.LgeoJson.remove();
  }
  flyToLine() {
    const bounds = this.LgeoJson.getBounds();
    if (Object.keys(bounds).length === 0) {
      return;
    }

    this.LgeoJson._map.flyToBounds(bounds);
  }
  filterCoords(latRange, lngRange) {
    console.log('LatRange', latRange, 'LngRange', lngRange);
    const newCoords = this.geoJSON.features.map((l) =>
      l.geometry.coordinates.map((coords) =>
        coords.filter(
          (c) => filterLat(latRange, c[1]) || filterLng(lngRange, c[0])
        )
      )
    );
    console.log('Filtered GeoJson', newCoords);
    this.geoJSON.features[0].geometry.coordinates = newCoords[0];
    console.log('Modyfied GeoJson', this.geoJSON);
    this.remove();
    this.LgeoJson = geoJSON(this.geoJSON, {
      pointToLayer: (geoJsonPoint, latLng) => {
        console.log('Point added', geoJsonPoint);
        const { properties } = geoJsonPoint;
        const marker = addMarker(latLng, {
          draggable: false,
          isRouteble: false,
          title: properties.name,
          description: properties.desc,
        });
        const evt = [['contextmenu', this.removeMarker]];
        marker.addEvents(evt);
        store.commit('addMarkerToState', marker);
      },
    });
    console.log('LgeoJSON', this.LgeoJson);

    return this;
  }
}

const filterLat = (latRange, lat) => latRange[0] > lat || latRange[1] < lat;
const filterLng = (lngRange, lng) => lngRange[0] > lng || lngRange[1] < lng;
