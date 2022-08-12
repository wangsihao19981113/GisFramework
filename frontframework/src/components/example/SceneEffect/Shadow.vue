<template>
  <BuildingModel></BuildingModel>
</template>

<script>
import BuildingModel from "@/components/example/DataLoad/BuildingModel";
export default {
  name: "Shadow",
  components: {BuildingModel},
  mounted() {
    lightingShadowInit(window.viewer, 1000);
    function lightingShadowInit(_viewer, speed) {
      _viewer.scene.globe.enableLighting = true;
      _viewer.shadows = true;
    }
  }
}
</script>

<style scoped>

</style>