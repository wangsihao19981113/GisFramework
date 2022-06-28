/**
 *
 * @param viewer
 * @param config
 * {
 *     image:云层图片
 *     height:云层高度
 *     latmax:最大纬度
 *     lngmax:最大经度
 *     latmin:最小纬度
 *     lngmin:最小经度
 *     speed：云层移动速度 m/s
 *     scale:图片比例尺
 *     direction:图片移动角度，正北开始计算
 * }
 * @constructor
 */

function Cloud(viewer,config)
{
    this.viewer = viewer;
    this.config = config;
    this.entity = null;
}

Cloud.prototype.createCloud = function (viewer,config)
{
    if(viewer)
        this.viewer = viewer;
    if(config)
        this.config = config;
    //如果初始化和创建过程中都没有赋值则默认为window.app.viewer
    if(!this.viewer)
        this.viewer = window.app.viewer
    viewer = this.viewer;
    var image = this.config.image ? this.config.image : window.location.origin+"/WeatherImage/cloud.png"
    var height = this.config.height ? this.config.height : 10000;
    var latmax = this.config.latmax ? this.config.latmax : Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).latitude);
    var lngmax = this.config.lngmax ? this.config.lngmax : Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).longitude);
    var latmin = this.config.latmin ? this.config.latmin : Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).latitude);
    var lngmin = this.config.lngmin ? this.config.lngmin : Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).longitude);
    var speed = this.config.speed ? this.config.speed : 10;
    var scale = this.config.scale ? this.config.scale : 1;
    var direction = this.config.direction ? this.config.direction : Math.random() * 360;
    var lat = latmin + Math.random() * (latmax-latmin);
    var lng = lngmin + Math.random() * (lngmax-lngmin);
    var self = this;
    this.entity = new Cesium.Entity(
        {
            position: Cesium.Cartesian3.fromDegrees(lng,lat,height),
            billboard:{
                image:image,
                //scale:scale,
                scaleByDistance:new Cesium.NearFarScalar(1.5e2, 0.5, 1.5e5, 0.01)
            }
        }
    )
    this.originPosition = this.entity.position.getValue();
    this.entity.position = new Cesium.CallbackProperty(function(){
        return self.originPosition;
    },false);
    //每0.1秒更新一次位置信息
    setInterval(() => {
        let lngPosition = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(self.originPosition).longitude);
        let latPosition = Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(self.originPosition).latitude);
        if(lngPosition > lngmax || lngPosition < lngmin || latPosition > latmax || latPosition < latmin)
        {
            direction = direction + 180;
        }
        self.originPosition = ByDirectionAndLen(self.originPosition,direction,speed/10)
    }, 100);

    //根据角度和长度计算位置信息
    function ByDirectionAndLen(position, angle, len) {
        let matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(angle || 0));
        let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        Cesium.Matrix4.multiply(matrix, rotationZ, matrix);
        let result = Cesium.Matrix4.multiplyByPoint(matrix, new Cesium.Cartesian3(0, len, 0),
            new Cesium.Cartesian3());
        return result;
    }


}


Cloud.prototype.show = function ()
{
    if(this.viewer && this.entity)
    {
        this.viewer.entities.add(this.entity)
    }
}

Cloud.prototype.close = function ()
{
    if(this.viewer && this.entity)
    {
        this.viewer.entities.remove(this.entity)
    }
}

module.exports = Cloud;