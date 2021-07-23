import { marker } from 'leaflet';
import store from '../../../../../store';
const removePoint = async (routeMarker) => {
  store.commit('removePoint', routeMarker);
  await store.dispatch('requestRouteFromApi');
};
const doAfterDragent = async (routeMarker) => {
  await routeMarker.geoCodePointByCoords();
  await store.dispatch('requestRouteFromApi');
};
// const openPopUp = (routeMarker) => {
//   console.log('Marker click');
//   routeMarker.openPopUp();
// };
const evts = [
  ['contextmenu', removePoint],
  ['dragend', doAfterDragent],
  //['click', openPopUp],
];
export function createLeafletMarker(latLng, opt) {
  const m = marker(latLng, opt);
  m.bindTooltip('Нажмите, что бы посмотреть инфо');
  m.bindPopup('Hello');
  evts.forEach((evt) => {
    const [key, fn] = evt;
    m.on(key, () => {
      fn(this);
    });
  });
  return m;
}
