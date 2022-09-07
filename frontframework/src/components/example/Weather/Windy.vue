<template>
  <CesiumBaseView></CesiumBaseView>
</template>


<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import {Wind3D} from "@/lib/weather/Wind/windy";

export default {
  components: {CesiumBaseView},
  data(){
    return{
      windy:null
    }
  },
  mounted() {
    const mode = {
      debug: true
    };
    let url = "/WindyData/demo.nc"
    var param = {
      "particlesTextureSize":64,
      "maxParticles":4096,
      "particleHeight":100,
      "fadeOpacity":0.996,
      "dropRate":0.003,
      "dropRateBump":0.01,
      "speedFactor":1,
      "lineWidth":4,
      "globeLayer":{"name":"NaturalEarthII","type":"NaturalEarthII"},
    }
    var wind3D = new Wind3D(
        param,
        mode,
        url,
        window.viewer
    );
    window.wind3D = wind3D;
  }
}
</script>

<style scoped>

</style>