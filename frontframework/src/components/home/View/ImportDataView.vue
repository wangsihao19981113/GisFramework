<template>
  <div :id="ImportDataViewID" class="ImportDataView" v-show="IsShowView">
    <div :id="DragElementID" class="TopBox">
      <span class="Title">导入数据管理界面</span>
      <el-button icon="el-icon-close" class="closeButton" @click="CloseFunction"></el-button>
      <el-button icon="el-icon-delete" class="closeButton" @click="DeleteFunction"></el-button>
    </div>
    <div class="importDataDiv">
      <div style="margin-top: 20px">
        <span class="ImportDataProp">名字</span>
        <span class="ImportDataProp">类型</span>
        <span class="ImportDataProp">显隐</span>
        <span class="ImportDataProp">删除</span>
      </div>
      <div style="margin-top: 20px" class="importDataItem" v-for="(item,index) in EntityList" :key="index">
        <span class="ImportDataProp" v-if="item.entity._name">{{item.entity._name}}</span>
        <span class="ImportDataProp" v-else>导入要素</span>

        <span class="ImportDataProp">{{item.type}}</span>

        <span class="ImportDataProp icon-button icon-yanjing iconfont" @click="ShowOrHideEntity($event,item)" v-if="item.entity.show"></span>
        <span class="ImportDataProp icon-button icon-biyan iconfont" @click="ShowOrHideEntity($event,item)" v-else></span>

<!--        <span>-->
<!--        <el-color-picker :disabled="item.color.disable" v-model="item.color.value" show-alpha></el-color-picker>-->
<!--        </span>-->
        <span style="color: darkred" class="ImportDataProp icon-button icon-shanchu iconfont" @click="DeleteEntityFromSource(item,index)"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "ImportDataView",
  data(){
    return {
      //EntityList:[{"source":"资源","entity":"实体项","type":"点","color":{"value":"rgba(255,255,0,1)","disable":false}}],
      EntityList: this.$store.state.EntityList,
      IsShowView:false,
      DragElementID:"DragElementID",
      ImportDataViewID:"ImportDataViewID",
    }
  },
  beforeMount() {
    let sid = uuidv4();
    this.DragElementID = "d" + sid;
    this.ImportDataViewID = "i" + sid;
  },
  mounted() {
    this.startDrag();
  },
  watch:{
    EntityList(){
      console.log(this.EntityList)
      if(this.EntityList.length > 0)
      {
        this.IsShowView = true;
      }
      else{
        this.IsShowView = false;
      }
    }
  },
  methods:{
    CloseFunction(){
      this.IsShowView = false;
    },
    startDrag(){
      let element = document.getElementById(this.DragElementID)
      let PopupElement = document.getElementById(this.ImportDataViewID);
      if(element){
        element.onmousedown = function(el){
          let left = PopupElement.offsetLeft;
          let top = PopupElement.offsetTop;
          //计算出鼠标的位置与元素位置的差值。
          let cleft = el.clientX - left;
          let ctop = el.clientY - top;
          let body = document.querySelector("body")
          body.style.cursor= "move"
          document.onmousemove = function (doc) {
            //计算出移动后的坐标。
            var moveLeft = doc.clientX - cleft;
            var moveTop = doc.clientY - ctop;
            //设置成绝对定位，让元素可以移动。
            PopupElement.style.position = "absolute";
            //当移动位置在范围内时，元素跟随鼠标移动。
            PopupElement.style.left = moveLeft + "px";
            PopupElement.style.top = moveTop + "px";
          }
          document.onmouseup = function () {
            document.onmousemove = function () { }
            let body = document.querySelector("body")
            body.style.cursor= "default"
          };
        }
      }
    },
    DeleteEntityFromSource(item,index){
      if(item.source.remove)
      {
        item.source.remove(item.entity)
        this.$store.state.EntityList.splice(index,1);
      }
      else{
        this.$message({
          message: '删除失败，资源配置中不存在相应的删除函数',
          type: 'warning'
        });
      }
    },
    ShowOrHideEntity($event,item){
      if(item.entity.show) {
        item.entity.show = false;
      }
      else{
        item.entity.show = true;
      }
    },
    DeleteFunction(){
      for(let i = 0 ; i < this.EntityList.length ; i++){
        if(this.EntityList[i].source.remove) {
          this.EntityList[i].source.remove(this.EntityList[i].entity)
        }
        else{
          this.$message({
            message: '第'+i+'个实体从地图界面中删除失败，资源配置中不存在相应的删除函数',
            type: 'warning'
          });
        }
      }
      this.$store.state.EntityList.splice(0,this.$store.state.EntityList.length);
    }
  }
}
</script>

<style scoped>
.ImportDataView{
  position: absolute;
  z-index: 3;
  top:200px;
  left: 50px;
  background: white;
  padding: 10px 20px 10px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 20%;
}

.ImportDataView .TopBox .Title{
  color: #606266;
  font-weight: 500;
  font-size: 16px;
}

.ImportDataView .TopBox .closeButton{
  padding:6px 10px;
  float: right;
}

.importDataDiv{
  margin-top: 10px;
}

.importDataItem{
  margin-top: 20px;
}

.ImportDataProp{
  padding: 10px 20px;

}

.icon-button:hover{
  cursor: pointer;
}
</style>