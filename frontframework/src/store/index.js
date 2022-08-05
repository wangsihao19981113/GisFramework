import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);
let store = new Vuex.Store({
    state:{
        viewer:null,
        EntityList:[],
        IsShowImportDataView:false
    }
})

export default store;
