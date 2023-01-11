<template>
  <div>
    <div style="position:absolute;z-index: 1000">
      <el-button @click="measureArea">面积</el-button>
      <el-button @click="measureLength">距离</el-button>
      <el-button @click="measureHeight">高度</el-button>
      <el-button @click="measureAreaGround">贴地面积</el-button>
      <el-button @click="measureLengthGround">贴地高度</el-button>
      <el-button @click="clear">清除</el-button>
    </div>
    <CesiumTerrianView/>
  </div>
</template>

<script>
import Measure from "../../../lib/Measure/measureNew"
import CesiumTerrianView from "@/components/example/CesiumTerrianView";
export default {
  name: "MeasureTool",
  components: {CesiumTerrianView},
  mounted() {
    this.measure = new Measure({viewer:window.viewer});
  },
  methods:{
    measureArea(){
      this.measure.measureArea();
    },
    measureLength(){
      this.measure.measureLine();
    },
    measureHeight(){
      this.measure.measureHeight();
    },
    measureAreaGround(){
      this.measure.measureAreaGround();
    },
    measureLengthGround(){
      this.measure.measureLineGround();
    },
    clear(){
      this.measure.clearResult()
    }
  }
}
</script>

<style scoped>

</style>