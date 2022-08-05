<template>
  <div class="importDataDiv">
    <div v-for="(item,index) in EntityList" :key="index">
      <div>{{item.entity}}</div>
      <div>{{item.type}}</div>
      <el-color-picker v-model="color" show-alpha></el-color-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImportData",
  props:{
    EntityList:{
      type:Array,
    }
  },
  data(){
    return{
      //EntityList:[{"source":"资源","entity":"实体项","type":"点","show":true,"color":{"value":"rgba(255,255,0,1)","disable":false},}]
    }
  },
  watch:{
    "this.$store.state.EntityList"(){
    }
  },
}
</script>

<style scoped>

</style>