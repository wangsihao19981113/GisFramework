<template>
  <div id="HomePage" class="HomePage">
    <router-view style="position:absolute;z-index: 2"></router-view>
    <topBar/>
    <ToolBar/>
    <CesiumContainer/>
    <ImportDataView ref="ImportDataView"></ImportDataView>
    <left-bar/>
  </div>
</template>

<script>

import topBar from './TopBar.vue'
import CesiumContainer from "./CesiumContainer.vue";
import ToolBar from "@/components/home/ToolBar";
import ImportDataView from "@/components/home/View/ImportDataView";
import LeftBar from "@/components/home/LeftBar";

export default {
  name: "Home",
  components:{
    LeftBar,
    ImportDataView,
    topBar,
    CesiumContainer,
    ToolBar
  },
  mounted() {
  }
}
</script>

<style scoped>
.PopupElement{
  background: white;
  padding: 10px 20px 10px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
</style>