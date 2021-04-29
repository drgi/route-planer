<template>
  <div id="route-file-loader-modal" class="modal">
    <div class="modal-content">
      <h5>Загрузка маршрута из файла</h5>
      <form action="#">
        <div class="file-field input-field">
          <div class="btn">
            <span>File</span>
            <input
              type="file"
              @change="takeFile"
              accept=".gpx,.klm"
              ref="routefiles"
              multiple
            />
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text" />
          </div>
        </div>
      </form>
      <div v-if="loading" class="progress">
        <div class="indeterminate"></div>
      </div>
      <p>Загрузить можно файлы .gpx и .klm</p>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat"
        >Закрыть</a
      >
    </div>
  </div>
</template>
<script>
import convertRouteFiles from './file-converter';
import { mapMutations } from 'vuex';
export default {
  name: 'RouteFileLoader',
  data() {
    return {
      loading: false,
      routeFiles: null,
    };
  },
  methods: {
    ...mapMutations(['addRouteLegsFromFiles', 'removeRouteLeg']),
    takeFile() {
      if (this.$refs.routefiles.files.length === 0) {
        //this.$toast("Файл не выбран");
        return;
      }
      this.routeFiles = this.$refs.routefiles.files;
    },
  },
  watch: {
    async routeFiles() {
      try {
        this.loading = true;
        const events = [['contextmenu', this.removeRouteLeg]];
        const geoJSONs = await convertRouteFiles(this.routeFiles);
        geoJSONs.forEach((g) => g.addEvents(events));
        this.addRouteLegsFromFiles(geoJSONs);
        this.loading = false;
      } catch (err) {
        console.log('Route file load Error', err);
      }
    },
  },
};
</script>
