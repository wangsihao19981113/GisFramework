<template>
  <CesiumBaseView></CesiumBaseView>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "ModelInstance",
  components: {CesiumBaseView},
  mounted() {
    let position = Cesium.Cartesian3.fromDegrees(112,23,0)
    let headingPitchRoll = new Cesium.HeadingPitchRoll(0,0,0);
    let Instances =[];
    for(var i = 0 ; i < 100 ; i++)
    {
      position = Cesium.Cartesian3.fromDegrees(Math.random()+112,Math.random()+23,0)
      Instances.push(this.getInstance(position,headingPitchRoll));
    }
    let collection = window.viewer.scene.primitives.add(
        new Cesium.ModelInstanceCollection({
            url:"/Model/风力机8.gltf",
            instances:Instances
    }))
    window.viewer.camera.flyTo({
      destination : Cesium.Cartesian3.fromDegrees(112,23,10000),
      orientation : {
        heading : Cesium.Math.toRadians(0.0),
        pitch : Cesium.Math.toRadians(-90.0),//倾斜角度
        roll : 0.0
      },
      duration:0,//动画持续时间
      complete:()=>{//飞行结束之后执行的方法
      }
    });
  },
  methods:{
    getInstance(position,headingPitchRoll){
      let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
          position,
          headingPitchRoll
      )

      Cesium.Matrix4.multiplyByUniformScale(
          modelMatrix,
          100,
          modelMatrix
      )

      return{
        modelMatrix:modelMatrix
      }
    }
  }
}
</script>

<style scoped>

</style>