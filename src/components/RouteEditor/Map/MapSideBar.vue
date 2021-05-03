<template>
  <ul
    class="sidenav sidenav-fixed"
    :style="{ transform: sideBar ? 'translateX(0%)' : 'translateX(-105%)' }"
  >
    <li>
      <div class="user-view sidebar-header">
        <a href="#" @click.stop="sideBar = !sideBar"
          ><i class="material-icons right">close</i></a
        >
        <a href="#" @click="openRouteEditor"
          ><i class="material-icons prefix right">edit</i></a
        >
        <a href="#name"><span class="black-text name">RouteEditor</span></a>
        <a href="#email"
          ><span class="black-text email">Название Маршрута</span></a
        >
      </div>
    </li>
    <div class="divider" v-if="points.length > 0"></div>
    <!--Point Field-->
    <PointDraggableList :points="points" @openeditor="openPointContenEditor" />
    <!--End Point Field-->
    <div class="divider"></div>
    <!--SideBar Footer with button-->
    <div class="sidebar-buttons-panel">
      <div class="section sidebar-buttons">
        <a href="#" @click="addNewRoutePoint"
          ><i class="material-icons button-icon">add</i></a
        >
        <a href="#" @click="clearMap"
          ><i class="material-icons button-icon">layers_clear</i></a
        >
        <a class="modal-trigger" href="#route-file-loader-modal"
          ><i class="material-icons button-icon">cloud_upload</i></a
        >
        <div class="divider"></div>
      </div>
    </div>
    <!--End SideBar footer with button-->
    <!-- File list-->
    <ul class="collapsible">
      <li>
        <div class="collapsible-header file-list">
          <i class="material-icons">description</i>Добавленные файлы
        </div>
        <div class="collapsible-body">
          <div class="collection">
            <a
              @click="flyToLine(file.id)"
              v-for="file in routeFiles"
              :key="file.id"
              href="#!"
              class="collection-item"
              >{{ file.fileName }}</a
            >
          </div>
        </div>
      </li>
    </ul>
    <!-- End File list-->
  </ul>
  <!--SideBar Trigger button-->
  <div class="fixed-action-btn map-sidebar-trigger">
    <a
      href="#"
      @click="sideBar = !sideBar"
      class="btn-floating btn-large waves-effect waves-light red"
      ><i class="material-icons">menu</i></a
    >
  </div>
  <!--End SideBar Trigger button-->
  <RouteFileLoader />
</template>
<script>
import PointDraggableList from './PointDraggableList/PointDraggableList';
import RouteFileLoader from '../RouteFileLoader/RouteFileLoader';
import { mapMutations, mapGetters } from 'vuex';
import { addMarker } from './src/marker-class';
export default {
  components: { PointDraggableList, RouteFileLoader },
  data() {
    return {
      sideBar: false,
    };
  },
  computed: {
    routeFiles() {
      return this.routeLegsFromFiles().map((f) => {
        return { fileName: f.fileName, id: f.id };
      });
    },
  },
  methods: {
    ...mapGetters(['routeLegsFromFiles']),
    ...mapMutations(['removeAllPointsAndRoutes']),
    flyToLine(id) {
      this.routeLegsFromFiles().forEach((f) => {
        if (f.id === id) {
          f.flyToLine();
        }
      });
    },
    openRouteEditor() {
      this.$emit('openrouteeditor');
    },
    openPointContenEditor(id) {
      this.$emit('openPointEditor', id);
    },
    clearMap() {
      if (
        window.confirm('Вы уверенны что хотите удалить все точки и маршрут?')
      ) {
        this.removeAllPointsAndRoutes();
      }
    },
    async addNewRoutePoint() {
      await addMarker(null, { isRouteble: true });
    },
  },
  props: {
    points: Array,
  },
};
</script>
<style lang="scss" scoped>
.sidebar-header {
  padding: 0px 16px 0px 16px !important;
}
.map-sidebar-trigger {
  left: 23px !important;
  top: 23px !important;
  bottom: auto !important;
  right: auto !important;
  padding-top: 0px !important;
}
.sidebar-buttons {
  padding-left: 2px !important;
  .button-icon {
    padding-right: 10px !important;
    font-size: 30px;
  }
}
.file-list {
  padding-left: 0px !important;
}
</style>
