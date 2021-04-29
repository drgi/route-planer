import { createStore } from "vuex";
import points from "./points";
const store = createStore({
  modules: { points },
});

export default store;
