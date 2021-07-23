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
        :style="{ 'margin-left': element.isRouteble ? '0px' : '15px' }"
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
              @input="requestAutocomplite(index)"
              type="text"
              :id="'autocomplete-input' + element.id"
              class="autocomplete point-input"
              :placeholder="element.marker ? '' : 'Введите адрес или название'"
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
    ...mapActions(['requestRouteFromApi']),
    ...mapMutations(['removePoint', 'changeRouteble']),
    openPointContenEditor(id) {
      this.$emit('openeditor', id);
    },
    changeListPosition() {
      this.requestRouteFromApi();
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
    async requestAutocomplite(index) {
      if (!this.points[index].autocompleteInst) return;
      try {
        await this.points[index].updateAutocompliteData();
      } catch (err) {
        console.log('Autocomplite Error', err);
      }
    },
  },
  props: {
    points: Array,
  },
  updated() {
    M.AutoInit();
    this.points.forEach((p) => {
      const id = `autocomplete-input${p.id}`;
      const node = document.getElementById(id);
      p.setDOMNode(node);
      if (!p.marker) {
        p.ActivateAutoComplite();
      }
    });
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
    margin-left: 20px !important;
    height: 1.5rem !important;
    font-size: 15px !important;
  }
}
</style>
