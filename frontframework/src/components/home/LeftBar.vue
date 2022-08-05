<template>
  <div>
    <div class="LeftBar">
      <div class="LeftButton">
        <div class="LeftButtonText" @click="show2 = !show2">图层列表</div>
      </div>
      <div class="LeftButton">
        <div class="LeftButtonText">空间分析</div>
      </div>
      <div class="LeftButton">
        <div class="LeftButtonText">图层列表</div>
      </div>
    </div>
    <transition name="show">
    <div v-show="show2" class="PlaneDiv">
      <tree-plane/>
    </div>
    </transition>
  </div>
</template>

<script>
import TreePlane from "@/components/home/TreePlane";
export default {
  name: "LeftBar",
  components: {TreePlane},
  data(){
    return{
      show2:false,
    }
  }
}
</script>

<style scoped>
.LeftBar{
  position:absolute;
  height: 100%;
  width: 56px;
  top:61px;
  background-color: white;
  border-right: 1px solid lightgrey;
}


.LeftBar .LeftButton{
  width: 55px;
  height: 55px;
  border-bottom: 1px solid lightgrey;
  padding:0px;
}

.LeftBar .LeftButton .LeftButtonText{
  font-size: 14px;
  color: #909399;
  padding: 10px;
  user-select: none;
  cursor: pointer;
}

.LeftButton:hover{
  background-color: #F5F7FA;
}

.PlaneDiv{
  position:absolute;
  width: 250px;
  height: 100%;
  top:61px;
  left:57px;
  background-color: white;
  overflow: hidden;
}

@keyframes show{0%{width: 0px}
  100%{width: 250px}
}
@keyframes hide{0%{left:57px;width: 250px}
  100%{left:57px;width: 0px}
}


.show-enter-active{animation:show 0.6s}
.show-leave-active{animation:hide 0.6s}
.show-enter,.show-leave-to{width: 0px}




</style>