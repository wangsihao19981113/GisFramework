<template>
  <div>
    <el-button style="position: absolute;z-index: 10;top: 50px;left: 10px" @click="Change2D">2D</el-button>
    <el-button style="position: absolute;z-index: 10;top: 50px;left: 70px" @click="Change3D()">3D</el-button>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>

<script>
import {PieEntity2D,PieEntity3D} from '../../../lib/StatisticalEntity/PieEntity'
import CesiumBaseView from "@/components/example/CesiumBaseView";
let config3D = {
  data:[
    { value: 1048, name: 'Search Engine', itemStyle: { color: '#ffff00' },label:{height:56000}},
    { value: 735, name: 'Direct', itemStyle: { color: '#91cc75' },label:{height:56000}},
    { value: 580, name: 'Email', itemStyle: { color: '#fac858' },label:{height:56000}},
    { value: 484, name: 'Union Ads', itemStyle: { color: '#ee6666' },label:{height:56000}},
    { value: 300, name: 'Video Ads', itemStyle: { color:  '#3ba272' },label:{height:56000}}
  ],
  labelShow:true,
  radius: 100000,
  height:50000,
  centerPoint:[112, 23]
}

let config2D = {
  data:[
    { value: 1048, name: 'Search Engine', itemStyle: { color: '#ffff00' } },
    { value: 735, name: 'Direct', itemStyle: { color: '#91cc75' } },
    { value: 580, name: 'Email', itemStyle: { color: '#fac858' } },
    { value: 484, name: 'Union Ads', itemStyle: { color: '#ee6666' } },
    { value: 300, name: 'Video Ads', itemStyle: { color:  '#3ba272' } }
  ],
  labelShow:true,
  chartDomWidth:400,
  chartDomHeight:400,
  radius: 100000,
  centerPoint:[112, 23]
}

export default {
  name: "PieChart",
  components:{CesiumBaseView},
  data(){
    return{
      _3DPie:null,
      _2DPie:null,
    }
  },
  mounted() {
    this._3DPie = PieEntity3D(config3D,window.viewer);
  },
  methods:{
    Change2D(){
      if(this._3DPie)
      {
        window.viewer.dataSources.remove(this._3DPie)
        this._3DPie = null;
      }
      if(!this._2DPie) {
        var self = this;
        PieEntity2D(config2D, window.viewer,function (primitive){
          self._2DPie = primitive
        });
      }
    },
    Change3D(){
      if(this._2DPie)
      {
        window.viewer.scene.primitives.remove(this._2DPie)
        this._2DPie = null;
      }
      if(!this._3DPie) {
        this._3DPie = PieEntity3D(config3D, window.viewer);
      }
    }
  }
}
</script>

<style scoped>

</style>