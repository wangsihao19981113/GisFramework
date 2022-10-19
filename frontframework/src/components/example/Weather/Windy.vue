<template>
  <div>
    <div style="position:absolute;z-index: 1;background-color: white">
      <el-radio v-model="url" label="/WindyData/demo.nc">NC</el-radio>
      <el-radio v-model="url" label="/WindyData/wind.json">JSON</el-radio>
      <el-radio v-model="url" label="/WindyData/wind.epak">EPAKWithWind</el-radio>
      <el-radio v-model="url" label="/WindyData/currents.epak">EPAKWithCurrents</el-radio>
    </div>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>


<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import {Wind3D} from "@/lib/weather/Wind/windy";

export default {
  components: {CesiumBaseView},
  data(){
    return{
      wind3D:null,
      url:"/WindyData/demo.nc",
      param:{
        "particlesTextureSize":64,
        "maxParticles":4096,
        "particleHeight":100,
        "fadeOpacity":0.999999,
        "dropRate":0.003,
        "dropRateBump":0.01,
        "speedFactor":0.1,
        "lineWidth":4,
        "globeLayer":{"name":"NaturalEarthII","type":"NaturalEarthII"},
        "lengthMultiplier": 1,
      },
      mode:{
        debug: true
      }
    }
  },
  mounted() {
    // 显示帧率
    window.viewer.scene.debugShowFramesPerSecond = true;
    this.wind3D = new Wind3D(
        this.param,
        this.mode,
        this.url,
        window.viewer
    );
    // this.$axios.get("/WindyData/wind.epak",{ responseType: 'arraybuffer' }).then(function (response){
    //   let data = decoder.decodeEpak(response.data);
    //   debugger;
    // })
  },
  watch:{
    url:function (){
      this.wind3D.remove();
      if(this.url.indexOf("currents") > -1)
      {
        this.param.lengthMultiplier = 20;
      }
      else
      {
        this.param.lengthMultiplier = 1
      }
      this.wind3D = new Wind3D(
          this.param,
          this.mode,
          this.url,
          window.viewer
      )
    }
  }
}
</script>

<style scoped>

</style>
