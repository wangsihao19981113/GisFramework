<template>
  <CesiumBaseView/>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import Explot from "@/lib/ParticleSystem/Explot";
export default {
  components: {CesiumBaseView},
  mounted() {
    let position = [112,23]
    let explot = new Explot(window.viewer,{
      position:position
    });
  }
}
</script>

<style scoped>

</style>