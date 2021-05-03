import axios from 'axios';

const url = 'https://api.openrouteservice.org/';

const API_KEY = '5b3ce3597851110001cf6248fd8f389bb6ac47fda9e22279f42d5fce';

const geoCodingApi = axios.create({
  baseURL: url,
  timeout: 5000,
});

export const geoCodePointFromCords = async ({ lat, lng }) => {
  const req = await geoCodingApi.get('/geocode/reverse', {
    params: { api_key: API_KEY, 'point.lat': lat, 'point.lon': lng },
  });
  return req;
};
export const geoCodePointFromTitle = async (title) => {
  const req = await geoCodingApi('/geocode/autocomplete', {
    params: { api_key: API_KEY, text: title },
  });
  return req;
};
