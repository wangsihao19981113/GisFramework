<template>
  <div>
    <CesiumBaseView></CesiumBaseView>
    <el-upload
        class="upload-demo uploadShape"
        action="#"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :http-request="handleUpload"
        :on-change="handleOnChange"
        multiple
        :limit="1"
        :file-list="FileList"
        :on-exceed="handleExceed">
      <el-button size="small" type="primary">点击上传</el-button>
      <el-button size="small" type="primary" @click="parsingZip">解析</el-button>
      <el-button size="small" type="primary" @click="locationShape">定位</el-button>
      <el-button size="small" type="primary" @click="download">下载</el-button>
      <div slot="tip" class="el-upload__tip">请上传zip文件</div>
    </el-upload>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import * as shpjs from 'shpjs/dist/shp.min.js'
let shapefile = require("shapefile")
let shpwrite = require('shp-write/shpwrite')
import { saveAs } from 'file-saver';
export default {
  name: "ShapeFile",
  components: {CesiumBaseView},
  data(){
    return{
      FileList:[],
      geojson:null,
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
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleUpload(form){
      let file = form.file;
    },
    beforeRemove(file) {
      console.log(file);
    },
    locationShape(){
      if(this.ShapeCollection){
        window.viewer.flyTo(this.ShapeCollection.entities);
      }
    },
    convertBase64ToBlob(imageEditorBase64) {
      var base64Arr = imageEditorBase64.split(",");
      var imgtype = "";
      var base64String = "";
      if (base64Arr.length > 1) {
        //如果是图片base64，去掉头信息
        base64String = base64Arr[1];
        imgtype = base64Arr[0].substring(
            base64Arr[0].indexOf(":") + 1,
            base64Arr[0].indexOf(";")
        );
      }
      // 将base64解码
      var bytes = atob(base64String);
      //var bytes = base64;
      var bytesCode = new ArrayBuffer(bytes.length);
      // 转换为类型化数组
      var byteArray = new Uint8Array(bytesCode);

      // 将base64转换为ascii码
      for (var i = 0; i < bytes.length; i++) {
        byteArray[i] = bytes.charCodeAt(i);
      }

      // 生成Blob对象（文件对象）
      return new Blob([bytesCode], { type: imgtype });
    },
    download(){
      let self = this;
      if(this.geojson){
        //shpwrite.download({type:this.geojson.type,features:this.geojson.features})
        var options = {
          folder: 'myshapes',
          types: {
            point: 'mypoints',
            polygon: 'mypolygons',
            line: 'mylines'
          }
        }
        // let features = this.geojson.features
        // let prop = features[0].properties
        // let a = {}
        // for(let key in features[0].properties){
        //   a[key] = true;
        // }
        // let b = JSON.parse(JSON.stringify(a))
        // for(let i = 0 ; i < this.geojson.features.length ; i++){
        //   a = JSON.parse(JSON.stringify(b));
        //   for(let key1 in features[i].properties){
        //     for(let key2 in a){
        //       if(key1==key2){
        //         a[key2] = false
        //       }
        //     }
        //   }
        //   for(let key3 in a){
        //     if(a[key3]){
        //       console.log(i)
        //     }
        //   }
        // }
        // // this.geojson = {
        // //   type: 'FeatureCollection',
        // //   features: [this.geojson.features[0]]
        // // }
        this.geojson = JSON.parse(JSON.stringify(this.geojson))
        shpwrite.zip(this.geojson,options).then(function(content) {
          let blob = self.convertBase64ToBlob('data:application/zip;base64,' + content)
          saveAs(blob, 'export.zip');
        });
      }
    },
    //解析zip
    parsingZip(){
      let self = this;
      let file = this.FileList[0].raw
      if(!file){return}
      let reader = new FileReader();
      reader.readAsArrayBuffer(file)
      reader.onload = function(e) {
          let res = e.target.result;//ArrayBuffer
          shpjs.parseZip(res).then(function (res){
            self.addEntityToShapeCollection(res)
            self.geojson = res
          }).catch(function (e){
            console.log(e)
          })
      }
    },
    //解析shp和dbf
    parsingShape(){
      let self = this
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
                        self.addEntityToShapeCollection(result.value);
                        return source.read().then(log);
                      }))
                  .catch(error => console.error(error.stack));
            }
          }else{
            shapefile.open(A).then(
                source => source.read()
                    .then(function log(result) {
                      if (result.done) return;
                      self.addEntityToShapeCollection(result.value);
                      return source.read().then(log);
                    }))
                .catch(error => console.error(error.stack));
          }
        }
      }
    },
    //展示要素
    addEntityToShapeCollection(geojson){
      let self = this;
      if(!this.ShapeCollection){
        this.ShapeCollection = new Cesium.CustomDataSource("shapeUpload");
        window.viewer.dataSources.add(this.ShapeCollection);
      }
      this.ShapeCollection.entities.removeAll();
      if(this.ShapeCollection){
        let promise = Cesium.GeoJsonDataSource.load(geojson);
        promise.then(function(dataSource){
          var entities = dataSource.entities.values;
          for (let i = 0; i < entities.length; i++) {
            self.ShapeCollection.entities.add(entities[i])
          }
        })
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

.download{
  position: absolute;
  top: 7px;
  left: 180px;
  z-index: 11;
}
</style>