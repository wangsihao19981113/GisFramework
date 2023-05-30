<template>
  <CesiumBaseView/>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "TerrainLoad",
  components: {CesiumBaseView},
  mounted() {
    var terrainProvider = new Cesium.CesiumTerrainProvider({
          url:"/Terrian/3",
          minimumLevel: 0,
          maximumLevel: 20,
    })
    window.viewer.terrainProvider = terrainProvider;
    window.viewer.scene.globe.terrainExaggeration = 20.0;
    window.viewer.camera.flyTo({
      destination : new Cesium.Cartesian3(-1970916.2392285925,5672354.868838107, 2148668.14359599),
      orientation : {
        heading : Cesium.Math.toRadians(0.0),
        pitch : Cesium.Math.toRadians(-90.0),//倾斜角度
        roll : 0.0
      },
      duration:0,//动画持续时间
      complete:()=>{//飞行结束之后执行的方法
      }
    });
  }
}
</script>

<style scoped>

</style>
