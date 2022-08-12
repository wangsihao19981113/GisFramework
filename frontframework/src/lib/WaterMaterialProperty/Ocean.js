function addwater(viewer,polygons)
{
    var watermaterial = new Cesium.Material({
        fabric: {
            type: 'Water',
            uniforms: {
                baseWaterColor: new Cesium.Color(89 / 255, 148 / 255, 236 / 255, 0.5), //底色
                blendColor: new Cesium.Color(0.5, 1.0, 0.699, 0.5),
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

    let polygonPrimitive = [];

    for(let i = 0 ; i < polygons.length ; i++) {
        let polygon = polygons[i];
        polygonPrimitive.push(
            new Cesium.GeometryInstance({
                geometry: polygon,
            })
        )
    }



    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: polygonPrimitive,
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: watermaterial
        }),
    }));

};

export{
        addwater
}




