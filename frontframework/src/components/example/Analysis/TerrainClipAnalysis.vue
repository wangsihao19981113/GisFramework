<template>
  <CesiumTerrianView/>
</template>

<script>
import CesiumTerrianView from "@/components/example/CesiumTerrianView";
export default {
  name: "TerrainClipAnalysis",
  components: {CesiumTerrianView},
  mounted() {
    this.viewer = window.viewer;
    var position = Cesium.Cartographic.toCartesian(
        new Cesium.Cartographic.fromDegrees(119.15, 27.8, 100)
    );
    var distance = -300.0; // 开挖距离
    var boundingSphere = new Cesium.BoundingSphere(position, distance);
    var clippingPlaneCollection = new Cesium.ClippingPlaneCollection({
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),
      planes: [
        new Cesium.ClippingPlane(
            new Cesium.Cartesian3(1.0, 0.0, 0.0),
            distance
        ),
        new Cesium.ClippingPlane(
            new Cesium.Cartesian3(-1.0, 0.0, 0.0),
            distance
        ),
        new Cesium.ClippingPlane(
            new Cesium.Cartesian3(0.0, 1.0, 0.0),
            distance
        ),
        new Cesium.ClippingPlane(
            new Cesium.Cartesian3(0.0, -1.0, 0.0),
            distance
        ),
      ],
      edgeWidth: 0.0,
      edgeColor: Cesium.Color.WHITE,
    });
    this.viewer.scene.globe.clippingPlanes = clippingPlaneCollection;
    this.viewer.camera.viewBoundingSphere(
        boundingSphere,
        new Cesium.HeadingPitchRange(0.5, 1.0, boundingSphere.radius * 5.0)
    );
    this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }
}
</script>

<style scoped>

</style>