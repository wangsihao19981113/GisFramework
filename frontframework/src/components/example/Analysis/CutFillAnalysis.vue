<template>
  <div>
    <div style="position:absolute;z-index: 100">
      <el-button @click="start">开始</el-button>
      <el-button @click="remove">去除</el-button>
    </div>
    <CesiumTerrianView></CesiumTerrianView>
  </div>
</template>

<script>
import CesiumTerrianView from "@/components/example/CesiumTerrianView";
import CutFillAnalysis from "@/lib/CutFill/CutFillAnalysis";
export default {
  name: "CutFillAnalysis",
  components: {CesiumTerrianView},
  mounted() {
    let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene._imageryLayerCollection);
    let positions = [];
    let entity = []
    handler.setInputAction(function (movement) {
      let ray = window.viewer.camera.getPickRay(movement.position);
      let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      positions.push(cartesian);
      let floatingPoint = window.viewer.entities.add({
        name: '空间距离',
        position: cartesian,
        point: {
          pixelSize: 5,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
        }
      })
      entity.push(floatingPoint)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction(function () {
      let cutfill = new CutFillAnalysis(window.viewer,{positions:positions,baseHeight:15000})
      cutfill.start()
    },Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  },
  methods:{
    start(){

    },
    remove(){

    }
  }
}
</script>

<style scoped>

</style>