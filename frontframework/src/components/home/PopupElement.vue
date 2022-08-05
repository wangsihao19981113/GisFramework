<template>
    <div :id="PopupElementId" class="PopupElement">
      <div :id="dragElementId" class="TopBox">
        <span class="Title">{{title}}</span>
        <el-button icon="el-icon-close" class="closeButton" @click="CloseFunction"></el-button>
      </div>
      <slot></slot>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "PopupElement",
  props:{
    title:{
      type:String,
      default:"标题",
    },
    CloseCallBack:{
      type:Function,
      default: null
    }
  },
  data(){
    return{
      PopupElementId:null,
      dragElementId:null,
    }
  },
  created() {

  },
  beforeMount(){
    let sid=''
    sid=uuidv4()
    this.dragElementId = "d" + sid;
    this.PopupElementId = "p" + sid;
  },
  mounted() {
    this.startDrag()
  },
  methods:{
    startDrag(){
      let element = document.getElementById(this.dragElementId)
      let PopupElement = document.getElementById(this.PopupElementId);
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
    CloseFunction(){
      let element = document.getElementById(this.PopupElementId);
      element.remove();
      if(this.CloseCallBack)
      {
        this.CloseCallBack()
      }
    }
  }
}
</script>

<style scoped>

.PopupElement{
  position: absolute;
  background: white;
  padding: 10px 20px 10px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.PopupElement .TopBox .Title{
  color: #606266;
  font-weight: 500;
  font-size: 16px;
}

.PopupElement .closeButton{
  padding:6px 10px;
  float: right;
}
</style>