import { geoJSON } from 'leaflet';
import store from '../../../store';
import RouteMarker from './src/marker-class/marker-class';
export default class RouteLeg {
  constructor(geoJson, opt) {
    this.id = Date.now();
    this.fileName = opt.name || 'Без имени';
    this.fileSize = opt.size || 0;
    this.LgeoJson = geoJSON(geoJson, {
      pointToLayer: (geoJsonPoint, latLng) => {
        console.log('Point added', geoJsonPoint);
        const { properties } = geoJsonPoint;
        const marker = new RouteMarker(latLng, {
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
    console.log('Bounds', bounds, this.LgeoJson);
    if (Object.keys(bounds).length === 0) {
      return;
    }

    this.LgeoJson._map.flyToBounds(bounds);
  }
}
