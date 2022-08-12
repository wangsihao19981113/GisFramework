//{
//   "":
// }
function HeatMap(config,width,height){
    let container = document.createElement("div");
    container.classList.add("div-heatmap");
    container.style.width = width + "px";
    container.style.height = height + "px";
    container.style.display = "none";
    document.body.appendChild(container)
    config["container"] = container;
    this.heatmapInstance = h337.create(config);
}

HeatMap.prototype.setData = function (data){
    if(data && this.heatmapInstance){
        this.heatmapInstance.setData(data)
    }
}

HeatMap.prototype.show = function (rectangle,viewer){
    let canvas = document.getElementsByClassName('heatmap-canvas');
    this.heatmapentity = viewer.entities.add(
        {
            name: 'heatmap',
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(rectangle["west"], rectangle["south"], rectangle["east"], rectangle["north"]),
                material: new Cesium.ImageMaterialProperty({
                    image: canvas[0].toDataURL(),
                    transparent: true
                })
            }
        }
    )
    viewer.zoomTo(this.heatmapentity);
}

HeatMap.prototype.remove = function (viewer){
    if(viewer)
    {
        viewer.remove(this.heatmapentity)
    }
    else{
        window.viewer.remove(this.heatmapentity);
    }
}

export {
    HeatMap
}


// let gradient{
//     "1":"rgb(255,0,0)"
//     "0.95":"rgb(255,32,0)",
//     "0.9":"rgb(255,71,0)",
//     "0.85":"rgb(255,105,0)",
//     "0.2":"rgb(255,135,4)",
//     "0":"rgb(253,171,1)",
    // "0.7":"rgb(255,200,4)",
    // "0.65":"rgb(251,229,21)",
    // "0.6":"rgb(241,245,44)",
    // "0.55":"rgb(225,252,79)",
    // "0.5":"rgb(205,254,113)",
    // "0.45":"rgb(199,255,111)",
    // "0.4":"rgb(177,254,148)",
    // "0.35":"rgb(144,255,178)",
    // "0.3":"rgb(110,252,214)",
    // "0.25":"rgb(76,242,232)",
    //
    // "0.2":"rgb(56,216,252)",
    // "0.15":"rgb(56,184,255)",
    // "0.1":"rgb(57,150,254)",
    //
    // "0.05":"rgb(54,117,255)",
    // "0":"rgb(26,100,233)",

// }

// GetHeatData(geojson){
//     let data = geojson;
//     let returnData = [];
//     let firstCoordinates = data.features[0].geometry.coordinates
//     let bounds = {
//         west: firstCoordinates[0], south: firstCoordinates[1], east: firstCoordinates[0], north: firstCoordinates[1]
//     };
//     for(var i = 0 ; i < data.features.length ; i++) {
//         let returnDataItem = {}
//         let coordinates = data.features[i].geometry.coordinates;
//         let properties =  data.features[i].properties
//         if(coordinates[0] < bounds["west"])
//         {
//             bounds["west"] = coordinates[0];
//         }
//         if(coordinates[0] > bounds["east"])
//         {
//             bounds["east"] = coordinates[0];
//         }
//         if(coordinates[1] < bounds["south"])
//         {
//             bounds["south"] = coordinates[1];
//         }
//         if(coordinates[1] > bounds["north"])
//         {
//             bounds["north"] = coordinates[1];
//         }
//
//         returnDataItem["x"] = coordinates[0];
//         returnDataItem["y"] = coordinates[1];
//         returnDataItem["value"] = properties["GRID_CODE"];
//         returnData.push(returnDataItem)
//     }
//
//     return {bounds:bounds,data:returnData};
// },

// $.get(GLOBAL.domainResource+"/static/systems/item-widgets/customs/ambient/data/T2.geojson",function (res){
//     let data = res;
//     let heatdata = self.GetHeatData(data);
//     var heatMap = CesiumHeatmap.create(
//         window.app.viewer, // 视图层
//         heatdata["bounds"],
//         { // heatmap相应参数
//             backgroundColor: "rgba(0,0,0,0)",
//             radius: 8,
//             maxOpacity: 0.5,
//             minOpacity: 0,
//             blur: 0.75
//         }
//     );
//     heatMap.setWGS84Data(25,36,heatdata["data"])
//     window.app.viewer.zoomTo(window.app.viewer.entities);
// })


// gradient:{
//     "":"",
//     "":"",
//     "":"",
//     "":"",
//     "":"",
//     "":"",
// }



