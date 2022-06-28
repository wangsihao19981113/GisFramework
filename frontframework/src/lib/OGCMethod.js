import {GeoJSON, WFS} from 'ol/format';

let GetFeatureByWFS = function(serviceUrl,config)
{
    const featureRequest = new WFS().writeGetFeature(config);
    fetch(serviceUrl, {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest),
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            const features = new GeoJSON().readFeatures(json);
        });
}

let GetIntersectionByWFS = function(serviceUrl,Geojson)
{
    var polygon1=new Polygon([[
        [117.12499999999999, 31.00586290462421],
        [117.12499999999999, 32.091882620021806],
        [116.90551757812499, 32.091882620021806],
        [116.90551757812499, 31.00586290462421],
        [117.12499999999999, 31.00586290462421]]]);

//需要将构建的面要素进行坐标转换，变成一个polygon要素
    polygon1.applyTransform(getTransformss('EPSG:4326','EPSG:3857'));



    const featureRequest = new WFS().writeGetFeature({
        srsName: 'EPSG:3857',
        featureNS: 'http://localhost/map',
        featurePrefix: 'osm',
        featureTypes: ['xxxxx'],
        outputFormat: 'application/json',

        filter:
        // equalToFilter('region', '澳门特别行政区')
        //  andFilter(
        //   likeFilter('SCENEDATE', '2022/3/*'),
        //   equalToFilter('region', '安徽省')
        // ),
            intersects('the_geom',polygon1)
        // equalToFilter('SCENEDATE', '2013/5/21')

    });
    var that = this.map
    fetch('http://localhost:8080/geoserver/map/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest),
    })
        .then(function (response) {
            return response.json()

        })
        .then(function (json) {
            const features = new GeoJSON().readFeatures(json);
            vectorSource.addFeatures(features);
            that.getView().fit(vectorSource.getExtent());


        });
}

var Get

