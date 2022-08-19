<template>
  <CesiumBaseView></CesiumBaseView>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "BIMModel",
  components: {CesiumBaseView},
  mounted() {
    let tileset = window.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
      url: '/3dtiles/3dtiles2/tileset.json'
    }));
    window.viewer.zoomTo(tileset);
    window.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false
    window.viewer.scene.globe.depthTestAgainstTerrain = true
    window.viewer.screenSpaceEventHandler.setInputAction(function (clickEvent) {
      // var ray1 = viewer.camera.getPickRay(clickEvent.position);
      // var cartesian = viewer.scene.globe.pick(ray1, viewer.scene);
      // console.log('地形高度点',cartesian);
      // var pick = viewer.scene.pickPosition(clickEvent.position);
      var pickModel = viewer.scene.pick(clickEvent.position);
      if (pickModel) {
        debugger
        pickModel.color = Cesium.Color.YELLOW;
        console.log(pickModel)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}
</script>

<style scoped>

</style>