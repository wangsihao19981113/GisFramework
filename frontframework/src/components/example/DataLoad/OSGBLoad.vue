<template>
  <CesiumBaseView></CesiumBaseView>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "OSGBLoad",
  components: {CesiumBaseView},
  mounted() {
    let tileset = window.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
      url: '/datasource/3dtiles/1/tileset.json'
    }));
    window.viewer.zoomTo(tileset);
  }
}
</script>

<style scoped>

</style>