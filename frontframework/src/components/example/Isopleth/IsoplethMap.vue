<template>
  <CesiumBaseView></CesiumBaseView>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
let isopleth = require('@/lib/Isopleth/Isopleth.js');
export default {
  name: "IsoplethMap",
  components: {CesiumBaseView},
  mounted() {
    let a = new isopleth(this,2000,2000);
    a.setData();
    a.show(window.viewer)
    a.remove(window.viewer)
  }
}
</script>

<style scoped>

</style>