<template>
  <div>
    <Map
      :points="points"
      :routeLegs="routeLegs"
      :routeLegsFromFiles="routeLegsFromFiles"
    />
    <MapSideBar
      v-on:openrouteeditor="openRouteContentEditor"
      v-on:openPointEditor="openPointContentEditor"
      :points="points"
    />
  </div>
</template>
<script>
import Map from './Map';
import { mapGetters } from 'vuex';
import MapSideBar from './MapSideBar';
export default {
  name: 'RouteMap',
  components: {
    Map,
    MapSideBar,
  },
  computed: {
    ...mapGetters(['points', 'routeLegs', 'routeLegsFromFiles']),
  },
  methods: {
    openRouteContentEditor() {
      this.$emit('openrouteeditor');
    },
    openPointContentEditor(id) {
      this.$emit('openPointEditor', id);
    },
  },
};
</script>
