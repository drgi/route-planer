import RouteMarker from './marker-class';
import store from '../../../../../store';

export const addMarker = async (...args) => {
  const marker = new RouteMarker(...args);
  if (marker.marker) {
    await marker.geoCodePointByCoords();
  }
  store.commit('addMarkerToState', marker);
  return marker;
};
