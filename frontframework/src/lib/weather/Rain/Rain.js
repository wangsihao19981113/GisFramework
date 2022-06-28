/**
 *
 * @param viewer
 * @param config
 * {
 *     lat:纬度
 *     lng:经度
 *     height:降雨高度
 *     width:降雨宽度
 *     size:雨粒大小
 *     speed:降雨速度 两个负数 前小后大 例如[-300,-30]
 *     emissionRate:降雨密度 默认2000
 * }
 * @constructor
 */

function Rain(viewer,config)
{
    this.config = config;
    this.viewer = viewer;
}

Rain.prototype.startRain = function ()
{
    var viewer = this.viewer;
    var scene = viewer.scene;
    var lat = this.config.lat ? this.config.lat : Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).latitude);
    var lng = this.config.lng ? this.config.lng : Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).longitude);
    var RainParticleSize = this.config.size ? this.config.size : 12.0;
    var RainRadius = 100000.0;
    var speed = this.config.speed ? this.config.speed : [-300, -30.0];
    var emissionRate = this.config.emissionRate ? this.config.emissionRate : 2000;
    if(this.config.width && this.config.height)
    {
        RainRadius = this.config.width > this.config.height ? this.config.width : this.config.height ;
    }
    else
    {
        if(this.config.width)
        {
            RainRadius = this.config.width;
        }
        else if(this.config.height){
            RainRadius = this.config.height;
        }
        else{
        }
    }
    var width = this.config.width ? this.config.width : RainRadius;
    var height = this.config.height ? this.config.height : RainRadius;
    var minimumRainImageSize = new Cesium.Cartesian2(
        RainParticleSize,
        RainParticleSize
    );
    var maximumRainImageSize = new Cesium.Cartesian2(
        RainParticleSize * 2.0,
        RainParticleSize * 2.0
    );
    let RainGravityScratch = new Cesium.Cartesian3();


    var  RainUpdate = function (particle, dt) {
        RainGravityScratch = Cesium.Cartesian3.normalize(
            particle.position,
            RainGravityScratch
        );
        Cesium.Cartesian3.multiplyByScalar(
            RainGravityScratch,
            Cesium.Math.randomBetween(speed[0], speed[1]),
            RainGravityScratch
        );
        //求和
        particle.velocity = Cesium.Cartesian3.add(
            particle.velocity,
            RainGravityScratch,
            particle.velocity
        );
        let distance = Cesium.Cartesian3.distance(
            Cesium.Cartesian3.fromDegrees(lng,
                lat),
            particle.position
        );
        if (distance > RainRadius) {
            particle.endColor.alpha = 0.0;
        } else {
            particle.endColor.alpha = 1.0 / (distance / RainRadius + 0.1);
        }
    };

    var boxsize = new Cesium.Cartesian3(width,width,height*2)

    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(lng,
            lat)
    );

    //scene.primitives.removeAll();
    this.Rainprimitive = scene.primitives.add(
        new Cesium.ParticleSystem({
            modelMatrix: modelMatrix,
            minimumSpeed: -1.0,
            maximumSpeed: 0.0,
            lifetime: 15.0,
            emitter: new Cesium.BoxEmitter(boxsize),
            startScale: 0.5,
            endScale: 1.0,
            image: window.location.origin+"/WeatherImage/Rain.png",
            emissionRate: emissionRate,
            startColor: Cesium.Color.WHITE.withAlpha(0.0),
            endColor: Cesium.Color.WHITE.withAlpha(1.0),
            minimumImageSize: minimumRainImageSize,
            maximumImageSize: maximumRainImageSize,
            //emitterModelMatrix: modelMatrix,
            updateCallback: RainUpdate,
        })
    );

    scene.skyAtmosphere.hueShift = -0.8;
    scene.skyAtmosphere.saturationShift = -0.7;
    scene.skyAtmosphere.brightnessShift = -0.33;
    scene.fog.density = 0.001;
    scene.fog.minimumBrightness = 0.8;
}

Rain.prototype.stopRain = function ()
{
    if (this.viewer && this.Rainprimitive) {
        this.viewer.scene.primitives.remove(this.Rainprimitive)
    }
}

module.exports = Rain;