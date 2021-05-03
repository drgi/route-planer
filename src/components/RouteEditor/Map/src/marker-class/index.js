import RouteMarker from './marker-class';
import store from '../../../../../store';

export const addMarker = async (...args) => {
  const marker = new RouteMarker(...args);
  if (marker.marker) {
    await marker.geoCodePointByCoords();
  }
  // const evt = [
  //   ['contextmenu', addMarkerToState],
  //   ['dragend', doAfterDragent],
  // ];
  // marker.addEvents(evt);
  store.commit('addMarkerToState', marker);
  return marker;
};

// const addMarkerToState = async (routeMarker) => {
//   console.log('Store', store);
//   store.commit('removePoint', routeMarker);
//   await store.dispatch('requestRouteFromApi');
// };
// const doAfterDragent = async (routeMarker) => {
//   await routeMarker.geoCodePointByCoords();
//   await store.dispatch('requestRouteFromApi');
// };
