<template>
  <CesiumBaseView></CesiumBaseView>
</template>

<script>
import ViewShedStage from '../../../lib/Viewshed/Viewshed'
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "ViewshedStage",
  components: {CesiumBaseView},
  mounted() {
    let tileset = window.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
      url: '/3dtiles/building/tileset.json'
    }));
    // 聚焦
    window.viewer.zoomTo(tileset);

    let drawHandler = new Cesium.ScreenSpaceEventHandler(
        window.viewer.scene.canvas
    );
    // * 监测鼠标左击事件
    drawHandler.setInputAction(event => {
      let position = event.position;
      if (!Cesium.defined(position)) return;
      let ray = window.viewer.camera.getPickRay(position);
      if (!Cesium.defined(ray)) return;
      let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      if (!Cesium.defined(cartesian)) return;
      new ViewShedStage(window.viewer, {
        viewPosition: cartesian,
        viewDistance: 1000
      });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
}
</script>

<style scoped>

</style>