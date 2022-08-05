<template>
  <div class="UploadShapefileView">
    <PopupElement :title="'上传ShapeFile'" :close-call-back="CloseDialog">
      <UploadShapefile></UploadShapefile>
    </PopupElement>
  </div>
</template>

<script>
import UploadShapefile from "@/components/home/UploadShapefile";
import PopupElement from "@/components/home/PopupElement";

export default {
  name: "UploadShapefileView",
  components: {UploadShapefile,PopupElement},
  methods:{
    CloseDialog() {
      this.$router.push('/home')
    },
  }
}
</script>

<style scoped>
.UploadShapefileView{
  position: absolute;
  left: 70%;
  top: 100px;
}
</style>