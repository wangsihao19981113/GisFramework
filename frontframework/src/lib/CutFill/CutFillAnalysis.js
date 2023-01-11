class CutFillAnalysis{
    constructor(viewer,option) {
        this.viewer = viewer;
        this.option = option;
    }
    start(){
        let positions = this.option.positions;
        let CutAndFillResult={
            minHeight:0.0,
            maxHeight:0.0,
            cutVolume:0.0,
            fillVolume:0.0,
            baseArea:0.0,
        }

        if(!this.viewer.terrainProvider.availability){
            return CutAndFillResult ;
        }

        let minHeight = 15000;

        for(let i = 0; i< positions.length;i ++){
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let height = this.viewer.scene.globe.getHeight(cartographic);
            minHeight  = Math.min(minHeight,height);
        }

        this.baseHeight = this.option.baseHeight ? this.option.baseHeight : minHeight;

        let granularity = Math.PI/Math.pow(2,11);
        granularity = granularity/64;

        const polygonGeometry = Cesium.PolygonGeometry.fromPositions({
            positions:positions,
            vertexFormat:Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
            granularity:granularity,
        });

        const geom = Cesium.PolygonGeometry.createGeometry(polygonGeometry);
        let totalCutVolume = 0;
        let totalFillVolume = 0;
        let maxHeight = 0;

        let i0,i1,i2;
        let height1,height2,height3;
        let bottomP1,bottomP2,bottomP3;
        const scratchCartesian = new Cesium.Cartesian3();
        let cartographic;
        let bottomArea = 0.0;
        let totalBottomArea = 0.0;
        let subTrianglePositions;

        for(let i = 0; i< geom.indices.length;i +=3){
            i0 = geom?.indices[i];
            i1 = geom?.indices[i + 1];
            i2 = geom?.indices[i + 2];

            subTrianglePositions = geom.attributes.position.values;
            if(subTrianglePositions){
                scratchCartesian.x = subTrianglePositions[i0 * 3];
                scratchCartesian.y = subTrianglePositions[i0 * 3 + 1];
                scratchCartesian.z = subTrianglePositions[i0 * 3 + 2];
            }

            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian);
            height1 = this.viewer.scene.globe.getHeight(cartographic);

            bottomP1 = Cesium.Cartesian3.fromRadians(cartographic.longitude,cartographic.latitude,0);

            maxHeight = Math.max(maxHeight,height1);
            minHeight = Math.min(minHeight,height1);

            if(subTrianglePositions){
                scratchCartesian.x = subTrianglePositions[i1 * 3];
                scratchCartesian.y = subTrianglePositions[i1 * 3 + 1];
                scratchCartesian.z = subTrianglePositions[i1 * 3 + 2];
            }

            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian);
            height2 = this.viewer.scene.globe.getHeight(cartographic);

            bottomP2 = Cesium.Cartesian3.fromRadians(cartographic.longitude,cartographic.latitude,0);

            maxHeight = Math.max(maxHeight,height2);
            minHeight = Math.min(minHeight,height2);

            if(subTrianglePositions){
                scratchCartesian.x = subTrianglePositions[i2 * 3];
                scratchCartesian.y = subTrianglePositions[i2 * 3 + 1];
                scratchCartesian.z = subTrianglePositions[i2 * 3 + 2];
            }

            cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian);
            height3 = this.viewer.scene.globe.getHeight(cartographic);

            bottomP3 = Cesium.Cartesian3.fromRadians(cartographic.longitude,cartographic.latitude,0);

            maxHeight = Math.max(maxHeight,height3);
            minHeight = Math.min(minHeight,height3);


            bottomArea = this.computeAreaOfTriangle(bottomP1,bottomP2,bottomP3);
            totalBottomArea += bottomArea;

            //计算三角体的平均高度
            const avgCubeHeight = ((height1) + (height2) + (height3))/3;

            //判断是 填方还是挖方

            //如果三角体低于基准面，则需要填方
            if(avgCubeHeight <= this.baseHeight){
                totalFillVolume += bottomArea * (this.baseHeight - avgCubeHeight);
            }else { //否则需要挖方
                totalCutVolume += bottomArea * (avgCubeHeight - this.baseHeight);
            }
            //totalCutVolume += bottomArea * ((height1 as number) - minHeight + (height2 as number) - minHeight + (height3 as number) - minHeight)/3;
        }

        CutAndFillResult.minHeight = minHeight;
        CutAndFillResult.maxHeight = maxHeight;
        CutAndFillResult.cutVolume = totalCutVolume;
        CutAndFillResult.fillVolume = totalFillVolume;
        CutAndFillResult.baseArea = totalBottomArea;

    }

    computeAreaOfTriangle = function (pos1, pos2, pos3) {
        let a = Cesium.Cartesian3.distance(pos1, pos2);
        let b = Cesium.Cartesian3.distance(pos2, pos3);
        let c = Cesium.Cartesian3.distance(pos3, pos1);

        let S = (a + b + c) / 2;

        return Math.sqrt(S * (S - a) * (S - b) * (S - c));
    };
}

export default CutFillAnalysis

