<template>
  <div class="row">
    <h3>{{ routeProps }}</h3>
    <span @click="closeRouteContentEditor" class="material-icons">close</span>
  </div>
</template>
<script>
export default {
  name: 'RouteContentEditor',
  methods: {
    closeRouteContentEditor() {
      this.$emit('closeContentEditor');
    },
  },
  props: {
    routeProps: String,
  },
};
</script>
