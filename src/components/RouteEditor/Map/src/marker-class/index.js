import RouteMarker from './marker-class';
import store from '../../../../../store';

export const addMarker = async (...args) => {
  const marker = new RouteMarker(...args);
  await marker.geoCodePointByCoords();
  store.commit('addMarkerToState', marker);
  return marker;
};
