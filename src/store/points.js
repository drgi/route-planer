import requestApi from '../controllers/api/';
export default {
  state: () => ({
    points: [],
    routeLegs: [],
    routeLegsFromFiles: [],
  }),
  getters: {
    points: (state) => state.points,
    routeLegs: (state) => state.routeLegs,
    routeLegsFromFiles: (state) => state.routeLegsFromFiles,
    getPointsForRouteRequest: (state) =>
      state.points
        .filter((p) => p.isRouteble)
        .map((point) => point.getLngLat()),
  },
  mutations: {
    addMarkerToState(state, marker) {
      const lastIndex = state.points.length;
      marker.index = lastIndex;
      state.points = [...state.points, marker];
    },
    addDictanceToNextPoint(state, geoJson) {
      const segments = geoJson.features[0].properties.segments;
      state.points
        .filter((p) => p.isRouteble)
        .map((p, idx, arr) => {
          if (idx !== arr.length - 1) {
            p.ditanceToNextPoint = (segments[idx].distance / 1000).toFixed(1);
          }
          return p;
        });
    },
    addGeoJson(state, geoJson) {
      state.routeLegs = [geoJson];
    },
    pushRouteLeg(state, geoJson) {
      state.routeLegs = [...state.routeLegs, geoJson];
    },
    addRouteLegsFromFiles(state, geoJOSNs) {
      state.routeLegsFromFiles = [...state.routeLegsFromFiles, ...geoJOSNs];
    },
    removeAllRouteLegs(state) {
      state.routeLegs = [];
    },
    removeRouteLeg(state, routeLeg) {
      state.routeLegsFromFiles = state.routeLegsFromFiles.filter(
        (l) => l.id !== routeLeg.id
      );
    },
    removePoint(state, routeMarker) {
      //routeMarker.removeFromLayer();
      console.log('State', routeMarker);
      state.points = state.points.filter((p) => p.id !== routeMarker.id);
    },
    changeRouteble(state, routeMarker) {
      routeMarker.changeRouteble();
      state.points = [...state.points];
    },
    removeAllPointsAndRoutes(state) {
      state.points = [];
      state.routeLegs = [];
      state.routeLegsFromFiles = [];
    },
  },
  actions: {
    async requestRouteFromApi({ commit, getters }) {
      const pointsForRouteReq = getters.getPointsForRouteRequest;
      if (pointsForRouteReq.length < 2) return;
      console.log('requestRouteFromApi', pointsForRouteReq);
      try {
        const { data } = await requestApi('requestRouteDirection', {
          coordinates: pointsForRouteReq,
        });
        commit('addGeoJson', data);
        commit('addDictanceToNextPoint', data);
        console.log('GeoJson', data);
      } catch (err) {
        console.log('Request route Error', err);
      }
    },
    //requestRouteFromApiAfterDrag({}, routeMarker) {},
    async requestRouteFromApiAfterDragList({ getters, commit }) {
      const pointsForRouteReq = getters.getPointsForRouteRequest;
      const pairOfpoints = pointsForRouteReq.reduce(
        (acc, point, index, arr) => {
          if (index !== arr.length - 1) {
            acc.push([point, arr[index + 1]]);
          }
          return acc;
        },
        []
      );
      console.log('Pair', pairOfpoints);
      commit('removeAllRouteLegs');
      for (let p of pairOfpoints) {
        const { data } = await requestApi('requestRouteDirection', {
          coordinates: p,
        });
        commit('pushRouteLeg', data);
      }
    },
  },
};
