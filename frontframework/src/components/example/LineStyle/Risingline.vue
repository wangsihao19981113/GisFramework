<template>
  <div>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>

<script>
import {addLineFlowMaterialType} from '../../../lib/MaterialProperty/lineFlowMaterialProperty'
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "RisingLine",
  components:{CesiumBaseView},
  mounted() {
    addLineFlowMaterialType();
    //中心点
    let position = [112,25]
    let pointlist = this.GenerateRandomPosition(position,10)
    let source = new Cesium.CustomDataSource()
    for(let i = 0 ; i < pointlist.length ; i++)
    {
      let entity = this.GetEntity({
        position:pointlist[i],
        height:5000,
        percent:0.6,
        speed:15,
        color:[1,1,0,0.8]
      })
      source.entities.add(entity)
    }
    window.viewer.dataSources.add(source);
    window.viewer.zoomTo(source);
  },
  methods:{
    GenerateRandomPosition(position, num){
      let list = []
      for (let i = 0; i < num; i++) {
        let lon = position[0] + Math.random() * 0.06 * (i % 2 == 0 ? 1 : -1);
        let lat = position[1] + Math.random() * 0.06 * (i % 2 == 0 ? 1 : -1);
        list.push([lon, lat])
      }
      return list
    },
    /*
      config = {
        color:[r,g,b,a]
        speed:速度
        height:高度
        percent:尾部长度
        position:[lat,lng]
      }
     */
    GetEntity(config){
      let start_lon = config.position[0];
      let start_lat = config.position[1];
      let startPoint = new Cesium.Cartesian3.fromDegrees(start_lon, start_lat, 0);
      let height = config.height;
      let endPoint = new Cesium.Cartesian3.fromDegrees(start_lon, start_lat, height);
      let linePositions = [];
      linePositions.push(startPoint);
      linePositions.push(endPoint);
      let Entity = new Cesium.Entity({
        polyline: {
          positions: linePositions,
          material: new Cesium.LineFlowMaterialProperty({
            color: new Cesium.Color(config.color[0], config.color[1], config.color[2], config.color[3]),
            speed: config.speed,
            percent: config.percent,
            gradient: 0.01
          })
        }
      })
      return Entity;
    }
  }
}
</script>

<style scoped>

</style>