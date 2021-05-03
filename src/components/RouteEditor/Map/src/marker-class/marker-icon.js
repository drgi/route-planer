import { divIcon } from 'leaflet';
const defaultIconHtml = (iconUrl) =>
  `<a href="#"><img src="${iconUrl}" height="40" width="40"/></a>`;
const activeIconHtml = (iconUrl) =>
  `<a href="#"><img src="${iconUrl}" height="40" width="40"  style="filter: drop-shadow(0 0px 5px red);"/></a>`;

export const defaultIcon = (iconUrl = '../icon/route.png') => {
  const html = defaultIconHtml(iconUrl);
  const icon = divIcon({
    className: 'material-icons prefix',
    html: html,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  return icon;
};

export const activeIcon = (iconUrl = '../icon/route.png') => {
  const html = activeIconHtml(iconUrl);
  const icon = divIcon({
    className: 'material-icons prefix',
    html: html,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  return icon;
};
