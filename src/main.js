/* eslint-disable */
import { createApp } from 'vue';
import store from './store';
import App from './App.vue';
import 'materialize-css/dist/css/materialize.min.css';
//import 'material-design-icons/iconfont/material-icons.css';
const app = createApp(App);
app.use(store);
app.mount('#app');
