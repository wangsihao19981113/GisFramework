<template>
  <div>
    <div style="position:absolute;z-index: 100">
      <el-button @click="start">开始</el-button>
      <el-button @click="remove">清除</el-button>
    </div>
    <CesiumBaseView/>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import Firework from "@/lib/ParticleSystem/Firework";
export default {
  components: {CesiumBaseView},
  mounted() {
    this.firework = null
    this.options = {
      num:10,
      position:[112,23]
    }
  },
  methods: {
    start() {
      if (!this.firework) {
        this.firework = new Firework(window.viewer, this.options)
        this.firework.show()
      }
    },
    remove(){
      if(this.firework){
        this.firework.remove();
        this.firework = null
      }
    }
  }
}
</script>

<style scoped>

</style>