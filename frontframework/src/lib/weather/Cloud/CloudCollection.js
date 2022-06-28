/**
 * 云集
 * @param viewer
 * @constructor
 */

var Cloud = require("./Cloud")

function CloudCollection(viewer){
    this.viewer = viewer;
    this.CloudCollection = new Cesium.CustomDataSource();
}

CloudCollection.prototype.addCloud = function(cloud)
{
    var couldEntity = cloud.entity
    this.CloudCollection.entities.add(couldEntity)
}

/**
 * 随机制造云朵
 * @param number 数量
 * @param config 限定的一些云朵条件
 */
CloudCollection.prototype.randomMakeCloud = function (number,config)
{
    for(var i = 0 ; i < number ; i++)
    {
        var cloud = new Cloud(this.viewer,config)
        cloud.createCloud()
        this.addCloud(cloud)
    }
}

CloudCollection.prototype.addTo = function(viewer)
{
    if(viewer)
    {
        this.viewer = viewer;
        let dataSource = viewer.dataSources;
        if (!dataSource.contains(this.CloudCollection)) {
            dataSource.add(this.CloudCollection);
        }
    }
    else if(this.viewer){
        let dataSource = this.viewer.dataSources;
        if (!dataSource.contains(this.CloudCollection)) {
            dataSource.add(this.CloudCollection);
        }
    }
    else{
        console.log("没有传入图层参数")
    }
}

CloudCollection.prototype.close = function ()
{
    if(this.viewer)
    {
        this.viewer.dataSources.remove(this.CloudCollection);
    }
}

module.exports = CloudCollection
