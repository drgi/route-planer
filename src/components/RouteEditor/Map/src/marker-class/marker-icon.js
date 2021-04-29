import { divIcon } from 'leaflet';
const defaultIconHtml =
  '<a href="#"><img src="../icon/route.png" height="40" width="40"/></a>';
const activeIconHtml =
  '<a href="#"><img src="../icon/route.png" height="40" width="40" style="box-shadow:0 0 15px #00aaff;"/></a>';

export const defaultIcon = divIcon({
  className: 'material-icons prefix',
  html: defaultIconHtml,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
export const activeIcon = divIcon({
  className: 'material-icons prefix',
  html: activeIconHtml,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
