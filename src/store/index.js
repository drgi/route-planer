import { createStore } from 'vuex';
import mapEditorRoute from './mapEditorRoute';
const store = createStore({
  modules: { mapEditorRoute },
});

export default store;
