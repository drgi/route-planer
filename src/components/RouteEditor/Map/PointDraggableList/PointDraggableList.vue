<template>
  <draggable
    tag="ul"
    :list="points"
    handle=".drag-handle"
    item-key="name"
    @end="changeListPosition(points)"
    class="left-line"
  >
    <template #item="{ element, index }">
      <li
        @mouseover="showMarker(index)"
        @mouseleave="unShowMarker(index)"
        :style="{ 'margin-left': element.isRouteble ? '0px' : '25px' }"
      >
        <div class="row point-list hoverable">
          <div class="input-field col s10 point-field">
            <a
              @click="flyToMarker(index)"
              class="material-icons prefix drag-handle"
              style="font-size: 24px"
              >{{ element.isRouteble ? 'place' : 'edit_location_alt' }}</a
            >

            <input
              v-model="element.title"
              type="text"
              :id="'autocomplete-input' + index"
              class="autocomplete point-input"
              :placeholder="element.id + element.isRouteble.toString()"
            />
          </div>
          <a class="dropdown-trigger" href="#" :data-target="'dropdown' + index"
            ><i class="material-icons prefix">menu</i></a
          >

          <!-- Drop down menu -->
          <ul :id="'dropdown' + index" class="dropdown-content">
            <li>
              <a @click.prevent.stop="changeRouteble(element)"
                ><i
                  v-if="element.isRouteble"
                  class="material-icons"
                  :style="{ color: 'green' }"
                  >directions</i
                >
                <i v-else class="material-icons" :style="{ color: 'red' }"
                  >directions_off</i
                ></a
              >
            </li>
            <li>
              <a href="#!" @click.stop="openPointContenEditor(element)"
                ><i class="material-icons">edit</i></a
              >
            </li>
            <li>
              <a href="#!" @click.stop="removePoint(element)"
                ><i class="material-icons">delete_forever</i></a
              >
            </li>
          </ul>
        </div>
        <div v-if="element.ditanceToNextPoint" class="point-dist">
          {{ element.ditanceToNextPoint }} Км
        </div>
      </li>
    </template>
  </draggable>
</template>
<script>
import draggable from 'vuedraggable';
import M from 'materialize-css';
import { mapMutations, mapActions } from 'vuex';
export default {
  name: 'handle',
  display: 'Handle',
  instruction: 'Drag using the handle icon',
  order: 5,
  components: {
    draggable,
  },
  data() {
    return {
      dragging: false,
      hover: false,
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? 'under drag' : '';
    },
  },
  methods: {
    ...mapActions(['requestRouteFromApiAfterDragList']),
    ...mapMutations(['removePoint', 'changeRouteble']),
    openPointContenEditor(id) {
      console.log('Emit in PointDraggableList', id);
      this.$emit('openeditor', id);
    },
    changeListPosition(list) {
      console.log('End of dragg', list);
      this.requestRouteFromApiAfterDragList();
    },
    flyToMarker(index) {
      this.points[index].flyToMarker();
    },
    showMarker(index) {
      this.points[index].turnOnLightMarker();
    },
    unShowMarker(index) {
      this.points[index].turnOffLightMarker();
    },
  },

  props: {
    points: Array,
  },
  updated() {
    M.AutoInit();
  },
};
</script>
<style lang="scss">
.left-line {
  border-left: 3px dotted #ccc; /* Параметры линии */
  margin-left: 10px; /* Отступ слева */
  padding-left: -10px; /* Расстояние от линии до текста */
}
.point-list {
  margin-bottom: 0px !important;
}
.point-field {
  margin: 2px !important;
  padding: 2px !important;
  font-size: 10px !important;
  .point-input {
    margin-bottom: 0px !important;
    margin-left: 30px !important;
    height: 1.5rem !important;
    font-size: 15px !important;
  }
}
</style>
