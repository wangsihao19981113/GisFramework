<template>
  <CesiumBaseView/>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import Flame from "@/lib/ParticleSystem/Flame";
export default {
  components: {CesiumBaseView},
  mounted() {
    let position = [112,23]
    let options = {
      position:position
    }
    let flame = new Flame(window.viewer,options)
  }
}
</script>

<style scoped>

</style>