<template>
  <div class="container">
    <div class="col s12">
      <a href="#" @click="closeRouteContentEditor" class="material-icons right"
        >close</a
      >
      <h4>Описание вашего маршрута</h4>
      <div class="col s12 z-depth-1">
        <form>
          <!--Route name input-->
          <div class="row">
            <div class="input-field col s12 m12 l12">
              <input
                v-model.trim="routeName"
                id="route_name"
                type="text"
                @change="editRouteName"
                :class="{
                  invalid:
                    v$.routeName.minLength.$invalid ||
                    v$.routeName.required.$invalid,
                }"
              />
              <label :class="{ active: routeName }" for="route_name"
                >Название маршрута...</label
              >
              <small
                class="helper-text invalid"
                v-if="v$.routeName.required.$invalid"
                >Введите название</small
              >
              <small
                class="helper-text invalid"
                v-else-if="v$.routeName.minLength.$invalid"
                >{{ routeNameLength }} /
                {{ v$.routeName.minLength.$params.min }} символов
              </small>
            </div>
          </div>
          <!--End Route name input-->

          <!--Route length input-->
          <div class="row">
            <div class="input-field col s12 m4 l4">
              <i class="material-icons prefix">location_on</i>
              <textarea
                v-model="routeLength"
                placeholder="km"
                id="icon_prefix2"
                class="materialize-textarea"
              ></textarea>
              <label :class="{ active: routeLength }" for="icon_prefix2"
                >Протяженность в км</label
              >
            </div>
          </div>
          <!--End of Route length input-->

          <!--Route Duration input-->
          <div class="row">
            <div class="input-field col s12 m4 l4">
              <i class="material-icons prefix">insert_invitation</i>
              <textarea
                v-model="routeDuration"
                id="icon_prefix3"
                class="materialize-textarea"
              ></textarea>
              <label :class="{ active: routeDuration }" for="icon_prefix2"
                >На сколько дней?</label
              >
            </div>
          </div>
          <!--End of Route Duration input-->

          <!--Route Type, Difficult, bikeTyte select-->
          <div class="row">
            <div class="input-field col s12 m4 l4">
              <i class="material-icons prefix">call_missed</i>
              <select v-model="routeType">
                <option value="" disabled selected>Тип маршрута</option>
                <option value="Эндуро">Эндуро</option>
                <option value="Дальняк">Дальняк</option>
                <option value="Красивая дорога">Красивая дорога</option>
              </select>
            </div>
            <div class="input-field col s12 m4 l4">
              <i class="material-icons prefix">filter_list</i>
              <select v-model="routeDifficult">
                <option value="" disabled selected>Сложность</option>
                <option>Простой</option>
                <option>Средний</option>
                <option>Для профи</option>
                <option>Для смелых</option>
              </select>
            </div>
            <div class="input-field col s12 m4 l4">
              <i class="material-icons prefix">two_wheeler</i>
              <select v-model="bikeType">
                <option value="" disabled selected>Тип мотоцикла</option>
                <option>Эндуро</option>
                <option>Дорожный</option>
                <option>Чоппер</option>
              </select>
            </div>
            <div class="input-field col s12 m12 l12">
              <textarea
                v-model="routeDescription"
                class="materialize-textarea"
              ></textarea>
              <label :class="{ active: routeDescription }" for="textarea1"
                >Описание маршрута</label
              >
            </div>
          </div>
          <!--End of Route Type, Difficult, bikeTyte select-->
        </form>
        <!--Route Images file input-->
        <div class="file-field input-field col s12">
          <div class="btn lime lighten-2">
            <span>Фото</span>
            <input
              type="file"
              id="file"
              ref="routeImages"
              v-on:change="takeUploadImageFile"
              multiple
            />
          </div>
          <div class="file-path-wrapper">
            <input
              class="file-path validate"
              type="text"
              placeholder="Добавте фото с маршрута"
            />
          </div>
          <div
            class="card-panel image-card"
            @contextmenu.prevent="deleteImage(index, image.isAvatar)"
          >
            <label>
              <input
                class="with-gap"
                name="avatar"
                type="radio"
                :value="index"
                @change="chooseAvatar(index)"
              />
              <span>Выбрать как аватар</span>
            </label>
            <img class="materialboxed responsive-img" src="" />
          </div>
        </div>
        <!--End Route Images file input-->
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import M from 'materialize-css';
export default {
  name: 'RouteContentEditor',
  setup: () => ({ v$: useVuelidate() }),
  activated() {
    M.AutoInit();
  },
  computed: {
    routeId() {
      return this.getRouteId();
    },
    routeName: {
      get() {
        return this.getRouteName();
      },
      set(value) {
        this.setRouteName(value);
      },
    },
    routeType: {
      get() {
        return this.getRouteType();
      },
      set(value) {
        this.setRouteType(value);
      },
    },
    routeDuration: {
      get() {
        return this.getRouteDuration();
      },
      set(value) {
        this.setRouteDuration(value);
      },
    },
    routeDifficult: {
      get() {
        return this.getRouteDifficult();
      },
      set(value) {
        this.setRouteDifficult(value);
      },
    },
    bikeType: {
      get() {
        return this.getBikeType();
      },
      set(value) {
        this.setBikeType(value);
      },
    },
    routeDescription: {
      get() {
        return this.getRouteDescription();
      },
      set(value) {
        this.setRouteDescription(value);
      },
    },
    routeLength() {
      return this.getRouteLength();
    },
    //******************************************* */
    routeNameLength() {
      return this.routeName.length;
    },
  },
  methods: {
    ...mapMutations([
      'setGeoJsonFromFile',
      'clearState',
      'setRouteName',
      'setRouteType',
      'setRouteDuration',
      'setRouteDifficult',
      'setBikeType',
      'setRouteDescription',
      'startLoading',
      'endLoading',
      'setRouteImagesForUpload',
      'changeAvatar',
      'setAndShowInfoMessage',
    ]),
    ...mapGetters([
      'getDataForSubmit',
      'getRouteId',
      'getRouteLength',
      'getAuthor',
      'getToken',
      'getImageUls',
      'getPointImagesForSubmit',
      'getRouteName',
      'getRouteType',
      'getRouteLength',
      'getRouteDuration',
      'getRouteDifficult',
      'getBikeType',
      'getRouteDescription',
      'getRouteImages',
    ]),
    closeRouteContentEditor() {
      this.$emit('closeContentEditor');
    },
    editRouteName() {
      this.v$.$touch();
    },
  },
  mounted() {
    console.log('This', this);
  },
  props: {
    routeProps: String,
  },
  validations() {
    return {
      routeName: { required, minLength: minLength(6) },
      routeDescription: { required, minLength: minLength(6) },
      routeDuration: { required, between: { min: 1, max: 30 } },
    };
  },
};
</script>
