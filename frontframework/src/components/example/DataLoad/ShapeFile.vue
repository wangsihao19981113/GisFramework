<template>
  <div>
    <el-upload
        class="upload-demo uploadShape"
        action="localhost:8888/el/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
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
let shapefile = require("shapefile")

export default {
  name: "ShapeFile",
  data(){
    return{
      FileList:null
    }
  },
  methods:{
    handleOnChange(file,fileList){
      console.log(fileList)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`).then(function(res) {
        console.log(res)
      }).catch(function(err) {
        console.log(err)
      })
    },
    parsingShape(files, fileList){
      let _self=this;
      let fileshp = null;
      let filedbf = null;
      if(fileList){
        for(let i = 0 ; i < fileList.length ; i++)
        {
          let name = fileList[i].name
          if(name.substring(name.lastIndexOf(".")+1) == "shp")
          {
            fileshp = fileList[i]
          }
          if(name.substring(name.lastIndexOf(".")+1) == "dbf")
          {
            filedbf = fileList[i]
          }
        }
        this.file=fileList[fileList.length-1]
        const reader= new FileReader()
        reader.onload = function({ target: { result: A } }){
          if(filedbf) {
            reader.readAsDataURL(filedbf.raw);
            reader.onload = ({target: {result: B}}) => {
              shapefile.open(A, B).then(
                  source => source.read()
                      .then(function log(result) {
                        if (result.done) return;
                        console.log(result.value);
                        return source.read().then(log);
                      }))
                  .catch(error => console.error(error.stack));
            }
          }else{
            shapefile.open(A).then(
                source => source.read()
                    .then(function log(result) {
                      if (result.done) return;
                      console.log(result.value);
                      return source.read().then(log);
                    }))
                .catch(error => console.error(error.stack));
          }
        }
        if(fileshp) {
          reader.readAsArrayBuffer(fileshp.raw)
        }
        else{
          return
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