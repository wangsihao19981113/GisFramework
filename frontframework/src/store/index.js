import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);
let store = new Vuex.Store({
    state:{
        viewer:null
    }
})

export default store;