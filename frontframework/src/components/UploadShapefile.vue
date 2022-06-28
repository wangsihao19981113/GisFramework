<template>
  <div class="PopupElement" v-drag>
    <div><el-button icon="el-icon-close" class="closeButton" @click="CloseDialog"></el-button></div>
    <div>
      <el-upload
          class="upload-demo uploadShape"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-change="handleOnChange"
          multiple
          :limit="4"
          :on-exceed="handleExceed"
          :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">需要上传Shapefile文件中的.prj、.shp、.shx、.dbf文件</div>
      </el-upload>
    </div>
    <div><el-button @click="ShapeAnalysis" type="primary" size="small" class="analysisButton">解析</el-button></div>
  </div>
</template>

<script>
export default {
  name: "UploadShapefile",
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    handleOnChange(file,fileList){
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 4 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    ShapeAnalysis(){
      var formData = new FormData();

      let hasprj = false;
      let hasdbf = false;
      let hasshp = false;
      let hasshx = false;
      let filenamelist = [];
      let require = [];
      for(let i = 0 ; i < this.fileList.length ; i++)
      {
        let name = this.fileList[i].name;
        let extra = name.substring(name.lastIndexOf(".")+1);
        let filename = name.substring(0,name.lastIndexOf("."));
        filenamelist.push(filename);
        switch (extra){
          case("prj"):
            hasprj = true;
            break;
          case("dbf"):
            hasdbf = true;
            break;
          case("shp"):
            hasshp = true;
            break;
          case("shx"):
            hasshx= true;
            break;
        }
      }
      if(!hasprj) require.push(".prj") ; if(!hasdbf) require.push(".dbf") ; if(!hasshp) require.push(".shp") ; if(!hasshx) require.push(".shx")
      let isTheSameFileName = Array.from(new Set(filenamelist)).length == 1;
      if(isTheSameFileName && hasprj && hasdbf && hasshp && hasshx)
      {
        for (let i = 0; i < this.fileList.length; i++) {
          formData.append("uploadFile", this.fileList[i].raw);
        }
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$axios.post('http://localhost:8080/shapefile/upload', formData, config)
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
      }
      if(isTheSameFileName){
        var text = '上传文件名字相同，但缺少';
        for(var i = 0 ; i < require.length ; i++)
        {
          if(i == require.length-1) {
            text = text + require[i];
          }
          else{
            text = text + require[i] + "、";
          }
        }
        text = text + "文件"
        this.$message.warning(text);
        return "false";
      }
      else{
        var text = '上传文件名字不同';
        if(require.length > 0) {
          text = text + "，同时缺少"
          for (var i = 0; i < require.length; i++) {
            if (i == require.length - 1) {
              text = text + require[i];
            } else {
              text = text + require[i] + "、";
            }
          }
          text = text + "文件"
        }
        this.$message.warning(text);
      }
    },
    CloseDialog(){
      this.$router.push('/home')
    },
  }
}
</script>

<style scoped>
.analysisButton{
  float: right;
  margin-top: 20px;
  /*padding: 7px 20px*/
}
.closeButton{
  float:right;
  padding:6px 10px;
}
.uploadShape{
  float:left
}

</style>