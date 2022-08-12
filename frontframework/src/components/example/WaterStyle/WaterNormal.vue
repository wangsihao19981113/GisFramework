<template>
  <div>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import {addwater} from "@/lib/WaterMaterialProperty/Ocean";
export default {
  name: "WaterNormal",
  components:{CesiumBaseView},
  mounted() {
    var promise =Cesium.GeoJsonDataSource.load("/geojson/ChinaRiver.geojson");
    promise.then(function(dataSource){
      var entities = dataSource.entities.values;
      let geometry = []
      for (let i = 0; i < entities.length; i++) {

        let entity = entities[i];
        geometry.push(new Cesium.PolygonGeometry({
          polygonHierarchy : entity.polygon.hierarchy._value,
          //extrudedHeight: 0,//注释掉此属性可以只显示水面
          //perPositionHeight : true//注释掉此属性水面就贴地了
        }))
      }
      addwater(window.viewer,geometry)
    });
    viewer.camera.flyTo({
      destination : Cesium.Cartesian3.fromDegrees(116.5,29,300000),
      orientation : {
        heading : Cesium.Math.toRadians(0.0),
        pitch : Cesium.Math.toRadians(-90.0),//倾斜角度
        roll : 0.0
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