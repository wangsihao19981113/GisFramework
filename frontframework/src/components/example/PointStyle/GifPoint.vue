<template>
  <CesiumBaseView></CesiumBaseView>
</template>

<script>

import CesiumBaseView from "@/components/example/CesiumBaseView";
import {GifIcon} from "@/lib/GifIcon";

export default {
  name: "GifPoint",
  components: {CesiumBaseView},
  mounted() {
    let gifPoint = new GifIcon({
      lat:115,
      lng:23,
    });
    gifPoint.show(window.viewer);
    window.viewer.camera.flyTo({
      destination : Cesium.Cartesian3.fromDegrees(116,23,300000),
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