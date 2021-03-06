import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './route/routes'
import axios from 'axios'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  axios,
  store,
  router,
  render: h => h(App),
}).$mount('#app')

Vue.directive( 'drag', (obj, binding) =>{
  obj.onmousedown = function(el){
    var left = obj.offsetLeft;
    var top = obj.offsetTop;
    var width = obj.offsetWidth;
    var height = obj.offsetHeight;

    //计算出鼠标的位置与元素位置的差值。
    var cleft = el.clientX - left;
    var ctop = el.clientY - top;

    document.onmousemove = function (doc) {
      //计算出移动后的坐标。
      var moveLeft = doc.clientX - cleft;
      var moveTop = doc.clientY - ctop;

      //设置成绝对定位，让元素可以移动。
      obj.style.position = "absolute";

      //当移动位置在范围内时，元素跟随鼠标移动。
      obj.style.left = moveLeft + "px";
      obj.style.top = moveTop + "px";
    }

    document.onmouseup = function () {
      document.onmousemove = function () { }
    };
  }
});