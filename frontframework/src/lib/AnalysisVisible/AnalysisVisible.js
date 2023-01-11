class AnalysisVisible{
    constructor(viewer) {
        this.viewer = viewer;
        this.datasoure = new Cesium.CustomDataSource("analysisvisiable");
        this.viewer.dataSources.add(this.datasoure)
    }

    startAnalysis(positions){
        // 计算射线的方向
        let direction = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.subtract(
                positions[1],
                positions[0],
                new Cesium.Cartesian3()
            ),
            new Cesium.Cartesian3()
        );
        // 建立射线
        let ray = new Cesium.Ray(positions[0], direction);
        // 计算交互点，返回第一个
        let result = this.viewer.scene.pickFromRay(ray);
        // console.log(result)
        if (Cesium.defined(result) && Cesium.defined(result.object)) {
            this.drawLine(result.position, positions[0], Cesium.Color.GREEN); // 可视区域
            this.drawLine(result.position, positions[1], Cesium.Color.RED); // 不可视区域
        }
        else {
            this.drawLine(positions[0], positions[1], Cesium.Color.GREEN);
        }
    }

    drawLine(leftPoint, secPoint, color) {
        this.datasoure.entities.add({
            polyline: {
                positions: [leftPoint, secPoint],
                width: 2,
                material: color,
                depthFailMaterial: color
            }
        });
    }

    clear(){
        this.datasoure.entities.removeAll();
    }

    remove(){
        this.datasoure.entities.removeAll();
        this.viewer.dataSources.remove(this.datasoure)
    }

}

export default  AnalysisVisible