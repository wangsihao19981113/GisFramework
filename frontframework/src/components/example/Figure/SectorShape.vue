<template>
  <div>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
let EllipsoidFadeMaterial = require('../../../lib/MaterialProperty/EllipsoidFadeMaterialProperty');
EllipsoidFadeMaterial.addEllipsoidFadeMaterial();
export default {
  name: "SectorShape",
  components: {CesiumBaseView},
  mounted() {
    let ShoreBasedRadarCollection = null
    let points = [];
    let radius = 17100;
    let olon = 110.4831614;
    let olat = 20.560002;
    for(let i=60; i<107; i+=0.01){
      let trackpoint = getPoint(olon,olat,radius,i);
      points.push(trackpoint[0],trackpoint[1]);
    }
    points.push(olon,olat);
    ShoreBasedRadarCollection = new Cesium.CustomDataSource();
    ShoreBasedRadarCollection.entities.add({
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(
            points
        ),
        material:new Cesium.Color(0.0, 0.0, 1.0, 0.8),
      },
    })
    ShoreBasedRadarCollection.entities.add({
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(
            points
        ),
        material:new Cesium.EllipsoidFadeMaterialProperty(Cesium.Color.RED, 3000)
      },
    })
    window.viewer.dataSources.add(ShoreBasedRadarCollection);
    viewer.camera.flyTo({
      destination : Cesium.Cartesian3.fromDegrees(110.4831614,20.560002,200000),
      orientation : {
        heading : Cesium.Math.toRadians(0.0),
        pitch : Cesium.Math.toRadians(-90.0),//倾斜角度
        roll : 0.0
      },
      duration:0,//动画持续时间
      complete:()=>{//飞行结束之后执行的方法
      }
    });
    function getPoint(olon, olat, radius, angle ){
      let clon = radius * Math.sin(angle*Math.PI/180);
      let clat = radius * Math.cos(angle*Math.PI/180);
      let ec = 6356725 + (6378137 - 6356725) * (90 - olat) / 90;
      let ed = ec * Math.cos(olat * Math.PI /180);
      let jlon = (clon/ed + olon * Math.PI/180)*180/Math.PI;
      let jlat = (clat/ec + olat * Math.PI/180)*180/Math.PI;
      return [jlon,jlat];
    }
  }
}
</script>

<style scoped>

</style>