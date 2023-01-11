import * as turf from '@turf/turf';

class BufferAnalysis{
    constructor(viewer) {
        this.viewer = viewer
    }
    /**
     * 添加点缓冲
     * @param point{Array} point[0]为经度 point[1]为纬度
     */
    addPointBuffer(point,distance){
        let pointF = turf.point(point);
        let buffered = turf.buffer(pointF, distance, { units: 'meters' });
        let coordinates = buffered.geometry.coordinates;
        let points = coordinates[0];
        let degreesArray = this.pointsToDegreesArray(points);
        let buffer_polygon = this.addBufferPolyogn(Cesium.Cartesian3.fromDegreesArray(degreesArray));
        return buffer_polygon
    }

    /**
     * 添加线缓冲
     * @param point{Array} 点集合[[],[]]
     */
    addPolylineBuffer(points,distance) {
        let polylineF = turf.lineString(points);
        let buffered = turf.buffer(polylineF, distance, { units: 'meters' });
        let coordinates = buffered.geometry.coordinates;
        points = coordinates[0];
        let degreesArray = this.pointsToDegreesArray(points);
        let buffer_polygon = this.addBufferPolyogn(Cesium.Cartesian3.fromDegreesArray(degreesArray));
        return buffer_polygon
    }

    /**
     * 添加面缓冲
     * @param point {Array} 点集合[[],[]]
     */
    addPolygonBuffer(points,distance) {
        let polygonF = turf.polygon([points]);
        let buffered = turf.buffer(polygonF, distance, { units: 'meters' });
        let coordinates = buffered.geometry.coordinates;
        points = coordinates[0];
        let degreesArray = this.pointsToDegreesArray(points);
        let buffer_polygon = this.addBufferPolyogn(Cesium.Cartesian3.fromDegreesArray(degreesArray));
        return buffer_polygon
    }

    /**
     * 添加缓冲面
     * @param positions
     */
    addBufferPolyogn(positions) {
        let polygon = this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(positions),
                material: Cesium.Color.RED.withAlpha(0.6),
                classificationType: Cesium.ClassificationType.BOTH
            },
        });
        return polygon
    }

    removeBufferPolygon(buffer_polygon){
        if (buffer_polygon){
            this.viewer.entities.remove(buffer_polygon)
        }
    }

    /**
     * 格式转换
     * @param points 点集
     * @returns {*[]}
     */
    pointsToDegreesArray(points) {
        let degreesArray = [];
        points.map(item => {
            degreesArray.push(item[0]);
            degreesArray.push(item[1]);
        });
        return degreesArray;
    }
}

export default BufferAnalysis