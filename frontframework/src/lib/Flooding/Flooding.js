/* eslint-disable */
/**
 * 水淹分析。
 *
 * @alias ViewShedStage
 * @class
 * @param {Cesium.Viewer} viewer Cesium三维视窗。
 * @param {Object} options 选择。
 * @param {Array} options.positionArray 经纬度坐标串 [112,23,112,24]
 * @param {Number} options.speed 速度
 * @param {Number} options.targetHeight 目标高度
 * @param {Number} options.waterHeight 初始水高度
 */
class Flooding {
    constructor(viewer, options) {
        this.viewer = viewer;
        this.options = options;
        this.speed = options.speed;
        this.positionArray = options.positionArray || null;
        this.targetHeight = options.targetHeight || 1000;
        this.timer = null;
        this.waterHeight = options.waterHeight || 0;
        this.inProgress = false;
        this.createEntity();
    }

    start() {
        this.inProgress = true;
    }

    stop() {
        this.inProgress = false;
    }

    remove(){
        this.viewer.entities.remove(this.entity);
    }

    restart(){
        this.inProgress = true;
        this.waterHeight = this.options.waterHeight;
    }


    createEntity() {
        let self = this;
        if(this.positionArray) {
            this.entity = this.viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(this.positionArray)),
                    material: new Cesium.Color.fromBytes(64, 157, 253, 150),
                    perPositionHeight: true,
                    extrudedHeight:  new Cesium.CallbackProperty(function (){
                        if(self.inProgress) {
                            self.waterHeight = self.waterHeight += self.speed;
                            if (self.waterHeight > self.targetHeight) {
                                self.waterHeight = self.targetHeight;
                            }
                        }
                        return self.waterHeight;
                    },false),
                }
            })
        }
        else{
            this.entity = null;
        }
    }
}


export default Flooding;