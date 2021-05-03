//import { marker } from 'leaflet';
import { createLeafletMarker } from './create-marker';
import { v4 } from 'uuid';
import { geoCodePointFromCords, geoCodePointFromTitle } from './geocoding';
import { activeIcon, defaultIcon } from './marker-icon';
import { Autocomplete } from 'materialize-css';
import {
  convertDataForAutocomplit,
  getAutocompliteList,
  getLatLngFromLabel,
} from './autocomplite-converter';
import store from '../../../../../store';
export default class RouteMarker {
  constructor(latLng, opt) {
    this.isRouteble = opt.isRouteble || false;
    this.marker = latLng ? createLeafletMarker.call(this, latLng, opt) : null;
    if (this.marker) {
      this.marker.options.icon = defaultIcon();
    }
    this.id = v4();
    this.index = null;
    this.ditanceToNextPoint = null;
    this.iconUrl = opt.icon || '../icon/route.png';
    // Point content
    this.title = opt.title || '';
    this.geoCode = '';
    this.latLng = latLng;
    this.description = opt.description || '';
    this.DOMNode = null;
    this.autocompleteInst = null;
    this.evts = null;
  }
  addPointFromAutocomlite() {
    const latLng = getLatLngFromLabel(this.title);
    this.marker = createLeafletMarker.call(this, latLng, {
      draggable: true,
      isRouteble: true,
    });
  }
  ActivateAutoComplite() {
    this.autocompleteInst = Autocomplete.init(this.DOMNode, {
      onAutocomplete: (text) => {
        this.title = text;
        this.geoCode = text;
        this.addPointFromAutocomlite();
        store.commit('refreshState');
      },
    });
  }
  async updateAutocompliteData() {
    //request geocoding data...
    if (this.title.length < 3) return;
    const { data } = await geoCodePointFromTitle(this.title);
    convertDataForAutocomplit(data);
    const list = getAutocompliteList();
    this.autocompleteInst.updateData(list);
    this.autocompleteInst.open();
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
    return lngLat;
  }
  getCoords() {
    return `${this.latLng.lat}, ${this.latLng.lng}`;
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
    if (!this.marker) return;
    const icon = activeIcon(this.iconUrl);
    this.refreshMarkerIcon(icon);
  }
  turnOffLightMarker() {
    if (!this.marker) return;
    const icon = defaultIcon(this.iconUrl);
    this.refreshMarkerIcon(icon);
  }
  removeFromLayer() {
    this.marker.remove();
  }
  refreshMarkerIcon(icon = defaultIcon(this.iconUrl)) {
    this.marker.setIcon(icon);
  }
  setDescription(description) {
    this.description = description;
  }
  setDOMNode(node) {
    this.DOMNode = node;
  }
  setTitle(title) {
    this.title = title;
  }
  setIcon(iconUrl) {
    this.iconUrl = iconUrl;
    this.refreshMarkerIcon();
  }
}
