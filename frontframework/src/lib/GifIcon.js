import SuperGif from  'libgif'

function GifIcon(config)
{
    this.config = config;
};

GifIcon.prototype.show = function (viewer)
{
    var self = this;
    this.viewer = viewer
    var  gifDiv = document.createElement('div');
    var  gifImg = document.createElement('img');
    gifImg.setAttribute('rel:animated_src', "/Image/Example/PointStyle/star.gif");
    gifImg.setAttribute('rel:auto_play', '1');
    gifDiv.appendChild(gifImg);
    var superGif = new SuperGif({gif:gifImg})
    superGif.load(()=>{
        self.entity = self.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(self.config.lng,self.config.lat,self.config.height||0),
            label: {
                text: "0.15",
                font: "14px",
            },
            billboard: {
                "position": Cesium.Cartesian3.fromDegrees(113.77, 20.60),
                "image":  new Cesium.CallbackProperty(() => {
                    return superGif.get_canvas().toDataURL("image/png");
                }, false),
                "rotation": self.config.rotation || 0
            }
        });
    })
};

GifIcon.prototype.hide = function (){
    if(this.entity){
        this.entity.show = false;
    }
};

GifIcon.prototype.destroy = function (){
    if(this.entity){
        this.viewer.entities.remove(this.entity)
        this.entity = null;
    }
}

export {
    GifIcon
}