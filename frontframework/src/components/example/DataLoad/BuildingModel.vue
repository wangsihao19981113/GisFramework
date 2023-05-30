<template>
  <CesiumBaseView></CesiumBaseView>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "BuildingModel",
  components:{CesiumBaseView},
  mounted() {
    // 加载3D Tiles
    let tileset = window.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
      url: '/3dtiles/PSMODEL/tileset.json'
    }));
    // 聚焦
    window.viewer.zoomTo(tileset);
  }

}
</script>

<style scoped>

</style>
