function addLineFlowMaterialType(){
    class LineFlowMaterialProperty {
        constructor(options) {
            this._definitionChanged = new Cesium.Event();
            this._color = undefined;
            this._speed = undefined;
            this._percent = undefined;
            this._gradient = undefined;
            this.color = options.color;
            this.speed = options.speed;
            this.percent = options.percent;
            this.gradient = options.gradient;
        };

        get isConstant() {
            return false;
        }

        get definitionChanged() {
            return this._definitionChanged;
        }

        getType(time) {
            return Cesium.Material.LineFlowMaterialType;
        }

        getValue(time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
            result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed);
            result.percent = Cesium.Property.getValueOrDefault(this._percent, time, 0.1, result.percent);
            result.gradient = Cesium.Property.getValueOrDefault(this._gradient, time, 0.01, result.gradient);
            return result
        }

        equals(other) {
            return (this === other ||
                (other instanceof LineFlowMaterialProperty &&
                    Cesium.Property.equals(this._color, other._color) &&
                    Cesium.Property.equals(this._speed, other._speed) &&
                    Cesium.Property.equals(this._percent, other._percent) &&
                    Cesium.Property.equals(this._gradient, other._gradient))
            )
        }
    }

    Object.defineProperties(LineFlowMaterialProperty.prototype, {
        color: Cesium.createPropertyDescriptor('color'),
        speed: Cesium.createPropertyDescriptor('speed'),
        percent: Cesium.createPropertyDescriptor('percent'),
        gradient: Cesium.createPropertyDescriptor('gradient'),
    })

    Cesium.LineFlowMaterialProperty = LineFlowMaterialProperty;
    Cesium.Material.LineFlowMaterialProperty = 'LineFlowMaterialProperty';
    Cesium.Material.LineFlowMaterialType = 'LineFlowMaterialType';
    Cesium.Material.LineFlowMaterialSource =
        `
    uniform vec4 color;
    uniform float speed;
    uniform float percent;
    uniform float gradient;
    
    czm_material czm_getMaterial(czm_materialInput materialInput){
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = materialInput.st;
      float t =fract(czm_frameNumber * speed / 1000.0);
      t *= (1.0 + percent);
      float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
      alpha += gradient;
      material.diffuse = color.rgb;
      material.alpha = alpha;
      return material;
    }
    `

    Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlowMaterialType, {
        fabric: {
            type: Cesium.Material.LineFlowMaterialType,
            uniforms: {
                color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
                speed: 10.0,
                percent: 0.1,
                gradient: 0.01
            },
            source: Cesium.Material.LineFlowMaterialSource
        },
        translucent: function (material) {
            return true;
        }
    })
}

function addLineShineMaterialType(){
    function LineShineMaterialProperty(duration, image) {
        this._definitionChanged = new Cesium.Event()
        this.duration = duration
        this.image = image
        this._time = performance.now()
    }
    Object.defineProperties(LineShineMaterialProperty.prototype, {
        isConstant: {
            get: function() {
                return false
            },
        },
        definitionChanged: {
            get: function() {
                return this._definitionChanged
            },
        },
        color: Cesium.createPropertyDescriptor('color'),
        duration: Cesium.createPropertyDescriptor('duration')
    })
    LineShineMaterialProperty.prototype.getType = function(time) {
        return 'LineShine'
    }
    LineShineMaterialProperty.prototype.getValue = function(
        time,
        result
    ) {
        if (!Cesium.defined(result)) {
            result = {}
        }
        result.image = this.image
        result.time =
            ((performance.now() - this._time) % this.duration) / this.duration
        return result
    }
    LineShineMaterialProperty.prototype.equals = function(e) {
        return (
            this === e ||
            (e instanceof LineShineMaterialProperty && this.duration === e.duration)
        )
    }
    Cesium.LineShineMaterialProperty = LineShineMaterialProperty
    Cesium.Material.LineShineType = 'LineShine'
    Cesium.Material.LineShineSource = `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));
        material.alpha = colorImage.a;
        material.diffuse = colorImage.rgb * 1.5 ;
        return material;
        }
    `
    // st :二维纹理坐标
    // czm_material：保存可用于照明的材质信息
    Cesium.Material._materialCache.addMaterial(Cesium.Material.LineShineType, {
        fabric: {
            type: Cesium.Material.LineShineType,
            uniforms: {
                color: new Cesium.Color(1, 0, 0, 0.5),
                image: '',
                transparent: true,
                time: 20,
            },
            source: Cesium.Material.LineShineSource,
        },
        translucent: function(material) {
            return true
        },
    })
}

export{
    addLineFlowMaterialType,
    addLineShineMaterialType
}