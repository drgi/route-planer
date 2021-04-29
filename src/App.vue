<template>
  <div id="app" class="row">
    <RouteEditor />
  </div>
</template>

<script>
import M from 'materialize-css';
import RouteEditor from './components/RouteEditor/RouteEditor';
export default {
  name: 'Leaflet-map',
  components: { RouteEditor },
  mounted() {
    M.AutoInit();
    // const mapSideNav = document.querySelectorAll('.sidenav');
    // M.Sidenav.init(mapSideNav, { preventScrolling: false });
  },
};
</script>
