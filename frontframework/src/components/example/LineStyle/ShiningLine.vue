<template>
  <div>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>

<script>
import {addLineShineMaterialType} from '../../../lib/MaterialProperty/lineFlowMaterialProperty'
import CesiumBaseView from "@/components/example/CesiumBaseView";
export default {
  name: "RisingLine",
  components:{CesiumBaseView},
  mounted() {
    addLineShineMaterialType();
    //中心点
    let pointarray1 = [113.929452, 22.522613, 113.93064, 22.52232, 113.931544, 22.522096, 113.932354, 22.521895, 113.933027, 22.521754, 113.933525, 22.521665, 113.934116, 22.521601, 113.934871, 22.521546, 113.935828, 22.521521, 113.936245, 22.52151, 113.942148, 22.521394, 113.945637, 22.521315, 113.947965, 22.521277, 113.949312, 22.521259, 113.949675, 22.521245, 113.950065, 22.521224, 113.950374, 22.521202, 113.951446, 22.521115, 113.953169, 22.520934]
    let pointarray2 = [113.953197, 22.521119, 113.951326, 22.521319, 113.950897, 22.521362, 113.950557, 22.521394, 113.950143, 22.521422, 113.949734, 22.521444, 113.949401, 22.521459, 113.949118, 22.521468, 113.93968, 22.5217, 113.93816, 22.521669, 113.936894, 22.521685, 113.934877, 22.52171, 113.934106, 22.521729, 113.933544, 22.521774, 113.933022, 22.521865, 113.932378, 22.521998, 113.931686, 22.522166, 113.929433, 22.522711]
    let source = new Cesium.CustomDataSource()
    var entity1 = this.GetEntity({
      pointarray:pointarray1,
      image:'/Image/Example/LineStyle/spriteline3.png',
      duration:1000,
    })
    var entity2 = this.GetEntity({
      pointarray:pointarray2,
      image:'/Image/Example/LineStyle/spriteline1.png',
      duration:1000,
    })
    source.entities.add(entity1);
    source.entities.add(entity2);
    window.viewer.dataSources.add(source);
    window.viewer.zoomTo(source);
  },
  methods:{
    /*
      config = {
        pointarray:[lat1,lng1,lat2,lng2]
        image:材质图片
        duration:持续时间
      }
     */
    GetEntity(config){
      let Entity = new Cesium.Entity({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(config.pointarray),
          width: 2,
          material: new Cesium.LineShineMaterialProperty(config.duration, config.image)
        }
      })
      return Entity;
    }
  }
}
</script>

<style scoped>

</style>