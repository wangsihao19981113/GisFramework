<template>
  <div>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>

<script>
import {addLineFlowMaterialType} from '../../../lib/MaterialProperty/lineFlowMaterialProperty'
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "ParabolaLine",
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
        startPosition:position,
        endPosition:pointlist[i],
        height:5000,
        count:50})
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
        startPosition:[lat,lon]
        endPosition:[lat,lon]
        height:高度
        count:抛物数目
      }
     */
    GetEntity(config){
      let parabola = this.Parabola(config.startPosition,config.endPosition,config.height,config.count)
      let Entity = new Cesium.Entity({
          polyline: {
            positions: parabola,
            material: new Cesium.LineFlowMaterialProperty({
              color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
              speed: 15,
              percent: 1,
              gradient: 0.01
            })
          },
      })
      return Entity;
    },
    //生成抛物线,参考开源代码
    Parabola(startPosition, endPosition, height = 0, count = 50) {
        let result = []
        height = Math.max(+height, 100)
        count = Math.max(+count, 50)
        let diffLon = Math.abs(startPosition[0] - endPosition[0])
        let diffLat = Math.abs(startPosition[1] - endPosition[1])
        let L = Math.max(diffLon, diffLat)
        let dlt = L / count
        if (diffLon > diffLat) {
          //base on lon
          let delLat = (endPosition[1] - startPosition[1]) / count
          if (startPosition[0] - endPosition[0] > 0) {
            dlt = -dlt
          }
          for (let i = 0; i < count; i++) {
            let h =
                height -
                (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) /
                Math.pow(L, 2)
            let lon = startPosition[0] + dlt * i
            let lat = startPosition[1] + delLat * i
            let point = new Cesium.Cartesian3.fromDegrees(lon, lat, h);
            result.push(point);
          }
        } else {
          //base on lat
          let delLon = (endPosition[0] - startPosition[0]) / count
          if (startPosition[1] - endPosition[1] > 0) {
            dlt = -dlt
          }
          for (let i = 0; i < count; i++) {
            let h =
                height -
                (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) /
                Math.pow(L, 2)
            let lon = startPosition[0] + delLon * i
            let lat = startPosition[1] + dlt * i
            let point = new Cesium.Cartesian3.fromDegrees(lon, lat, h);
            result.push(point);
          }
        }
        return result
      }
  }
}
</script>

<style scoped>

</style>