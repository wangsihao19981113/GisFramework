<template>
  <div>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import WaterPrimitive from "@/lib/Primitive/WaterPrimitive";
export default {
  name: "WaterNormal",
  components:{CesiumBaseView},
  mounted() {
    var promise =Cesium.GeoJsonDataSource.load("/geojson/HY.geojson");
    promise.then(function(dataSource){
      var entities = dataSource.entities.values;
      let geometry = []
      for (let i = 0; i < entities.length; i++){
        let positions = dataSource.entities.values[i].polygon.hierarchy._value.positions
        positions.push(positions[0])
        for(let j = 0 ; j < positions.length ; j++){
          positions[j] =  Cesium.Cartographic.fromCartesian(positions[j])
        }
        const aaa = new WaterPrimitive({
          scene: window.viewer.scene,
          positions: positions,
          height: 0,
          rippleSize: 100,
        });
        const waterParams = {
          波纹大小: 2000.0,
          透明度: 0.5,
          反射率: 0.7,
          扭曲: 3.7,
          高度: 0,
        };
        aaa.rippleSize = waterParams["波纹大小"];
        aaa.waterAlpha = waterParams["透明度"];
        aaa.reflectivity = waterParams["反射率"];
        aaa.distortionScale = waterParams["扭曲"];
        aaa.height = waterParams["高度"];
      }

      // for (let i = 0; i < entities.length; i++) {
      //     let entity = entities[i];
      //     geometry.push(new Cesium.PolygonGeometry({
      //         polygonHierarchy : entity.polygon.hierarchy._value,
      //         height:-1
      //         //extrudedHeight: 0,//注释掉此属性可以只显示水面
      //         //perPositionHeight : true//注释掉此属性水面就贴地了
      //     }))
      // }
      // let polygons = geometry;
      // let polygonPrimitive = [];
      // for(let i = 0 ; i < polygons.length ; i++) {
      //     let polygon = polygons[i];
      //     polygonPrimitive.push(
      //         new Cesium.GeometryInstance({
      //             geometry: polygon,
      //         })
      //     )
      // }
      // WaterCollection = new Cesium.Primitive({
      //     geometryInstances: polygonPrimitive,
      //     appearance: new Cesium.EllipsoidSurfaceAppearance({
      //         material: watermaterial
      //     }),
      // })
      // window.app.viewer.scene.primitives.add(WaterCollection);
    });
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
