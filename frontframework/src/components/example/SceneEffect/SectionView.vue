<template>
  <div>
    <div style="position:absolute;z-index: 100">
      <el-button @click="start">开始</el-button>
      <el-button>清除</el-button>
    </div>
    <CesiumBaseView/>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import SectionAnalysis from "@/lib/SectionAnalysis/SectionAnalysis";
export default {
  name: "SectionView",
  components: {CesiumBaseView},
  mounted() {
    this.tileset = window.viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json",
        })
    );

  },
  methods:{
    start(){
      let sa = new SectionAnalysis(window.viewer,this.tileset)
      sa.startAnalysis()
    },
    loadTileset(url) {
      let viewer = window.viewer;
      let scene = viewer.scene;
      let targetY = 0.0;
      let viewModel = {
        debugBoundingVolumesEnabled: false,
        edgeStylingEnabled: true,
      };

      let downHandler = new Cesium.ScreenSpaceEventHandler(
          viewer.scene.canvas
      );
      let selectedPlane;
      downHandler.setInputAction(function (movement) {
        const pickedObject = scene.pick(movement.position);
        if (
            Cesium.defined(pickedObject) &&
            Cesium.defined(pickedObject.id) &&
            Cesium.defined(pickedObject.id.plane)
        ) {
          selectedPlane = pickedObject.id.plane;
          selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05);
          selectedPlane.outlineColor = Cesium.Color.RED;
          scene.screenSpaceCameraController.enableInputs = false;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      let upHandler = new Cesium.ScreenSpaceEventHandler(
          viewer.scene.canvas
      );
      upHandler.setInputAction(function () {
        if (Cesium.defined(selectedPlane)) {
          selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
          selectedPlane.outlineColor = Cesium.Color.RED;
          selectedPlane = undefined;
        }

        scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      let moveHandler = new Cesium.ScreenSpaceEventHandler(
          viewer.scene.canvas
      );
      moveHandler.setInputAction(function (movement) {
        if (Cesium.defined(selectedPlane)) {
          const deltaY = movement.startPosition.y - movement.endPosition.y;
          targetY += deltaY;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      function createPlaneUpdateFunction(plane) {
        return function () {
          plane.distance = targetY;
          return plane;
        };
      }


      let clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [
          new Cesium.ClippingPlane(
              new Cesium.Cartesian3(0.0, 0.0, -1.0),
              0.0
          ),
        ],
        edgeWidth: viewModel.edgeStylingEnabled ? 1.0 : 0.0,
      });

      let tileset = viewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({
            url: url,
          })
      );

      tileset.clippingPlanes = clippingPlanes;

      tileset.debugShowBoundingVolume =
          viewModel.debugBoundingVolumesEnabled;
      return tileset.readyPromise
          .then(function () {
            const boundingSphere = tileset.boundingSphere;
            const radius = boundingSphere.radius;

            viewer.zoomTo(
                tileset,
                new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4.0)
            );

            if (
                !Cesium.Matrix4.equals(
                    tileset.root.transform,
                    Cesium.Matrix4.IDENTITY
                )
            ) {
              // The clipping plane is initially positioned at the tileset's root transform.
              // Apply an additional matrix to center the clipping plane on the bounding sphere center.
              const transformCenter = Cesium.Matrix4.getTranslation(
                  tileset.root.transform,
                  new Cesium.Cartesian3()
              );
              const transformCartographic = Cesium.Cartographic.fromCartesian(
                  transformCenter
              );
              const boundingSphereCartographic = Cesium.Cartographic.fromCartesian(
                  tileset.boundingSphere.center
              );
              const height =
                  boundingSphereCartographic.height -
                  transformCartographic.height;
              clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(
                  new Cesium.Cartesian3(0.0, 0.0, height)
              );
            }

            for (let i = 0; i < clippingPlanes.length; ++i) {
              const plane = clippingPlanes.get(i);
              const planeEntity = viewer.entities.add({
                position: boundingSphere.center,
                plane: {
                  dimensions: new Cesium.Cartesian2(
                      radius * 2.5,
                      radius * 2.5
                  ),
                  material: Cesium.Color.WHITE.withAlpha(0.1),
                  plane: new Cesium.CallbackProperty(
                      createPlaneUpdateFunction(plane),
                      false
                  ),
                  outline: true,
                  outlineColor: Cesium.Color.RED,
                },
              });
            }
            return tileset;
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
}
</script>

<style scoped>

</style>