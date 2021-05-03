/* eslint-disable */
let list = {};

export const convertDataForAutocomplit = (geoJson) => {
  const listArr = geoJson.features.map((f) => {
    const value = f.geometry.coordinates.reverse();
    const key = f.properties.label;
    return [key, value];
  });
  list = Object.fromEntries(listArr);
};
export const getAutocompliteList = () => {
  const keys = Object.keys(list);
  const autoCompList = keys.map((k) => [k, null]);
  console.log('List', autoCompList);

  return Object.fromEntries(autoCompList);
};
export const getLatLngFromLabel = (label) => {
  const latLngArr = list[label];
  return { lat: latLngArr[0], lng: latLngArr[1] };
};
