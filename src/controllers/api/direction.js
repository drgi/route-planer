import axios from "axios";
const url =
  "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

const API_KEY = "5b3ce3597851110001cf6248fd8f389bb6ac47fda9e22279f42d5fce";
const headers = {
  Accept:
    "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
  "Content-Type": "application/json",
  Authorization: `${API_KEY}`
};

const directionApi = axios.create({
  baseURL: url,
  timeout: 2000,
  headers
});

export const requestRouteDirection = async coords => {
  const req = await directionApi.post("", coords);
  return req;
};
