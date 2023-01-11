<template>
  <div>
    <div style="position:absolute;z-index: 100">
      <el-button @click="start">开始</el-button>
      <el-button @click="clear">清除</el-button>
    </div>
    <CesiumBaseView/>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import AnalysisVisible from "@/lib/AnalysisVisible/AnalysisVisible";
export default {
  name: "AnalysisVisible",
  components: {CesiumBaseView},
  data(){
    return{
      point:[]
    }
  },
  mounted() {
    let viewer = window.viewer
    let tsdyt_model = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json",
        })
    );
    viewer.zoomTo(tsdyt_model)
    this.analysisVisible = new AnalysisVisible(window.viewer);
  },
  methods:{
    start(){
      let viewer = window.viewer;
      let self = this;
      let CesiumEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      let positions = [];
      let markers = [];//点实体
      CesiumEventHandler.setInputAction(function (movement) {
        let cartesian = viewer.scene.pickPosition(movement.position);
        if (cartesian) {
          positions.push(cartesian);//加点
          if (markers.length == 0) {
            //创建点实体
            let startpoint = viewer.entities.add({
              position: cartesian,
              point:{
                color:Cesium.Color.GREEN,
                pixelSize:5,
                outlineColor:Cesium.Color.YELLOW,
                outlineWidth:1
              }
            });
            markers.push(startpoint);
          }
          else if (markers.length == 1) {
            let endpoint = viewer.entities.add({
              position: cartesian,
              point:{
                color:Cesium.Color.RED,
                pixelSize:5,
                outlineColor:Cesium.Color.YELLOW,
                outlineWidth:1
              }
            });
            markers.push(endpoint);
            CesiumEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)//移除左键事件
            self.point.push(markers)
            self.analysisVisible.startAnalysis(positions);//开始分析
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    clear(){
      this.analysisVisible.clear()
      window.viewer.entities.removeAll()
    }
  }
}
</script>

<style scoped>

</style>