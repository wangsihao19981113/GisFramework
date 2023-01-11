<template>
  <CesiumBaseView/>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "LabelCollection",
  components: {CesiumBaseView},
  mounted() {
    let WFS_Service_Url = "http://localhost:8080/geoserver/wfs"
    let BaseConfigWFS = {
          service:"wfs",
          version:"1.0.0",
          outputFormat:"application/json"
    }
    let formData = BaseConfigWFS;
    formData["request"] = "GetFeature";
    formData["typeName"] = "cite:point5";
    let params = {
      "params":formData
    }
    let primitiveCollection = new Cesium.PrimitiveCollection();
    let labelCollection = new Cesium.LabelCollection();
    window.viewer.scene.primitives.add(primitiveCollection);
    primitiveCollection.add(labelCollection)
    viewer.camera.flyTo({
      destination : new Cesium.Cartesian3(-1970916.2392285925,5672354.868838107, 2148668.14359599),
      orientation : {
        heading : Cesium.Math.toRadians(0.0),
        pitch : Cesium.Math.toRadians(-90.0),//倾斜角度
        roll : 0.0
      },
      duration:0,//动画持续时间
      complete:()=>{//飞行结束之后执行的方法
      }
    });
    this.$axios.get(WFS_Service_Url,params).then(function (response) {
        console.log(response);
        let res = response.data
        if(res.features && res.features.length>0) {
          let promise = Cesium.GeoJsonDataSource.load(res,{
            stroke: Cesium.Color.HOTPINK,
            fill: Cesium.Color.PINK,
            strokeWidth: 3,
          });
          promise.then(function (dataSource){
            let entities = dataSource.entities.values;
            for (let i = 0; i < entities.length; i++) {
              if(entities[i].position._value) {
                labelCollection.add({
                  position: entities[i].position.getValue(),
                  text:entities[0].properties.integer.getValue() + "",
                  pixelOffset:new Cesium.Cartesian2(-27,0),
                  font:'25px sans-serif'
                })
                labelCollection.add({
                  position: entities[i].position.getValue(),
                  text:entities[0].properties.decimal.getValue() + "",
                  pixelOffset:new Cesium.Cartesian2(2,0),
                  font:'20px sans-serif'
                })
              }
            }
          })
        }
    }).catch(function (error) {
      console.log(error);
    });
  }
}
</script>

<style scoped>

</style>