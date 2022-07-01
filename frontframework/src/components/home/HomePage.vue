<template>
  <div class="HomePage">
    <router-view style="position:absolute;z-index: 2"></router-view>
    <topBar/>
    <ToolBar/>
    <CesiumContainer/>
  </div>
</template>

<script>

import topBar from './TopBar.vue'
import CesiumContainer from "./CesiumContainer.vue";
import ToolBar from "@/components/home/ToolBar";

export default {
  name: "Home",
  components:{
    topBar,
    CesiumContainer,
    ToolBar
  },
  mounted() {
    //  var polygon = [{"x":1,"y":1,"z":0},{"x":1,"y":-1,"z":0},{"x":-1,"y":-1,"z":0},{"x":-1,"y":1,"z":0},{"x":1,"y":1,"z":0}];
    //  //var line = [{"x":-1,"y":-1,"z":-1},{"x":-0.5,"y":-0.5,"z":-0.5}];
    //   var line = [{"x":0,"y":0,"z":-1},{"x":0,"y":0,"z":1}];
    // //{"x":-0.5,"y":-0.5,"z":-0.5}
    //  console.log(SpatialComputing.IntersectionOFPolygonAndLine(polygon,line))



  }
}
</script>

<style scoped>
.PopupElement{
  background: white;
  left: 100px;
  top:100px;
  padding: 10px 20px 10px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>