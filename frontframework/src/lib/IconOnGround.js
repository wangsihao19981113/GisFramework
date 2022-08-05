/**
 * 贴地的图像标签
 * @constructor
 */
function IconOnGround(config){
    this.config = config;
}

/**
 * 展示
 * @param view
 * @param config {{lng:number,lat:number,size:number, rotation: number ,image: string }}
 * @returns {*}
 */
IconOnGround.prototype.show = function(view,config){
    if(this.entity)
    {
        this.eneity.show = true;
    }
    else {
        if(config) {
            this.config = config;
        }
        this.viewer = view || window.viewer;
        this.entity = this.viewer.entities.add({
            name: "Rotating rectangle with rotating texture coordinate",
            position: Cesium.Cartesian3.fromDegrees(this.config.lng, this.config.lat, 0),
            ellipse: {
                semiMinorAxis: this.config.size || 30000,
                semiMajorAxis: this.config.size || 30000,
                rotation: this.config.rotation || 0,
                material: this.config.image,
            },
        });
    }
    return this.entity
};

/**
 * 隐藏
 */
IconOnGround.prototype.hide = function(){
    if(this.entity) {
        this.entity.show = false;
    }
};

/**
 * 销毁
 */
IconOnGround.prototype.destroy = function(){
    this.viewer.entities.remove(this.entity);
    this.entity = null
};

module.exports = IconOnGround;