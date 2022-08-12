<template>
  <CesiumBaseView></CesiumBaseView>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import {HeatMap} from "@/lib/HeatMap/HeatMap";

export default {
  name: "HeatMapNormal",
  components: {CesiumBaseView},
  mounted() {
    var self = this;
    let width = 4080;
    let height = 2480;
    this.$axios.get("/geojson/T2.geojson")
        .then(function (response) {
          let data = response.data;
          let heatdata = self.GetHeatData(data);
          let heatMap = new HeatMap({
            radius:10,
            maxOpacity:0.5,
            blur:0.75,
          },width,height)
          heatMap.setData({
            max: 30,
            min: 28,
            data: heatdata["data"],
          })
          heatMap.show({west: 99, south: -10, east: 150, north: 52},window.viewer);
    })
    .catch(function (error) {
      console.log(error)
    });



  },
  methods:{
    GetHeatData(geojson){
      let data = geojson;
      let returnData = [];
      let width = 4080;
      let height = 2480;
      let bounds = {
        west: 99, south: -10, east: 150, north: 52
      };
      for(var i = 0 ; i < data.features.length ; i++) {
        let returnDataItem = {}
        let coordinates = data.features[i].geometry.coordinates;
        let properties =  data.features[i].properties

        returnDataItem["x"] = Math.floor((coordinates[0] - bounds["west"]) / (bounds["east"]-bounds["west"]) * width);
        returnDataItem["y"] = Math.floor(( bounds["north"]-coordinates[1]) / (bounds["north"]-bounds["south"]) * height);
        returnDataItem["value"] = properties["GRID_CODE"];
        returnData.push(returnDataItem)
      }

      return {bounds:bounds,data:returnData};
    }
  }
}
</script>

<style scoped>

</style>