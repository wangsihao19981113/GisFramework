<template>
  <div></div>
</template>

<script>
let GeoServerRestClient = require('./lib/dist/geoserver-rest-client').GeoServerRestClient;
export default {
  name: "GeoserverManager",
  mounted() {
    const url = '/datasource/geoserver/rest/';
    const user = 'admin';
    const pw = 'geoserver';
    const grc = new GeoServerRestClient(url, user, pw);
    grc.layers.getAll().then(function (res){
      console.log(res);
    })
  }
}
</script>

<style scoped>

</style>
