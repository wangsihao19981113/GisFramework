<template>
  <div id="cesiumContainerBack" style="height: 100%;width: 100%">
    <div id="cesiumContainer"/>
  </div>
</template>

<script>
export default {
  mounted() {
    var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDg1ZWFmNS1mYWE4LTRmNTktYjE5MC1jM2M1MTQ5ZDVjZDkiLCJpZCI6MTI1ODYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0Mjk1NDl9.v4k0l7bOOcnU4qHEU-ddKnGBnKmRQFHMXYGOjPvayqE";
    Cesium.Ion.defaultAccessToken = token;
    var viewer = new Cesium.Viewer("cesiumContainer", {
      infoBox: false, //是否显示信息框
      selectionIndicator: false, //是否显示选取指示器组件
      scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      geocoder: false,   // 位置查找工具
      homeButton: false,  // 视角返回初始位置
      sceneModePicker: false,   // 选择视角的模式（球体、平铺、斜视平铺）
      baseLayerPicker: false,    // 图层选择器（地形影像服务）
      navigationHelpButton: false,   // 导航帮助(手势，鼠标)
      animation: false,   // 左下角仪表盘（动画器件）
      timeline: false,   // 底部时间线
      fullscreenButton: false,   // 全屏
      vrButton: false,  // VR
      shouldAnimate: true,
      credits: false,
      showRenderLoopErrors: true,
      // terrainExaggeration: 1,
      //天地图
      // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
      //   id:"tianditu",
      //   //http://t0.tianditu.gov.cn/vec_w
      //   url:"http://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=3936357f969edfea7547fda751cf1473",
      //   style: "default",
      //   format: "image/jpeg",
      // }),
      // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      //   url: 'http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer',
      // }),
      // imageryProvider: new Cesium.UrlTemplateImageryProvider({
      //   url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
      // }),
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url:
            "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/",
      }),
      //用于截屏
      contextOptions: {
        webgl:{
          alpha: true,
          depth:true,
          stencil:true,
          antialias:true,
          premultipliedAlpha:true,
          //通过canvas.toDataURL()实现截图需要将该项设置为true
          preserveDrawingBuffer:true,
          failIfMajorPerformanceCaveat:true
        }
      }
    });
    viewer.cesiumWidget.creditContainer.style.display = "none";
    let _3dtilesmodel = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json",
        })
    );
    viewer.zoomTo(_3dtilesmodel)
    window.viewer = viewer;
  },
}
</script>

<style scoped>

</style>