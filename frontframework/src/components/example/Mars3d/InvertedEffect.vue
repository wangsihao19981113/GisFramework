<template>
  <div>
<!--    <link href="https://cdn.jsdelivr.net/npm/mars3d-cesium/Build/Cesium/Widgets/widgets.css" rel="stylesheet" type="text/css"/>-->
<!--    <script src="https://cdn.jsdelivr.net/npm/mars3d-cesium/Build/Cesium/Cesium.js" type="text/javascript"></script>-->
<!--    <linkh ref="https://cdn.jsdelivr.net/npm/mars3d/dist/mars3d.css" rel="stylesheet" type="text/css"/>-->
<!--    <script src="https://cdn.jsdelivr.net/npm/mars3d/dist/mars3d.js" type="text/javascript"></script>-->
    <div id="mars3dContainer" class="mars3d-container"></div>
  </div>
</template>

<script>
//非常卡基本报废
//需要引入mars3d
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "InvertedEffect",
  components: {CesiumBaseView},
  mounted() {
    var mapp // mars3d.Map三维地图对象

    var mapp = new mars3d.Map("mars3dContainer", {
      scene: {
        center: { lat: 30.054604, lng: 108.885436, alt: 17036414, heading: 0, pitch: -90 },
        showSun: true,
        showMoon: true,
        showSkyBox: true,
        showSkyAtmosphere: false, // 关闭球周边的白色轮廓 map.scene.skyAtmosphere = false
        fog: true,
        fxaa: true,
        globe: {
          showGroundAtmosphere: false, // 关闭大气（球表面白蒙蒙的效果）
          depthTestAgainstTerrain: false,
          baseColor: "#546a53"
        },
        cameraController: {
          zoomFactor: 3.0,
          minimumZoomDistance: 1,
          maximumZoomDistance: 50000000,
          enableRotate: true,
          enableZoom: true
        }
      },
      control: {
        baseLayerPicker: true, // basemaps底图切换按钮
        homeButton: true, // 视角复位按钮
        sceneModePicker: true, // 二三维切换按钮
        navigationHelpButton: true, // 帮助按钮
        fullscreenButton: true, // 全屏按钮
        contextmenu: { hasDefault: true } // 右键菜单
      },
      terrain: {
        url: "//data.mars3d.cn/terrain",
        show: true
      },
      basemaps: [
        {
          name: "天地图影像",
          icon: "img/basemaps/tdt_img.png",
          type: "tdt",
          layer: "img_d",
          show: true
        }
      ]
    })


    function onMounted(mapInstance) {
      let map = mapInstance // 记录map
      // 添加参考三维模型
      const tiles3dLayer = new mars3d.layer.TilesetLayer({
        url: "/3dtiles/building/tileset.json",
        position: { alt: 80.6 },
        maximumScreenSpaceError: 1,
        maximumMemoryUsage: 1024,
        dynamicScreenSpaceError: true,
        cullWithChildrenBounds: false
      })
      map.addLayer(tiles3dLayer)

      // 倒影效果
      const invertedEffect = new mars3d.effect.InvertedEffect()
      map.addEffect(invertedEffect)
    }

    onMounted(mapp)


  }
}
</script>

<style scoped>

</style>