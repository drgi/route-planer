import axios from 'axios';
const url = 'https://ipwhois.app/json/';

const getIPinfo = axios.create({
  baseURL: url,
  timeout: 2000,
});

export const getClientCoordsById = async () => {
  const { data } = await getIPinfo.get();
  console.log(data);
  const { latitude, longitude } = data;
  return [+latitude, +longitude];
};
