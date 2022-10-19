let kriging = require('./kriging')

let arrLon = [112,112.5,113,113.3,113.9,113.2]
let arrLat = [25,23.5,24.1,24.5,24.2,25]
let arrTemp = [2,3,5,3,4,6]

function Isopleth(config,width,height){
    let container = document.createElement("canvas");
    container.classList.add("div-Isopleth");
    container.style.width = width + "px";
    container.style.height = height + "px";
    container.style.display = "none";
    document.body.appendChild(container)
    this.container = container
    config["container"] = container;
}

Isopleth.prototype.setData = function (){
    let variogram = kriging.train(arrTemp, arrLon, arrLat, "exponential", 0, 100);
    let grid = kriging.grid([[[111,23],[111,25.5],[114,25.5],[114,23],[111,23]]], variogram, 0.0008);
    let colors = [
        '#68b0dc',
        '#85bcd2',
        '#a9c9c6',
        '#bdd5bd',
        '#d4ddb5',
        '#e4eaa9',
        '#fafb97',
        '#f4e58d',
        '#f8cb72',
        '#f1b079',
        '#fc9b5e',
        '#f5875e',
        '#ef604f',
    ];
    kriging.plot(this.container, grid, [111, 114], [23, 25.5], colors);
}


Isopleth.prototype.show = function (viewer){
    let image = this.container.toDataURL("image/png")
    if(viewer) {
        this.imagelayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
                url: image,
                rectangle: new Cesium.Rectangle(
                    Cesium.Math.toRadians(111),
                    Cesium.Math.toRadians(23),
                    Cesium.Math.toRadians(114),
                    Cesium.Math.toRadians(25.5)
                )
            }));
    }
}

Isopleth.prototype.remove = function (viewer){
    if(this.imagelayer && viewer){
        viewer.imageLayers.remove(this.imagelayer)
    }
}

module.exports = Isopleth;