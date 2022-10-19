<template>
  <div>
    <CesiumBaseView></CesiumBaseView>
    <el-button size="small" type="primary" class="ShapeAnalysis" @click="parsingShape">解析</el-button>
    <el-button size="small" type="primary" class="location" @click="locationShape">定位</el-button>
    <el-upload
        class="upload-demo uploadShape"
        action="#"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :http-request="handleUpload"
        :on-change="handleOnChange"
        multiple
        :limit="2"
        :file-list="FileList"
        :on-exceed="handleExceed">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">请上传的shp和dbf文件</div>
    </el-upload>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
let shapefile = require("shapefile")

export default {
  name: "ShapeFile",
  components: {CesiumBaseView},
  data(){
    return{
      FileList:[],
      ShapeCollection:null,
    }
  },
  methods:{
    handleOnChange(file,fileList){
      this.FileList = fileList
      console.log(file, fileList);
    },
    handleRemove(file, fileList) {
      this.FileList = fileList
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleUpload(){

    },
    beforeRemove(file) {
      console.log(file);
    },
    locationShape(){
      if(this.ShapeCollection){
        window.viewer.flyTo(this.ShapeCollection.entities);
      }
    },
    parsingShape(){
      let self = this
      if(!this.ShapeCollection){
        this.ShapeCollection = new Cesium.CustomDataSource("shapeUpload");
        window.viewer.dataSources.add(this.ShapeCollection);
      }
      this.ShapeCollection.entities.removeAll();
      let fileList = this.FileList;
      let fileshp = null;
      let filedbf = null;
      if(fileList){
        for(let i = 0 ; i < fileList.length ; i++)
        {
          let name = fileList[i].name
          if(name.substring(name.lastIndexOf(".")+1) == "shp")
          {
            if(!fileshp) {
              fileshp = fileList[i]
            }
            else{
              this.$message.warning("仅支持上传一个shp文件")
              return
            }
          }
          if(name.substring(name.lastIndexOf(".")+1) == "dbf")
          {
            filedbf = fileList[i]
          }
        }
        this.file=fileList[fileList.length-1]
        const reader = new FileReader()
        if(fileshp) {
          reader.readAsArrayBuffer(fileshp.raw)
        }
        else{
          this.$message.warning("没有上传shp格式文件")
          return
        }
        reader.onload = function({ target: { result: A } }){
          if(filedbf) {
            reader.readAsArrayBuffer(filedbf.raw);
            reader.onload = ({target: {result: B}}) => {
              shapefile.open(A, B).then(
                  source => source.read()
                      .then(function log(result) {
                        if (result.done) return;
                        addEntityToShapeCollection(result.value);
                        return source.read().then(log);
                      }))
                  .catch(error => console.error(error.stack));
            }
          }else{
            shapefile.open(A).then(
                source => source.read()
                    .then(function log(result) {
                      if (result.done) return;
                      addEntityToShapeCollection(result.value);
                      return source.read().then(log);
                    }))
                .catch(error => console.error(error.stack));
          }
        }
      }
      function addEntityToShapeCollection(geojson){
        if(self.ShapeCollection){
          let promise = Cesium.GeoJsonDataSource.load(geojson);
          promise.then(function(dataSource){
            var entities = dataSource.entities.values;
            let geometry = []
            for (let i = 0; i < entities.length; i++) {
              self.ShapeCollection.entities.add(entities[i])
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.ShapeAnalysis{
  position: absolute;
  top: 7px;
  left: 100px;
  z-index: 11;
}

.uploadShape{
  position: absolute;
  width: 300px;
  height: 125px;
  background: white;
  left: 5px;
  top: 5px;
  border-radius: 5px;
  padding: 2px;
}

.location{
  position: absolute;
  top: 7px;
  left: 160px;
  z-index: 11;
}
</style>