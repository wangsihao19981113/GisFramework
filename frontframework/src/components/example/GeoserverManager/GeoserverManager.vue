<template>
  <div></div>
</template>

<script>
let GeoServerRestClient = require('./lib/dist/geoserver-rest-client').GeoServerRestClient;
export default {
  name: "GeoserverManager",
  mounted() {
    const url = 'http://localhost:8888/geoserverAddress/geoserver/rest/';
    const user = 'admin';
    const pw = 'geoserver';
    const grc = new GeoServerRestClient(url, user, pw);
    debugger
    grc.layers.getAll().then(function (res){
      console.log(res);
    })
    const nativeBoundingBox = {
      minx: 109.14944921900008,
      maxx: 109.17064077000003,
      miny: 19.80552930600004,
      maxy: 19.818262505000064,
      crs: {
        '@class': 'projected',
        $: 'EPSG:4326'
      }
    };
    grc.layers.publishFeatureType('cite', 'point5', 'point4', 'point5', 'title_test', 'EPSG:4326', true , null , nativeBoundingBox).then(function (res){
      debugger
      console.log(res);
    }).catch(function (e){
      console.log(e.geoServerOutput)
    })
  }
}
</script>

<style scoped>

</style>
