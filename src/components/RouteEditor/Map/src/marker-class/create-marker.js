import { marker } from 'leaflet';
import store from '../../../../../store';
const addMarkerToState = async (routeMarker) => {
  store.commit('removePoint', routeMarker);
  await store.dispatch('requestRouteFromApi');
};
const doAfterDragent = async (routeMarker) => {
  await routeMarker.geoCodePointByCoords();
  await store.dispatch('requestRouteFromApi');
};
const evts = [
  ['contextmenu', addMarkerToState],
  ['dragend', doAfterDragent],
];
export function createLeafletMarker(latLng, opt) {
  const m = marker(latLng, opt);
  evts.forEach((evt) => {
    const [key, fn] = evt;
    m.on(key, () => {
      fn(this);
    });
  });
  return m;
}
