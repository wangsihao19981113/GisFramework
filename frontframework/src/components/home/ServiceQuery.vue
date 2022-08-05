<template>
  <div class="ServiceQuery">
    <div class="layoutDiv">
      <p>服务地址</p>
      <el-input v-model="WFS_Service_Url" size="small" placeholder="请输入内容"></el-input>
    </div>
    <div class="layoutDiv">
      <p>图层名称</p>
      <el-input v-model="LayerName" size="small" placeholder="请输入内容"></el-input>
    </div>
    <div v-show="!(IsShowFilter)" class="layoutDiv">
      <el-button class="queryButton" @click="startQueryField">添加过滤条件</el-button>
    </div>
    <div v-show="IsShowText" class="layoutDiv">
      <h1 style = "color: #606266;font-weight: 500;font-size: 14px;margin-top: 30px;"><span style="color:darkred">错误</span>：{{ErrorTextField}}</h1>
    </div>
    <div v-show="IsShowFilter" class="layoutDiv">
      <p>过滤条件</p><el-button icon="el-icon-plus" class="addButton" @click="addCondition"></el-button>
      <div v-for="(i,index) in Cql_filter" :key="index"  class="SelectBox">
        <el-select v-model="i.field" size="small" placeholder="请选择">
          <el-option
              v-for="item in fields"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="i.comparison" size="small" placeholder="请选择">
          <el-option
              v-for="item in comparisons"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="i.input" size="small" placeholder="请输入内容"></el-input>
        <el-button type="danger" icon="el-icon-delete" circle class="deleteButton" @click="DeleteItem(index)"></el-button>
      </div>
    </div>
    <div v-show="IsShowFilter" class="layoutDiv">
      <el-button class="queryButton" @click="startQuery">开始查询</el-button>
    </div>
    <div v-show="IsShowServiceQueryTip" class="layoutDiv">
      <h1 style = "color: #606266;font-weight: 500;font-size: 14px;margin-top: 30px;"><span style="color:darkorange">提示</span>：{{TipTextService}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceQuery",
  data(){
    return{
      ErrorTextField:"",//字段查询错误信息
      TipTextService:"",//要素查询提示信息
      IsShowText:false,//字段查询界面是否显示
      IsShowServiceQueryTip:false,//要素查询提示信息是否显示
      IsShowFilter:false,//是否展示过滤条件界面
      IsEmptyComparison:false,//是否存在有空值的过滤条件
      WFS_Service_Url:null,
      LayerName:null,
      Cql_filter:[],
      fields:[],
      comparisons:[
        {value:"equal",label:"equal"},
        {value:"notequal",label:"not equal"},
        {value:"like",label:"like"},
        {value:"notlike",label:"not like"},
        {value:"intersects",label:"intersects"}
      ],
      BaseConfigWFS:{
        service:"wfs",
        version:"1.0.0",
        outputFormat:"application/json"
      },
    }
  },
  mounted() {
  },
  methods:{
    //添加条件
    addCondition(){
      this.Cql_filter.push(
        {
          field:null,
          comparison:null,
          input:null,
        }
      )
    },
    startQuery(){
      let self = this;
      let cql_filter = this.CreateCQLFilterFormat(this.Cql_filter);
      if(cql_filter)
      {
        let formData = this.BaseConfigWFS;
        formData["request"] = "GetFeature";
        formData["typeName"] = this.LayerName;
        formData["cql_filter"] = cql_filter;
        let params = {"params":formData}
        this.$axios.get(this.WFS_Service_Url,params)
            .then(function (response) {
              let res = response.data;
              if(res.features && res.features.length>0) {
                let promise = Cesium.GeoJsonDataSource.load(res, {
                  stroke: Cesium.Color.WHITE,
                  fill: Cesium.Color.BLUE.withAlpha(0.3), //注意：颜色必须大写，即不能为blue
                  strokeWidth: 5,
                });
                promise.then(function (dataSource){
                  window.viewer.dataSources.add(dataSource);
                  window.viewer.zoomTo(dataSource);
                  let entities = dataSource.entities.values;
                  for (let i = 0; i < entities.length; i++) {
                    self.$store.state.EntityList.push({"source":dataSource.entities,"entity":entities[i],"type":"面","color":{"value":"rgba(255,255,0,1)","disable":false}});
                  }
                })
                console.log(res);
              }
              else{
                self.IsShowServiceQueryTip = true;
                self.TipTextService = "该条件下查询要素为空"
              }
            })
            .catch(function (error) {
              console.log(error);
            });
      }
      else{
        if(this.IsEmptyComparison) {
          this.IsShowServiceQueryTip = true;
          this.TipTextService = "存在过滤条件填写为空的情况";
          this.IsEmptyComparison = false;
        }
        else{
          let formData = this.BaseConfigWFS;
          formData["request"] = "GetFeature";
          formData["typeName"] = this.LayerName;
          let params = {"params":formData};
          this.$axios.get(this.WFS_Service_Url,params)
              .then(function (response) {
                let res = response.data;
                if(res.features && res.features.length>0) {
                  let dataSource = Cesium.GeoJsonDataSource.load(res, {
                    stroke: Cesium.Color.WHITE,
                    fill: Cesium.Color.BLUE.withAlpha(0.3), //注意：颜色必须大写，即不能为blue
                    strokeWidth: 5,
                  });
                  window.viewer.dataSources.add(dataSource);
                  window.viewer.zoomTo(dataSource);
                  console.log(res);
                }
                else{
                  self.IsShowServiceQueryTip = true;
                  self.TipTextService = "服务中没有要素出现"
                }
              })
              .catch(function (error) {
                console.log(error);
              });
        }
      }
    },
    startQueryField(){
      let self = this;
      let formData = this.BaseConfigWFS;
      formData["request"] = "DescribeFeatureType";
      formData["typeName"] = this.LayerName;
      let params = {"params":formData}
      this.$axios.get(this.WFS_Service_Url, params)
          .then(function (response) {
            let res = response.data;
            if(res.featureTypes && res.featureTypes.length > 0)
            {
              var features = res.featureTypes;
              for (var i = 0; i < features.length; i++) {
                var item = features[i];
                var properties = item.properties;
                if (properties && properties.length > 0) {
                  self.fields = [];
                  for (var x = 0; x < properties.length; x++) {
                    self.fields.push({value:properties[x].name,label:properties[x].name})
                  }
                }
                self.IsShowText = false;
                self.IsShowFilter = true;
              }
            }
            else{
              self.IsShowText = true;
              self.ErrorTextField = "服务地址或图层名称填写有误，获取图层字段信息失败。"
            }
          })
          .catch(function (error) {
            self.IsShowText = true;
            self.ErrorTextField = "访问服务有误，获取图层字段信息失败。"
            console.log(error);
          });
    },
    //创造过滤语句
    CreateCQLFilterFormat(Cql_filter){
      let Cql_Filter_Format = []
      for(let i = 0 ; i < Cql_filter.length ; i++){
        if(Cql_filter[i].field && Cql_filter[i].comparison && Cql_filter[i].input)
        {
          let field = Cql_filter[i].field;
          let comparison = Cql_filter[i].comparison;
          let input = Cql_filter[i].input
          switch (comparison){
            case ("equal"):
              Cql_Filter_Format.push(field + " = " + "'" + input + "'");
              break;
            case ("notequal"):
              Cql_Filter_Format.push(field + " <> " + "'" + input + "'");
              break;
            case ("like"):
              Cql_Filter_Format.push(field + " like " + "'%" + input + "%'");
              break;
            case ("notlike"):
              Cql_Filter_Format.push(field + " not like " + "'%" + input + "%'");
              break;
            case ("intersects"):
              Cql_Filter_Format.push("intersects(" + field +","+ input +")");
              break;
          }
        }
        else{
          this.IsEmptyComparison = true;
        }
      }
      if(Cql_Filter_Format.length > 0)
      {
        let CqlString = "";
        for(let i = 0 ; i < Cql_Filter_Format.length-1 ; i++)
        {
          CqlString = CqlString + Cql_Filter_Format[i] + ' and '
        }
        CqlString = CqlString + Cql_Filter_Format[Cql_Filter_Format.length-1]
        return CqlString
      }
      else{
        return null;
      }
    },
    DeleteItem(index){
      this.Cql_filter.splice(index,1)
    }
  }
}
</script>

<style scoped>
.ServiceQuery{
  width: 416px;
}

.ServiceQuery .SelectBox{
  margin-top: 10px;
  display: flex;
}

.ServiceQuery .layoutDiv{
  margin-top: 20px;
}

.ServiceQuery .closeButton{
  float:right;
  padding:6px 10px;
}

.ServiceQuery .queryButton{
  float:right;
}

.ServiceQuery .addButton{
  padding: 6px 10px;
}

.ServiceQuery .deleteButton{
  margin-left: 10px;
}

.ServiceQuery p{
  color:#409EFF
}
</style>