<template>
  <div>
    <div style="position:absolute;z-index: 100">
      <el-button @click="addPointBuffer">添加点缓冲</el-button>
      <el-button @click="removePointBuffer">去除点缓冲</el-button>
      <el-button @click="addPolylineBuffer">添加线缓冲</el-button>
      <el-button @click="removePolylineBuffer">去除线缓冲</el-button>
      <el-button @click="addPolygonBuffer">添加面缓冲</el-button>
      <el-button @click="removePolygonBuffer">去除面缓冲</el-button>
    </div>
    <CesiumBaseView/>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import BufferAnalysis from "@/lib/BufferAnalysis/BufferAnalysis";
const point = [106.422638966289, 29.5698367125623];
const polyline = [
  [106.425203158107, 29.5694914480581],
  [106.428808047023, 29.569230166027],
  [106.431661917416, 29.5692674920729],
  [106.434708906857, 29.5693048181049]
];
const polygon = [
  [106.438549830166, 29.5701073244566],
  [106.440695597377, 29.5701073244566],
  [106.440738512722, 29.5688755679036],
  [106.438700033871, 29.5687262630581],
  [106.438034846035, 29.5690248725284],
  [106.438549830166, 29.5701073244566]
];
export default {
  name: "BufferAnalysis",
  components: {CesiumBaseView},
  data(){
    return{
      pointBuffer:null,
      polygonBuffer:null,
      polylineBuffer:null,
    }
  },
  mounted() {
    let viewer = window.viewer
    this.BufferAnlysis = new BufferAnalysis(viewer);
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(point[0], point[1], 0),
      point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW,
        outlineWidth: 3,
        outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
      }
    });
    viewer.entities.add({
      polyline: {
        positions:Cesium.Cartesian3.fromDegreesArray(this.pointsToDegreesArray(polyline)),
        width: 2,
        material: Cesium.Color.YELLOW,
      }
    })
    viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(this.pointsToDegreesArray(polygon))),
        material: Cesium.Color.YELLOW.withAlpha(0.6),
        classificationType: Cesium.ClassificationType.BOTH
      },
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(this.pointsToDegreesArray(polygon)),
        width: 2,
        material: Cesium.Color.YELLOW.withAlpha(0.4),
      }
    });
    viewer.zoomTo(viewer.entities)
  },
  methods:{
    addPointBuffer(){
      if(!this.pointBuffer){
        this.pointBuffer = this.BufferAnlysis.addPointBuffer(point,60)
      }
    },
    removePointBuffer(){
      if(this.pointBuffer){
        this.BufferAnlysis.removeBufferPolygon(this.pointBuffer)
        this.pointBuffer = null
      }
    },
    addPolylineBuffer(){
      if(!this.polylineBuffer){
        this.polylineBuffer = this.BufferAnlysis.addPolylineBuffer(polyline,30)
      }
    },
    removePolylineBuffer(){
      debugger
      if(this.polylineBuffer){
        this.BufferAnlysis.removeBufferPolygon(this.polylineBuffer)
        this.polylineBuffer = null
      }
    },
    addPolygonBuffer(){
      if(!this.polygonBuffer){
        this.polygonBuffer = this.BufferAnlysis.addPolygonBuffer(polygon,60)
      }
    },
    removePolygonBuffer(){
      if(this.polygonBuffer){
        this.BufferAnlysis.removeBufferPolygon(this.polygonBuffer)
        this.polygonBuffer = null
      }
    },
    pointsToDegreesArray(points) {
      let degreesArray = [];
      points.map(item => {
        degreesArray.push(item[0]);
        degreesArray.push(item[1]);
      });
      return degreesArray;
    }
  }
}
</script>

<style scoped>

</style>