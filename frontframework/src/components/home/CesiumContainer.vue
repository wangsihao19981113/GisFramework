<template>
  <div id="cesiumContainerBack" style="height: 100%;width: 100%">
    <div id="cesiumContainer"/>
  </div>
</template>

<script>
let IconOnGround = require('../../lib/IconOnGround')
import WallDiffuseMaterialProperty from "@/lib/MaterialProperty/WallDiffuseMaterialProperty";

export default {
  name: "CesiumContainer",

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
      imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        url:"http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=3936357f969edfea7547fda751cf1473",
        layer: "tdtImgLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
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
    viewer.cesiumWidget.creditContainer.style.display = "none"
    window.viewer = viewer;
    WallDiffuseMaterialProperty.addWallDiffuseMaterial();
    viewer.entities.add({
      name: "立体墙效果",
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          -107.0,
          43.0,
          100000.0,
          -97.0,
          43.0,
          100000.0,
          -97.0,
          40.0,
          100000.0,
          -107.0,
          40.0,
          100000.0,
          -107.0,
          43.0,
          100000.0,
        ]),
        // 扩散墙材质
        material: new Cesium.WallDiffuseMaterialProperty({
          color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
        }),
      }
    });


    var data = {
        lon:112,
        lat:23,
        r:50000,
        scanColor:new Cesium.Color(0.0, 1.0, 0.0, 1),
        interval:3000,
    }

    //ScanPostStage.addCircleScan(viewer,data)


    var instance = new Cesium.GeometryInstance({
      geometry : new Cesium.RectangleGeometry({
        rectangle : Cesium.Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0),
        vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
      })
    });


    viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances : instance,
      appearance : new Cesium.EllipsoidSurfaceAppearance({
        material : Cesium.Material.fromType('Stripe')
      })
    }));



    let imageryProvider = new Cesium.WebMapServiceImageryProvider({
      url : 'http://127.0.0.1:8080/geoserver/cite/wms',
      layers : 'cite:waterdeepline30_4326',
      // srs:"EPSG:3857",
      // tilingScheme:new Cesium.WebMercatorTilingScheme(),
      parameters: {
        service : 'WMS',
        format: 'image/png',
        transparent: true,
      }
    })


    // let imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
    //   url:"http://localhost:8080/geoserver/gwc/service/wmts/rest/cite:waterdeepline30/{style}/{TileMatrixSet}/{TileMatrixSet}:{TileMatrix}/{TileRow}/{TileCol}?format=image/png",
    //   layer: "cite:waterdeepline30",
    //   style: "line",
    //   format: "image/png",
    //   tileMatrixSetID:"EPSG:4326",
    //   maximumLevel: 20
    // })

    let layer = viewer.imageryLayers.addImageryProvider(imageryProvider)


    let imageryProvider1 = new Cesium.WebMapServiceImageryProvider({
      url : 'http://127.0.0.1:8080/geoserver/cite/wms',
      layers : 'cite:point5',
      // srs:"EPSG:3857",
      // tilingScheme:new Cesium.WebMercatorTilingScheme(),
      parameters: {
        service : 'WMS',
        format: 'image/png',
        transparent: true,
      }
    })

    viewer.imageryLayers.addImageryProvider(imageryProvider1)



    // var IconOnGroundConfig = {
    //   lng:112.5,lat:23,size:33000, rotation:30 ,image:window.location.origin+"/WeatherImage/snow.png"
    // }
    // var iconOnGround = new IconOnGround(IconOnGroundConfig)
    // var entity = iconOnGround.show(viewer);

    // var configsnow = {
    //   lat:23,
    //   lng:112.5,
    //   height:10000,
    //   width:100000,
    //   size:12,
    //   speed:[-300,-30],
    //   emissionRate:200
    // }
    // var snow = new Snow(viewer,configsnow);
    // snow.startSnow();


    // viewer.camera.flyTo(
    //     {
    //       destination:Cesium.Cartesian3.fromDegrees(112.5,23,0),
    //       orientation:{
    //         heading:Cesium.Math.toRadians(0,0),
    //         pitch:Cesium.Math.toRadians(-25,0),
    //         roll:0.0,
    //       }
    //     }
    // )
  }
}
</script>

<style scoped>
#cesiumContainerBack{
  position:absolute;
}
</style>