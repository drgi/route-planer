import toGeoJSON from 'togeojson';
import RouteLeg from '../Map/RouteLeg-class';

const convertRouteFiles = async (files) => {
  const filesArr = Array.from(files);
  console.log('Files Arr ', filesArr);

  const geoJSONs = [];
  for (let file of filesArr) {
    const { name, size } = file;
    const gs = await _convertFile(file);
    geoJSONs.push(new RouteLeg(gs, { name, size }));
  }
  return geoJSONs;
};
const _convertFile = (file) => {
  let geoJSON = null;
  const fileType = _filetype(file);
  if (!fileType) throw new Error('Тип файла должен быть .gpx или .klm');
  const fileReader = new FileReader();
  const parser = new DOMParser();
  fileReader.readAsText(file);

  return new Promise((resolve, reject) => {
    fileReader.onload = () => {
      const result = fileReader.result;
      const parsedFile = parser.parseFromString(result, 'text/xml');
      geoJSON = toGeoJSON[fileType](parsedFile);
      resolve(geoJSON);
    };
    fileReader.onerror = function (err) {
      console.log(err);
      reject(err);
    };
  });
};
const _filetype = (file) => {
  const fileName = file.name;
  let fileType = null;
  if (/.gpx$/gi.test(fileName)) {
    fileType = 'gpx';
  }
  if (/.klm$/gi.test(fileName)) {
    fileType = 'gpx';
  }
  return fileType;
};

export default convertRouteFiles;
