<template>
  <transition name="component-fade" mode="out-in">
    <keep-alive>
      <component
        :is="curentTab"
        @openrouteeditor="openRouteContentEditor"
        @closeContentEditor="closeEditor"
        @openPointEditor="openPointContentEditor"
        :pointProps="pointProps"
        :routeProps="routeProps"
      ></component>
    </keep-alive>
  </transition>
</template>
<script>
import RouteMap from './Map/RouteMap';
import RouteContentEditor from './RouteContentEditor/RouteContentEditor';
import PointContenEditor from './PointContentEditor/PointContentEditor';
export default {
  data() {
    return {
      tab: 'RouteMap',
      pointProps: 'PointProps',
      routeProps: 'RouteProps',
    };
  },
  components: { RouteMap, RouteContentEditor, PointContenEditor },
  computed: {
    curentTab() {
      return this.tab;
    },
  },
  methods: {
    openRouteContentEditor() {
      this.tab = 'RouteContentEditor';
    },
    openPointContentEditor(id) {
      console.log('Emit in RouteEditor', id);
      this.pointProps = id;
      this.tab = 'PointContenEditor';
    },
    closeEditor() {
      console.log('close editor');
      this.tab = 'RouteMap';
    },
  },
};
</script>
