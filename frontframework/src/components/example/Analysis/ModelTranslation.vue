<template>
  <div>
    <div style="position:absolute;z-index: 100">
      <el-button @click="createTranslationController">开始</el-button>
      <el-button @click="removeTranslationController">清除</el-button>
    </div>
    <CesiumBaseView/>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import TranslationController from "@/lib/ModelControl/TranslationController";
export default {
  name: "ModelTanslation",
  components: {CesiumBaseView},
  mounted() {
    let viewer = window.viewer;
    this.createModel("http://localhost:8888/Model/风力机8.gltf",10,20,45,0,viewer)
  },
  methods:{
    createModel(url, height, heading, pitch, roll,viewer) {
      let scene = viewer.scene;
      height = Cesium.defaultValue(height, 0.0);
      heading = Cesium.defaultValue(heading, 0.0);
      pitch = Cesium.defaultValue(pitch, 0.0);
      roll = Cesium.defaultValue(roll, 0.0);
      let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

      let origin = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, height);
      let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr);

      scene.primitives.removeAll(); // Remove previous model
      this.modelp = scene.primitives.add(Cesium.Model.fromGltf({
        url : url,
        modelMatrix : modelMatrix,
      }));

      let self = this
      this.modelp.readyPromise.then(function(model) {
        model.activeAnimations.addAll({
          speedup : 0.5,
          loop : Cesium.ModelAnimationLoop.REPEAT
        });
        self.model = model;
      });
      viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0493706, 100),
        orientation : {
          heading : Cesium.Math.toRadians(0.0),
          pitch : Cesium.Math.toRadians(-45.0),//倾斜角度
          roll : 0.0
        },
        duration:0,//动画持续时间
        complete:()=>{//飞行结束之后执行的方法
        }
      });
      return self.model;
    },
    createTranslationController(){
      let self = this
      this.getModelHPR()
      if(!this.translationController) {
        this.translationController = new TranslationController(window.viewer);
        self.translationController.add(self.modelp)
      }
    },
    removeTranslationController(){
      this.translationController.destroy();
      this.translationController = null;
    },
    getModelHPR(){
      let modelMatrix = this.modelp.modelMatrix;
      var m1 = Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Matrix4.getTranslation( modelMatrix, new Cesium.Cartesian3()),
          Cesium.Ellipsoid.WGS84,
          new Cesium.Matrix4(),
      );

      var m3 = Cesium.Matrix4.multiply(
          Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()),
          modelMatrix,
          new Cesium.Matrix4(),
      );

      var mat3 = Cesium.Matrix4.getMatrix3(m3, new Cesium.Matrix3());

      var q = Cesium.Quaternion.fromRotationMatrix(mat3);
      var hpr = Cesium.HeadingPitchRoll.fromQuaternion(q);
      var heading = Cesium.Math.toDegrees(hpr.heading);
      var pitch = Cesium.Math.toDegrees(hpr.pitch);
      var roll = Cesium.Math.toDegrees(hpr.roll);
      console.log(heading,pitch,roll);
    }
  }
}
</script>

<style scoped>

</style>