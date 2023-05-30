<template>
  <CesiumBaseView></CesiumBaseView>
</template>
<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "OSGBLoad",
  components: {CesiumBaseView},
  mounted() {
    let tileset = new Cesium.Cesium3DTileset({url:"/3dtiles/HKMODEL/tileset.json"});
    window.viewer.scene.primitives.add(tileset);
    window.viewer.camera.flyTo({
      destination : new Cesium.Cartesian3(-2417132.2584273857, 5387271.33391129, 2404218.4856011993),
      orientation : {
        heading : 0.7547329431225442,
        pitch : -0.4710919957064119,
        roll : 0.000009320081717056894
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
