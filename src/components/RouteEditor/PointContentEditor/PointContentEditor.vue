<template>
  <div class="row">
    <span @click="closeEditor" class="material-icons">close</span>
    <h3>Point content Editor</h3>
    <p>{{ pointProps.id }}</p>
  </div>
</template>
<script>
export default {
  name: 'PointContentEditor',
  methods: {
    closeEditor() {
      this.$emit('closeContentEditor');
    },
  },
  props: {
    pointProps: Object,
  },
};
</script>
