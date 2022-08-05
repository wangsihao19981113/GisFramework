<template>
  <div class="tool-bar">
    <el-button icon="el-icon-printer" @click="PrintMap($event)"></el-button>
    <el-button icon="el-icon-printer" @click="OpenImportDataView($event)"></el-button>
  </div>
</template>

<script>
import PrintMap from '../../lib/PrintMap'
export default {
  name: "ToolBar",
  mounted() {

  },
  methods:{
    PrintMap(){
      PrintMap.printMap(window.viewer)
    },
    OpenImportDataView(){
      this.$parent.$refs.ImportDataView.IsShowView = true;
    }
  }
}
</script>

<style scoped>
.tool-bar{
  position:absolute;
  top:70px;
  left:80%;
  z-index: 1;
}
</style>