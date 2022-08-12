<template>
  <el-upload
      drag
      class="fileChoice"
      :auto-upload=false
      :show-file-list="false"
      action=""
      :on-change="parsingShape"
  >
    <img type="file" src="/Image/Example/DataLoad/ShapeFileIcon.png" alt @click="parsingShape"/>
  </el-upload>
</template>

<script>
import * as shp from 'shpjs'

export default {
  name: "ShapeFile",
  methods:{
    parsingShape(files, fileList){
      let _self=this;
      if(fileList){
        this.file=fileList[fileList.length-1]
        const name=this.file.name
        const extension=name.split('.')[1]
        if('zip'!==extension){
          this.$message.warning(this.$t('common.message.isNotFile'));
        }else {
          debugger
          const reader= new FileReader()
          const  fileData=this.file.raw
          reader.readAsArrayBuffer(fileData)
          reader.onload = function(e){
            debugger
            shp(this.result).then(
                function(data){
                  console.log(data)
                }).catch(function(){
              _self.$message.warning(_self.$t('common.message.fileFormat'));
            });
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.fileChoice{
  position:absolute;
  left: 20px;
  top:50px;
}
</style>