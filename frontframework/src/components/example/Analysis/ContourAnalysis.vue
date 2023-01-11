<template>
  <CesiumTerrianView/>
</template>

<script>
import CesiumTerrianView from "@/components/example/CesiumTerrianView";
import ContourAnalysis from "@/lib/Contour/ContourAnalysis";
export default {
  name: "ContourAnalysis",
  components: {CesiumTerrianView},
  mounted() {
    let contourAnalysis = new ContourAnalysis(window.viewer,{})
    contourAnalysis.startAnalysis()
  }
}
</script>

<style scoped>

</style>