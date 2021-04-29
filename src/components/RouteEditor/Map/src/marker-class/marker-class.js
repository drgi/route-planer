import { marker } from 'leaflet';
import { v4 } from 'uuid';
import { geoCodePointFromCords } from './geocoding';
import { activeIcon, defaultIcon } from './marker-icon';
export default class RouteMarker {
  constructor(latLng, opt) {
    this.isRouteble = opt.isRouteble;
    this.marker = marker(latLng, opt);
    // this.marker.options.icon = icon({
    //   iconUrl: '../icon/route.png',
    //   iconSize: [38, 50],
    //   iconAnchor: [22, 49],
    //   popupAnchor: [-3, -76],
    //   shadowSize: [68, 95],
    //   shadowAnchor: [22, 94],
    // });
    console.log('Icon', defaultIcon);

    this.marker.options.icon = defaultIcon;
    this.id = v4();
    this.index = null;
    this.ditanceToNextPoint = null;
    // Point content
    this.title = opt.title || '';
    this.geoCode = '';
    this.latLng = latLng;
    this.description = opt.description || '';
  }

  addEvents(evts) {
    evts.forEach((evt) => {
      const [key, fn] = evt;
      this.marker.on(key, () => {
        fn(this);
      });
    });
  }

  async geoCodePointByCoords() {
    try {
      this.latLng = this.marker.getLatLng();
      const { data } = await geoCodePointFromCords(this.latLng);
      if (!this.title || this.title === this.geoCode) {
        this.title = data.features[0].properties.label;
      }
      this.geoCode = data.features[0].properties.label;
    } catch (err) {
      console.log('Point goeCoding Error:', err);
    }
  }
  getLngLat() {
    const latLng = this.marker.getLatLng();
    const lngLat = Object.entries(latLng)
      .map((l) => l[1])
      .reverse();
    console.log('Latlng', lngLat);
    return lngLat;
  }
  changeRouteble() {
    this.isRouteble = !this.isRouteble;
    this.ditanceToNextPoint = null;
  }
  addToLayer(layer) {
    if (this.marker) {
      layer.addLayer(this.marker);
    }
    return;
  }
  flyToMarker() {
    const latLng = this.marker.getLatLng();
    this.marker._map.flyTo(latLng, 15);
  }
  turnOnLightMarker() {
    this.marker.setIcon(activeIcon);
  }
  turnOffLightMarker() {
    this.marker.setIcon(defaultIcon);
  }
  removeFromLayer() {
    this.marker.remove();
  }
}
