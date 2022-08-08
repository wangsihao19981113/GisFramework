<template>
  <div>
    <CesiumBaseView></CesiumBaseView>
  </div>
</template>

<script>
import CesiumBaseView from "@/components/example/CesiumBaseView";
import {addwater} from "@/lib/WaterMaterialProperty/Ocean";
export default {
  name: "WaterNormal",
  components:{CesiumBaseView},
  mounted() {
    let geometry = new Cesium.PolygonGeometry({
      polygonHierarchy : new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights([117,21,2000,117,22,2000,118,21,2000,118,22,2000])),
      //extrudedHeight: 0,//注释掉此属性可以只显示水面
      //perPositionHeight : true//注释掉此属性水面就贴地了
    })

    var watermaterial = new Cesium.Material({
      fabric: {
        type: 'Water',
        uniforms: {
          baseWaterColor: new Cesium.Color(89 / 255, 148 / 255, 236 / 255, 0.8),
          blendColor: new Cesium.Color(0.5, 1.0, 0.699, 0.8),
          normalMap: "/Image/Example/WaterStyle/waterNormals.jpg",
          frequency: 500.0,
          animationSpeed: 0.05,
          amplitude: 2.0
        },
        fragmentShaderSource: 'varying vec3 v_positionMC;\n\
                varying vec3 v_positionEC;\n\
                varying vec2 v_st;\n\
                \n\
                void main()\n\
                {\n\
                    czm_materialInput materialInput;\n\
                    vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
                #ifdef FACE_FORWARD\n\
                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
                #endif\n\
                    materialInput.s = v_st.s;\n\
                    materialInput.st = v_st;\n\
                    materialInput.str = vec3(v_st, 0.0);\n\
                    materialInput.normalEC = normalEC;\n\
                    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
                    vec3 positionToEyeEC = -v_positionEC;\n\
                    materialInput.positionToEyeEC = positionToEyeEC;\n\
                    czm_material material = czm_getMaterial(materialInput);\n\
                #ifdef FLAT\n\
                    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
                #else\n\
                    gl_FragColor = czm_phong(normalize(positionToEyeEC), material);\n\
                    gl_FragColor.a = 0.5;\n\
                #endif\n\
                }\n\
            '
      }
    });


    addwater(window.viewer,geometry)

    var promise =Cesium.GeoJsonDataSource.load("/geojson/ChinaRiver.geojson");

    promise.then(function(dataSource){

      debugger

      window.viewer.dataSources.add(dataSource);

      var entities = dataSource.entities.values;

      for (let i = 0; i < entities.length; i++) {

        let entity = entities[i];

        entity.polygon.fill=false;//设置无填充后，必须点击到polygon边界才显示提示框

        entity.polygon.outline = true;

        entity.polygon.outlineColor = Cesium.Color.RED;

        entity.polygon.width=5//无效，polygon.width不能超过1

        entity.polygon.material =watermaterial

      }

      window.viewer.zoomTo(dataSource.entities);
    });


    // function createModel(url, height,viewer) {
    //
    //   var position = Cesium.Cartesian3.fromDegrees(
    //       117.50744619,
    //       21.503706,
    //       height
    //   );
    //   //弧度的航向分量。
    //   var heading = Cesium.Math.toRadians(135);
    //   //弧度的螺距分量。
    //   var pitch = 0;
    //   //滚动分量（以弧度为单位）
    //   var roll = 0;
    //   //HeadingPitchRoll旋转表示为航向，俯仰和滚动。围绕Z轴。节距是绕负y轴的旋转。滚动是关于正x轴。
    //   var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    //   var orientation = Cesium.Transforms.headingPitchRollQuaternion(
    //       position,
    //       hpr
    //   );
    //
    //   var entity = viewer.entities.add({
    //     name: url,
    //     position: position,
    //     orientation: orientation,
    //     model: {
    //       uri: url,
    //       //不管缩放如何，模型的最小最小像素大小。
    //       minimumPixelSize: 128,
    //       //模型的最大比例尺大小。 minimumPixelSize的上限。
    //       maximumScale: 20000,
    //     },
    //   });
    //   // 获取或设置相机当前正在跟踪的Entity实例。
    // }
    // createModel("/Model/Cesium_Man.glb", 0,window.viewer);


  }
}
</script>

<style scoped>

</style>