<template>
  <div class="ServiceQueryView">
    <PopupElement :title="'WFS服务查询'" :close-call-back="CloseDialog">
      <ServiceQuery></ServiceQuery>
    </PopupElement>
  </div>
</template>

<script>
import PopupElement from "@/components/home/PopupElement";
import ServiceQuery from "@/components/home/ServiceQuery";
export default {
  name: "ServiceQueryView",
  components: {ServiceQuery, PopupElement},
  methods:{
    CloseDialog() {
      this.$router.push('/home')
    },
  }
}
</script>

<style scoped>
.ServiceQueryView{
  position: absolute;
  left: 70%;
  top: 100px;
}
</style>