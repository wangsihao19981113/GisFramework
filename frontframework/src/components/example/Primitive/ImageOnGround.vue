<template>
  <CesiumBaseView/>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "ImageOnGround",
  components: {CesiumBaseView},
  mounted() {
    let scene = window.viewer.scene
    var instance = new Cesium.GeometryInstance({
      geometry : new Cesium.RectangleGeometry({
        rectangle : Cesium.Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0),
        vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
      })
    });

    scene.primitives.add(new Cesium.Primitive({
      geometryInstances : instance,
      appearance : new Cesium.EllipsoidSurfaceAppearance({
        material : new Cesium.Material({
          fabric : {
            type : 'Image',
            uniforms : {
              image : 'favicon.ico'
            }
          }
        })
      })
    }));
  }
}
</script>

<style scoped>

</style>