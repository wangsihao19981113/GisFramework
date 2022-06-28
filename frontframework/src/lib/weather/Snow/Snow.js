/**
 *
 * @param viewer
 * @param config
 * {
 *     lat:纬度
 *     lng:经度
 *     height:降雪高度
 *     width:降雪宽度
 *     size:雪粒大小
 *     speed:降雪速度 两个负数 前小后大 例如[-300,-30]
 *     emissionRate:降雪密度 默认2000
 * }
 * @constructor
 */

function Snow(viewer,config)
{
    this.config = config;
    this.viewer = viewer;
}

Snow.prototype.startSnow = function ()
{
    var viewer = this.viewer;
    var scene = viewer.scene;
    var lat = this.config.lat ? this.config.lat : Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).latitude);
    var lng = this.config.lng ? this.config.lng : Cesium.Math.toDegrees(viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).longitude);
    var snowParticleSize = this.config.size ? this.config.size : 12.0;
    var snowRadius = 100000.0;
    var speed = this.config.speed ? this.config.speed : [-300, -30.0];
    var emissionRate = this.config.emissionRate ? this.config.emissionRate : 2000;
    if(this.config.width && this.config.height)
    {
        snowRadius = this.config.width > this.config.height ? this.config.width : this.config.height ;
    }
    else
    {
        if(this.config.width)
        {
            snowRadius = this.config.width;
        }
        else if(this.config.height){
            snowRadius = this.config.height;
        }
        else{
        }
    }
    var width = this.config.width ? this.config.width : snowRadius;
    var height = this.config.height ? this.config.height : snowRadius;
    var minimumSnowImageSize = new Cesium.Cartesian2(
        snowParticleSize,
        snowParticleSize
    );
    var maximumSnowImageSize = new Cesium.Cartesian2(
        snowParticleSize * 2.0,
        snowParticleSize * 2.0
    );
    let snowGravityScratch = new Cesium.Cartesian3();


    var  snowUpdate = function (particle, dt) {
        snowGravityScratch = Cesium.Cartesian3.normalize(
            particle.position,
            snowGravityScratch
        );
        Cesium.Cartesian3.multiplyByScalar(
            snowGravityScratch,
            Cesium.Math.randomBetween(speed[0], speed[1]),
            snowGravityScratch
        );
        //求和
        particle.velocity = Cesium.Cartesian3.add(
            particle.velocity,
            snowGravityScratch,
            particle.velocity
        );
        let distance = Cesium.Cartesian3.distance(
            Cesium.Cartesian3.fromDegrees(lng,
                lat),
            particle.position
        );
        if (distance > snowRadius) {
            particle.endColor.alpha = 0.0;
        } else {
            particle.endColor.alpha = 1.0 / (distance / snowRadius + 0.1);
        }
    };

    var boxsize = new Cesium.Cartesian3(width,width,height*2)

    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(lng,
            lat)
    );

    //scene.primitives.removeAll();
    this.snowprimitive = scene.primitives.add(
        new Cesium.ParticleSystem({
            modelMatrix: modelMatrix,
            minimumSpeed: -1.0,
            maximumSpeed: 0.0,
            lifetime: 15.0,
            emitter: new Cesium.BoxEmitter(boxsize),
            startScale: 0.5,
            endScale: 1.0,
            // image: GLOBAL.domainResource + "/static/systems/cloud-map/cesium/bx/lib/weather/Snow/snow.png",
            image: window.location.origin+"/WeatherImage/snow.png",
            emissionRate: emissionRate,
            startColor: Cesium.Color.WHITE.withAlpha(0.0),
            endColor: Cesium.Color.WHITE.withAlpha(1.0),
            minimumImageSize: minimumSnowImageSize,
            maximumImageSize: maximumSnowImageSize,
            //emitterModelMatrix: modelMatrix,
            updateCallback: snowUpdate,
        })
    );

    scene.skyAtmosphere.hueShift = -0.8;
    scene.skyAtmosphere.saturationShift = -0.7;
    scene.skyAtmosphere.brightnessShift = -0.33;
    scene.fog.density = 0.001;
    scene.fog.minimumBrightness = 0.8;
}

Snow.prototype.stopSnow = function ()
{
    if (this.viewer && this.snowprimitive) {
        this.viewer.scene.primitives.remove(this.snowprimitive)
    }
}

module.exports = Snow;