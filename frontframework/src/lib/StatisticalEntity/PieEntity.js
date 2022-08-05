import * as echarts from 'echarts'



/*
    config = {
      data:[
            { value: 1048, name: 'Search Engine', itemStyle: { color: '#ffff00' } },
            { value: 735, name: 'Direct', itemStyle: { color: '#91cc75' } },
            { value: 580, name: 'Email', itemStyle: { color: '#fac858' } },
            { value: 484, name: 'Union Ads', itemStyle: { color: '#ee6666' } },
            { value: 300, name: 'Video Ads', itemStyle: { color:  '#3ba272' } }
        ],
      labelShow:true,
      chartDomWidth:400,
      chartDomHeight:400,
      radius: 100000,
      centerPoint:[112, 23]
    }

    viewer:Cesium视图

    callback:primitive回调函数
 */
function PieEntity2D(config,viewer,callback){
    let chartDom = document.createElement('canvas');
    chartDom.width = config.chartDomWidth;
    chartDom.height = config.chartDomHeight;
    let myChart = echarts.init(chartDom);
    let option;
    option = {
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                colorBy: 'data',
                label: { show: config.labelShow },
                data: config.data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    option && myChart.setOption(option);
    myChart.on('finished', () => {
        let circle = new Cesium.CircleGeometry({
            center: Cesium.Cartesian3.fromDegrees(config.centerPoint[0], config.centerPoint[1]),
            radius: config.radius * 2
        });
        let circleGeometry = Cesium.CircleGeometry.createGeometry(circle);
        let circleGeometryInstance = new Cesium.GeometryInstance({
            geometry: circleGeometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.ORANGE)
            }
        });
        let criclePrimitive = new Cesium.Primitive({
            geometryInstances: [
                circleGeometryInstance
            ],
            appearance: new Cesium.MaterialAppearance({
                material:
                    new Cesium.Material({
                        fabric: {
                            type: 'Image',
                            uniforms: {
                                image: myChart.getDataURL()
                            }
                        }
                    })
            })
        });
        viewer.scene.primitives.add(criclePrimitive)
        myChart.dispose();
        myChart = null;
        chartDom = null;
        callback(criclePrimitive);
    })
}




/*
    config = {
      data:[
            { value: 1048, name: 'Search Engine', itemStyle: { color: '#ffff00' } , label:{height:56000}},
            { value: 735, name: 'Direct', itemStyle: { color: '#91cc75' } label:{height:56000}},
            { value: 580, name: 'Email', itemStyle: { color: '#fac858' } label:{height:56000}},
            { value: 484, name: 'Union Ads', itemStyle: { color: '#ee6666' } label:{height:56000}},
            { value: 300, name: 'Video Ads', itemStyle: { color:  '#3ba272' } label:{height:56000}}
        ],
      labelShow:true,
      radius: 100000,
      height:50000,
      centerPoint:[112, 23]
    }

    viewer:Cesium视图

 */
function PieEntity3D(config,viewer){
    debugger
    let data = config.data;
    //统计总数
    let sum = 0
    for(let i = 0 ; i < data.length ; i++)
    {
        sum = sum + data[i].value;
        data[i]["ar"] = [];
    }

    let anglesum = 0;
    for(let i = 0 ; i < data.length ; i++)
    {
        data[i]["minDegree"] = anglesum;
        anglesum = anglesum + data[i]["value"] / sum * 360;
        data[i]["maxDegree"] = anglesum;
    }

    let point = config.centerPoint;

    let olon = point[0];
    let olat = point[1];

    for(let i=0; i<361; i+=0.01){
        let trackpoint = getPoint(olon,olat,config.radius,i)
        for(let j = 0 ; j < data.length ; j++ )
        {
            if(i>data[j]["minDegree"] && i<=data[j]["maxDegree"])
            {
                data[j]["ar"].push(trackpoint[0],trackpoint[1])
            }
        }
    }
    let datasource = new Cesium.CustomDataSource();

    for(let i = 0 ; i < data.length ; i++)
    {
        data[i]["ar"].push(olon,olat)
        let middlepoint = getPoint(olon,olat,config.radius/2,(data[i]["minDegree"]+data[i]["maxDegree"])/2)
        datasource.entities.add(
            {
                position:Cesium.Cartesian3.fromDegrees(middlepoint[0],middlepoint[1],data[i]["label"]["height"]),
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(
                        data[i]["ar"]
                    ),
                    material:Cesium.Color.fromCssColorString(data[i]["itemStyle"]["color"]),
                    extrudedHeight: config.height,
                },
                label:{
                    show:config.labelShow,
                    text:data[i]["name"]
                }
            }
        )
    }
    viewer.dataSources.add(datasource);
    viewer.zoomTo(datasource.entities);
    function getPoint(olon, olat, radius, angle ){
        let clon = radius * Math.sin(angle*Math.PI/180);
        let clat = radius * Math.cos(angle*Math.PI/180);
        let ec = 6356725 + (6378137 - 6356725) * (90 - olat) / 90;
        let ed = ec * Math.cos(olat * Math.PI /180);
        let jlon = (clon/ed + olon * Math.PI/180)*180/Math.PI;
        let jlat = (clat/ec + olat * Math.PI/180)*180/Math.PI;
        return [jlon,jlat];
    };
    return datasource;
}

export {
    PieEntity2D,
    PieEntity3D
}