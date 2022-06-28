/**
 *
 * @param viewer
 * @param config
 * {
 *     latmax:闪电范围最大纬度
 *     latmin:闪电范围最小纬度
 *     lngmax:闪电范围最大经度
 *     lngmin:闪电范围最小经度
 *     frequency:闪电频率（次/微秒）
 *     remainTime：停留时间（微秒）
 *     height:闪电高度
 * }
 * @constructor
 */
const {randomPosition} = require("@turf/turf");

function Thunder(viewer,config){
    this.viewer = viewer;
    this.config = config;
    this.timerShow = null;
    this.timerDisappear = null;
};

//睡眠时间
Thunder.prototype.sleep = function (delay){
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
};

//按照范围随机生成位置
Thunder.prototype.randomPosition  = function(){
    var latmax = this.config.latmax ? this.config.latmax : 90;
    var latmin = this.config.latmin ? this.config.latmin : -90;
    var lngmax = this.config.lngmax ? this.config.lngmax : 180;
    var lngmin = this.config.lngmin ? this.config.lngmin : -180;
    var lat = latmin + Math.random() * (latmax - latmin);
    var lng = lngmin + Math.random() * (lngmax - lngmin);
    return [lng,lat]
};

//开始打雷
Thunder.prototype.startThunder = function (){
    var self = this;
    var frequency = this.config.frequency ? this.config.frequency : 3000;
    var remainTime = this.config.remainTime ? this.config.remainTime : 1000;
    var height = this.config.height ? this.config.height : 10000;
    var viewer = this.viewer;
    //闪电实体
    var position = this.randomPosition()
    var singleThunder = new Cesium.Entity(
        {
            position: Cesium.Cartesian3.fromDegrees(position[0], position[1] , height) ,
            billboard:{
                "image":window.location.origin+"/WeatherImage/1.png",
                "scaleByDistance":new Cesium.NearFarScalar(1.5e2, 1 , 1.5e7, 0.01),
            }
        }
    )
    this.singleThunder = singleThunder;
    this.timerShow = setInterval(() => {
        var num = Math.ceil(Math.random() * 3)
        singleThunder.billboard.image._value = window.location.origin+"/WeatherImage/"+num+".png";
        position = self.randomPosition()
        singleThunder.position._value = Cesium.Cartesian3.fromDegrees(position[0], position[1] , height)
        viewer.entities.add(singleThunder)
    }, frequency);
    this.sleep(remainTime)
    this.timerDisappear = setInterval(() => {
        viewer.entities.remove(singleThunder)
    }, frequency);

};

//停止打雷
Thunder.prototype.closeThunder = function (){
    if(this.singleThunder)
    {
        this.viewer.entities.remove(this.singleThunder)
    }
    if(this.timerDisappear)
    {
        clearInterval(this.timerDisappear)
    }
    if(this.timerShow)
    {
        clearInterval(this.timerShow)
    }
};

module.exports = Thunder;

