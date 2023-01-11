class ContourAnalysis{
    constructor(viewer,options) {
        this.viewer = viewer;
        this.options = options
        this.globe = this.viewer.scene.globe;
    }
    startAnalysis(){
        let contourUniforms = {};
        let material = Cesium.Material.fromType("ElevationContour");
        contourUniforms = material.uniforms;
        contourUniforms.width = this.options.width || 2.0;
        contourUniforms.spacing = this.options.spacing || 150;
        contourUniforms.color = this.options.color ? Cesium.Color.fromCssColorString(this.options.color) : Cesium.Color.RED;
        this.globe.material = material;
    }
    remove(){
        this.globe.material = null;
    }
}

export default ContourAnalysis