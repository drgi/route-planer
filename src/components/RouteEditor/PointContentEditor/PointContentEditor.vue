<template>
  <div class="row">
    <div class="col s12 z-depth-1">
      <a href="#" @click="closeEditor" class="material-icons right">close</a>
      <h4>Редактор путевой точки.</h4>
      <div class="col l6 m6 s12">
        <p>
          Название:
          <span @blur="editTitle" contenteditable="true">{{
            pointProps.title
          }}</span>
        </p>
        <p>Координаты точки: {{ pointcoords }}</p>
        <p>Ближайший адрес: {{ pointProps.geoCode }}</p>
      </div>
      <div class="col l6 s12">
        <select class="icons" v-model="icon" @change="editMarkerIcon">
          <option
            value="../icon/route.png"
            data-icon="../icon/route.png"
            class="left"
          >
            Маршрутная точка
          </option>
          <option
            value="../icon/info.png"
            data-icon="../icon/info.png"
            class="left"
          >
            Полезная информация
          </option>
          <option
            value="../icon/coffee.png"
            data-icon="../icon/coffee.png"
            class="left"
          >
            Кофе
          </option>
          <option
            value="../icon/camp.png"
            data-icon="../icon/camp.png"
            class="left"
          >
            Место для лагеря
          </option>
          <option
            value="../icon/food.png"
            data-icon="../icon/food.png"
            class="left"
          >
            Кафе, ресторан, место где перекусить
          </option>
          <option
            value="../icon/fotozone.png"
            data-icon="../icon/fotozone.png"
            class="left"
          >
            Красивый вид
          </option>
          <option
            value="../icon/fuel.png"
            data-icon="../icon/fuel.png"
            class="left"
          >
            АЗС
          </option>
          <option
            value="../icon/hotel.png"
            data-icon="../icon/hotel.png"
            class="left"
          >
            Отель, гостинница
          </option>
          <option
            value="../icon/picnic.png"
            data-icon="../icon/picnic.png"
            class="left"
          >
            Место для пикника
          </option>
          <option
            value="../icon/repair.png"
            data-icon="../icon/repair.png"
            class="left"
          >
            Сервис, мастерская
          </option>
          <option
            value="../icon/wc.png"
            data-icon="../icon/wc.png"
            class="left"
          >
            Туалет
          </option>
        </select>
        <label>Images in select</label>
      </div>
      <form class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <textarea
              @change="editDescription"
              id="textarea1"
              class="materialize-textarea active"
            ></textarea>
            <label for="textarea1">{{ pointProps.iconUrl }}</label>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import M from 'materialize-css';
export default {
  name: 'PointContentEditor',
  data() {
    return {
      icon: this.pointProps.iconUrl || '',
    };
  },
  computed: {
    pointcoords() {
      return this.pointProps.getCoords();
    },
  },
  methods: {
    closeEditor() {
      this.$emit('closeContentEditor');
    },
    editTitle($evt) {
      const title = $evt.target.innerText;
      this.pointProps.setTitle(title);
    },
    editDescription($evt) {
      const description = $evt.target.value;
      this.pointProps.setDescription(description);
    },
    editMarkerIcon() {
      this.pointProps.setIcon(this.icon);
    },
  },
  activated() {
    M.AutoInit();
  },
  deactivated() {},
  props: {
    pointProps: Object,
  },
};
</script>
