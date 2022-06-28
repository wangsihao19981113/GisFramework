<template>
  <div id="topBar">
    <el-menu
        class="el-menu-demo"
        mode="horizontal"
        active-text-color="#409EFF">
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1" @click="RouteTo($event)">解析shape</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>消息中心</el-menu-item>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "TopBar",
  data(){
    return{
    }
  },
  mounted(){

  },
  methods:{
    RouteTo($event){
      console.log($event);
      if($event.index == "2-1")
      {
        this.$router.push('/home/UploadShapefile')
      }
    }
  }
}
</script>

<style scoped>
#topBar{
  position:absolute;
  z-index:1;
  width: 100%;
}
</style>