<template>
  <CesiumBaseView></CesiumBaseView>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import Flooding from "../../../lib/Flooding/Flooding"
export default {
  name: "FloodingAnalysis",
  components: {CesiumBaseView},
  mounted() {
    let options = {
      positionArray:[112,25,114,25,114,35,112,35],
      targetHeight:10000,
      speed:0.2,
      waterHeight:10,
    }
    let flooding = new Flooding(window.viewer,options);
    flooding.start();
  }
}
</script>

<style scoped>

</style>