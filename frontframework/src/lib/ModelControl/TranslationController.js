// import EventConstant from '../constant/EventConstant'
class Axis {
    /**
     * 实体
     * @type {Cesium.Primitive}
     */
    primitive = null

    /**
     * 选中状态
     * @type {boolean}
     */
    selected = false

    /**
     * 轴的颜色
     * @type {Cesium.Color}
     * @private
     */
    _color = null

    /**
     * 平移
     * @param moveVector{Cesium.Cartesian3} 移动距离
     * @param unit
     * @param moveLength
     */ s
    translation(moveVector, unit, moveLength) {
        Cesium.Matrix4.multiplyByTranslation(
            this.primitive.modelMatrix,
            Cesium.Cartesian3.multiplyByScalar(
                unit,
                moveLength,
                new Cesium.Cartesian3()
            ),
            this.primitive.modelMatrix
        )
    }

    /**
     * 旋转轴
     * @param {Cesium.Matrix4} rotation
     */
    rotationAxis(rotation) {
        Cesium.Matrix4.multiply(
            this.primitive.modelMatrix,
            rotation,
            this.primitive.modelMatrix
        )
    }

    /**
     * 旋转
     * @param rotationX{Cesium.Matrix4} 旋转角度
     */
    rotation(rotationX) {
        this.instance = []
        if (this.primitive.geometryInstances.constructor === Array) {
            this.instance = this.primitive.geometryInstances
        } else {
            this.instance = [this.primitive.geometryInstances]
        }
        for (let i = 0; i < this.instance.length; i++) {
            Cesium.Matrix4.multiply(
                this.instance[i].modelMatrix,
                rotationX,
                this.instance[i].modelMatrix
            )
        }
    }

    // 复位颜色
    rest() {
        this.selected = false
        this.primitive.appearance.material.uniforms.color = this._color
    }

    // 选中
    select() {
        this.selected = true
        this.primitive.appearance.material.uniforms.color = Cesium.Color.WHITE
    }

    /**
     * 是否是当前轴
     * @param id
     * @return {boolean}
     */
    is(id) {
        return !!this.primitive._instanceIds.find(item => item === id)
    }
}
class ArrowPolyline extends Axis {
    /**
     * 方向
     * @type {Cesium.Cartesian3}
     */
    direction = null

    /**
     * 哪个轴
     * @type {Cesium.Cartesian3}
     */
    unit = null

    /**
     * 箭头线
     */
    constructor(option = {}, viewer) {
        super()
        this.viewer = viewer
        this._color = option.color || Cesium.Color.RED
        this._width = option.width || 3
        this._headWidth = option.headWidth || 2 * this._width
        this._length = option.length || 300
        this._headLength = option.headLength || 10
        this._inverse = option.inverse || false
        this.position = option.position
        this.direction = option.direction
        this.unit = option.unit
        this.headingPitchRoll = option.headingPitchRoll || new Cesium.HeadingPitchRoll()
        const id = option.id
        //这里用的是圆锥几何对象，当topRadius和bottomRadius相同时，它就是一个圆柱
        const line = Cesium.CylinderGeometry.createGeometry(
            new Cesium.CylinderGeometry({
                length: this._length,
                topRadius: this._width,
                bottomRadius: this._width
            })
        )
        const arrow = Cesium.CylinderGeometry.createGeometry(
            new Cesium.CylinderGeometry({
                length: this._headLength,
                topRadius: 0,
                bottomRadius: this._headWidth
            })
        )
        let offset = (this._length + this._headLength) / 2
        if (this._inverse) {
            offset = -offset
        }

        this.translate(arrow, [0, 0, offset])
        const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(this.position,this.headingPitchRoll)
        this.primitive = new Cesium.Primitive({
            modelMatrix: modelMatrix,
            geometryInstances: [
                new Cesium.GeometryInstance({
                    id: id + '-line',
                    geometry: line
                }),
                new Cesium.GeometryInstance({
                    id: id + '-arrow',
                    geometry: arrow
                })
            ],
            appearance: new Cesium.MaterialAppearance({
                material: Cesium.Material.fromType('Color', { color: this._color })
            }),
            asynchronous: false
        })
        // this.viewer.scene.primitives.add(this.primitive)
    }

    /**
     * 按上面的方法画出的箭头在线的中间，我们需要把它平移到线的一端
     */
    translate(geometry, offset) {
        const scratchOffset = new Cesium.Cartesian3()
        if (Array.isArray(offset)) {
            scratchOffset.x = offset[0]
            scratchOffset.y = offset[1]
            scratchOffset.z = offset[2]
        } else {
            Cesium.Cartesian3.clone(offset, scratchOffset)
        }

        for (let i = 0; i < geometry.attributes.position.values.length; i += 3) {
            geometry.attributes.position.values[i] += scratchOffset.x
            geometry.attributes.position.values[i + 1] += scratchOffset.y
            geometry.attributes.position.values[i + 2] += scratchOffset.z
        }
    }
}
class AxisSphere extends Axis {
    id = ''

    /**
     * 轴位置
     * @type {[]}
     */
    position = []

    /**
     * 方向
     * @type {Cesium.Material}
     */
    direction = null

    /**
     * 轴的角度
     * @type {number}
     */
    angle = 0

    /**
     * 构造一个旋转轴
     * @param id{string} id
     * @param radius{number} 半径
     * @param position{Cesium.Material} 位置
     * @param color{Cesium.Color} 颜色
     * @param headingPitchRoll{Cesium.HeadingPitchRoll} 姿态
     */
    constructor(id, radius, position, color,headingPitchRoll) {
        super()
        this.id = id
        this._color = color
        this._calculation(radius, position)
        this._createAxisSphere(id, position, color,headingPitchRoll)
    }

    /**
     * 创建圆环轴
     * @param id{string} id
     * @param matrix{Cesium.Material} 位置
     * @param color{Cesium.Color} 颜色
     * @param headingPitchRoll{Cesium.HeadingPitchRoll} 姿态
     * @private
     */
    _createAxisSphere(id, position, color,headingPitchRoll) {
        const matrix = Cesium.Transforms.headingPitchRollToFixedFrame(position,headingPitchRoll)
        const geometry = new Cesium.PolylineGeometry({
            positions: this.position,
            width: 10
        })
        const instance = new Cesium.GeometryInstance({
            geometry: geometry,
            id: id,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
            }
        })
        this.primitive = new Cesium.Primitive({
            geometryInstances: instance,
            appearance: new Cesium.PolylineColorAppearance({
                translucent: false
            }),
            modelMatrix: matrix
        })
    }

    /**
     * 计算轴圆弧位置
     * @param radius{number}
     */
    _calculation(radius, position) {
        for (let i = 0; i <= 360; i += 3) {
            const sin = Math.sin(Cesium.Math.toRadians(i))
            const cos = Math.cos(Cesium.Math.toRadians(i))
            const x = radius * cos
            const y = radius * sin
            this.position.push(new Cesium.Cartesian3(x, y, 0))
        }
    }

    /**
     * 更新轴的角度
     * @param angle
     */
    updateAngle(angle) {
        this.angle += angle
        if (this.angle >= 360 || this.angle <= 360) {
            this.angle = 0
        }
    }

    /**
     * 选中
     */
    select() {
        this.selected = true
    }

    // 复位颜色
    rest() {
        this.selected = false
    }
}
class TranslationController {
    /**
     * 视图
     * @type {Viewer}
     */
    viewer = null

    /**
     * 模型
     * @type {Cesium.Model}
     */
    model = null

    /**
     * 模型位置
     * @type {Cesium.Cartesian3}
     */
    position = null

    /**
     * z轴
     * @type {ArrowPolyline}
     */
    axisZ = null

    /**
     * x轴
     * @type {ArrowPolyline}
     */
    axisX = null

    /**
     * y轴
     * @type {ArrowPolyline}
     */
    axisY = null

    /**
     * 操作杆集合
     * @type {Cesium.Cesium.PrimitiveCollection}
     */
    primitives = null

    /**
     * 从摄像头发出与视窗上一点相交的射线
     */
    pickRay = new Cesium.Ray()

    /**
     * 当前操作轴
     * @type {ArrowPolyline}
     */
    axis = null

    /**
     * Z旋转轴
     * @type {AxisSphere}
     */
    axisSphereZ = null

    /**
     * X旋转轴
     * @type {AxisSphere}
     */
    axisSphereX = null

    /**
     * Y旋转轴
     * @type {AxisSphere}
     */
    axisSphereY = null

    /**
     * 辅助球
     * @type {Cesium.Primitive}
     */
    auxiliaryBall = null

    constructor(viewer) {
        this.viewer = viewer
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    }

    /**
     * 添加到模型编辑器 *** 注意创建模型时 矩阵必须为本地矩阵, 否则移动方向会是跟随球心矩阵 ***
     * @param model{Cesium.Model}
     */
    add(model) {
        // this.destroy()
        this.model = model
        this.position = Cesium.Matrix4.getTranslation(
            model.modelMatrix,
            new Cesium.Cartesian3()
        )

        // this.position = this.getZVector(model,this.position)

        this.primitives = new Cesium.PrimitiveCollection()
        this.viewer.scene.primitives.add(this.primitives)



        // 创建平移轴
        this._createRod()
        // 旋转平移轴
        this._rotationRod()
        // 添加平移轴
        this._addRod()
        // 创建旋转轴
        this._createSphereAxis()
        // 旋转旋转轴
        this._rotationSphereAxis()
        // 添加旋转轴
        this._addSphereAxis()
        // 添加辅助球
        this._addAuxiliaryBall(
            this.model.boundingSphere.radius * 2,
            Cesium.Color.RED.withAlpha(0.2)
        )

        // 添加监听器
        this._addListener()
    }

    getHeadingPitchRoll(model,position){
        let m1 = Cesium.Transforms.eastNorthUpToFixedFrame(
            position,
            Cesium.Ellipsoid.WGS84,
            new Cesium.Matrix4(),
        );

        let m3 = Cesium.Matrix4.multiply(
            Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()),
            model.modelMatrix,
            new Cesium.Matrix4(),
        );

        //求得旋转矩阵
        let mat3 = Cesium.Matrix4.getMatrix3(m3, new Cesium.Matrix3());
        let q = Cesium.Quaternion.fromRotationMatrix(mat3);
        let hpr = new Cesium.HeadingPitchRoll()
        Cesium.HeadingPitchRoll.fromQuaternion(q,hpr);
        return hpr
    }

    // 添加监听器
    _addListener() {
        this.handler.setInputAction(
            this._clickListener,
            Cesium.ScreenSpaceEventType.LEFT_DOWN
        )
        this.handler.setInputAction(
            this._clickUpListener,
            Cesium.ScreenSpaceEventType.LEFT_UP
        )
        this.handler.setInputAction(
            this._moveListener,
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        )
    }

    // 清除操纵杆, 监听器
    destroy() {
        if (!this.primitives || this.primitives.isDestroyed()) return
        this.primitives.removeAll()
        this.viewer.scene.primitives.remove(this.primitives)
        this._removeListener()
    }

    // 移除监听器
    _removeListener() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    // 创建操作杆
    _createRod() {
        const boundingShpere = this.model.boundingSphere
        const radius = boundingShpere.radius

        let headingPitchRoll = this.getHeadingPitchRoll(this.model,this.position)

        const options = {
            width: radius / 15,
            headWidth: radius / 6,
            length: radius * 5, //坐标轴的长度应该视模型的直径而定
            headLength: radius / 3,
            position: this.position,
            headingPitchRoll:headingPitchRoll
        }

        // 向上的向量
        const vectorNormalUp = new Cesium.Cartesian3()
        const vZ = new Cesium.Cartesian3(0, 0, 1)

        Cesium.Cartesian3.normalize(this.position.clone(), vectorNormalUp)

        // 向右的向量
        const vectorNormalRight = new Cesium.Cartesian3()

        // 由z轴向上 地表向上两个向量叉乘, 则可以得出, 向右的向量
        Cesium.Cartesian3.cross(vZ, vectorNormalUp, vectorNormalRight)

        Cesium.Cartesian3.normalize(vectorNormalRight, vectorNormalRight)

        // 向前的向量
        const vectorNormalFront = new Cesium.Cartesian3()
        Cesium.Cartesian3.cross(
            vectorNormalRight,
            vectorNormalUp,
            vectorNormalFront
        )
        Cesium.Cartesian3.multiplyByScalar(vectorNormalFront, -1, vectorNormalFront)
        Cesium.Cartesian3.normalize(vectorNormalFront, vectorNormalFront)
        this.axisX = new ArrowPolyline({
            id: 'axisX',
            color: Cesium.Color.GREEN,
            direction: vectorNormalRight,
            unit: Cesium.Cartesian3.UNIT_X,
            ...options
        })
        this.axisZ = new ArrowPolyline({
            id: 'axisZ',
            color: Cesium.Color.RED,
            direction: vectorNormalUp,
            unit: Cesium.Cartesian3.UNIT_Z,
            ...options
        })
        this.axisY = new ArrowPolyline({
            id: 'axisY',
            color: Cesium.Color.BLUE,
            direction: vectorNormalFront,
            unit: Cesium.Cartesian3.UNIT_Y,
            ...options
        })
    }

    // 添加操作杆
    _addRod() {
        this.primitives.add(this.axisZ.primitive)
        this.primitives.add(this.axisX.primitive)
        this.primitives.add(this.axisY.primitive)
    }

    // 初始化操作杆
    _rotationRod() {
        const mx = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90))
        const rotationX = Cesium.Matrix4.fromRotationTranslation(mx)
        this.axisX.rotation(rotationX)
        const my = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90))
        const rotationY = Cesium.Matrix4.fromRotationTranslation(my)
        this.axisY.rotation(rotationY)
    }

    // 点击监听
    _clickListener = () => {
        if (this.translationAxisIsSelected() || this.rotationAxisIsSelected()) {
            this.viewer.scene.screenSpaceCameraController.enableRotate = false
            this.left_press = true
        }
    }

    /**
     * 平移轴被选中
     * @return {boolean}
     */
    translationAxisIsSelected() {
        return this.axisX.selected || this.axisY.selected || this.axisZ.selected
    }

    /**
     * 旋转轴被选中
     * @return {boolean}
     */
    rotationAxisIsSelected() {
        return (
            this.axisSphereZ.selected ||
            this.axisSphereX.selected ||
            this.axisSphereY.selected
        )
    }

    _clickUpListener = () => {
        this.axis = null
        this.viewer.scene.screenSpaceCameraController.enableRotate = true
        this.auxiliaryBall.show = false
        this.left_press = false
    }

    // 移动监听
    _moveListener = e => {
        const pick = this.viewer.scene.pick(e.endPosition)
        // 如果鼠标左键没有按下
        if (!this.left_press) {
            this._resetMaterial()
        } else if (this.axis && this.left_press) {
            if (this.translationAxisIsSelected()) {
                this._precessTranslation(e, this.axis)
            } else if (
                this.rotationAxisIsSelected() ||
                (pick && pick.id === 'auxiliaryBall') ||
                this.axis.is(pick.id)
            ) {
                this._precessRotation(e, this.axis)
            }
            return
        }
        if (pick && pick.id) {
            this._resetMaterial()
            let axis = null
            if (this.axisX.is(pick.id)) {
                axis = this.axisX
            } else if (this.axisY.is(pick.id)) {
                axis = this.axisY
            } else if (this.axisZ.is(pick.id)) {
                axis = this.axisZ
            } else if (this.axisSphereX.is(pick.id)) {
                axis = this.axisSphereX
            } else if (this.axisSphereY.is(pick.id)) {
                axis = this.axisSphereY
            } else if (this.axisSphereZ.is(pick.id)) {
                axis = this.axisSphereZ
            }
            if (axis) {
                this.axis = axis
                this.axis.select()
                if (this.rotationAxisIsSelected()) {
                    this.auxiliaryBall.show = false
                }
            }
        }
    }

    /**
     * 处理平移
     * @param e
     * @param axis{AxisSphere}
     * @private
     */
    _precessRotation(e, axis) {
        this.auxiliaryBall.show = false

        // 通过射线, 获取在平面上的位置
        this.viewer.camera.getPickRay(e.startPosition, this.pickRay)
        const vtStart = this.getPlaneRotationPosition(
            this.position,
            this.viewer.camera.position.clone(),
            this.pickRay,
            axis.direction
        )
        this.viewer.camera.getPickRay(e.endPosition, this.pickRay)
        const vtEnd = this.getPlaneRotationPosition(
            this.position,
            this.viewer.camera.position.clone(),
            this.pickRay,
            axis.direction
        )

        // 利用叉乘性质判断方向
        const cartesian = Cesium.Cartesian3.cross(
            vtStart,
            vtEnd,
            new Cesium.Cartesian3()
        )
        console.log(cartesian)
        console.log(axis.direction)
        const angle = Cesium.Math.toDegrees(
            Cesium.Cartesian3.angleBetween(cartesian, axis.direction)
        )
        let rotateAngleInRadians = Cesium.Cartesian3.angleBetween(vtEnd, vtStart)
        if (angle > 1) {
            rotateAngleInRadians = -rotateAngleInRadians
        }

        let mx = null
        let my = null
        let mz = null
        if (axis.id === 'axisSphereX') {
            mx = Cesium.Matrix3.fromRotationZ(rotateAngleInRadians)
            my = Cesium.Matrix3.fromRotationX(rotateAngleInRadians)
            // my = Cesium.Matrix3.fromRotationX(rotateAngleInRadians)
            mz = Cesium.Matrix3.fromRotationX(rotateAngleInRadians)
        } else if (axis.id === 'axisSphereY') {
            this.hasYRotate = true
            mx = Cesium.Matrix3.fromRotationY(rotateAngleInRadians)
            my = Cesium.Matrix3.fromRotationZ(-rotateAngleInRadians) //负的
            mz = Cesium.Matrix3.fromRotationY(rotateAngleInRadians)
        } else if (axis.id === 'axisSphereZ') {
            mx = Cesium.Matrix3.fromRotationX(-rotateAngleInRadians)
            my = Cesium.Matrix3.fromRotationY(rotateAngleInRadians)
            mz = Cesium.Matrix3.fromRotationZ(rotateAngleInRadians)
        }
        const rotationX = Cesium.Matrix4.fromRotationTranslation(mx)
        const rotationY = Cesium.Matrix4.fromRotationTranslation(my)
        const rotationZ = Cesium.Matrix4.fromRotationTranslation(mz)
        this.rotation(rotationX, rotationY, rotationZ, axis, rotateAngleInRadians)
    }

    /**
     * 旋转
     * @param rotationX{Cesium.Matrix4} 旋轉角度
     * @param axis{AxisSphere}
     * @param rotateAngleInRadians
     */
    rotation(rotationX, rotationY, rotationZ, axis, rotateAngleInRadians) {
        this.axisSphereX.rotationAxis(rotationX)
        this.axisSphereY.rotationAxis(rotationY)
        this.axisSphereZ.rotationAxis(rotationZ)

        this.axisX.rotationAxis(rotationX)
        this.axisY.rotationAxis(rotationY)
        this.axisZ.rotationAxis(rotationZ)
        this._rotateVectorByAxisForAngle(
            this.axisX.direction,
            axis.direction,
            rotateAngleInRadians
        )
        this._rotateVectorByAxisForAngle(
            this.axisY.direction,
            axis.direction,
            rotateAngleInRadians
        )
        this._rotateVectorByAxisForAngle(
            this.axisZ.direction,
            axis.direction,
            rotateAngleInRadians
        )
        Cesium.Matrix4.multiply(
            this.model.modelMatrix,
            rotationZ,
            this.model.modelMatrix
        )
        Cesium.Matrix4.multiply(
            this.auxiliaryBall.modelMatrix,
            rotationZ,
            this.auxiliaryBall.modelMatrix
        )
        // const number = Cesium.Math.toDegrees(rotateAngleInRadians)
        // axis.updateAngle(number)
    }

    /**
     * 处理选中
     * @param e{{message: {startPosition: Cesium.Cartesian2, endPosition: Cesium.Cartesian2}}}
     * @param axis{ArrowPolyline}
     * @private
     */
    _precessTranslation(e, axis) {
        this.auxiliaryBall.show = false

        // 基于射线, 获取平面上的位置
        this.viewer.camera.getPickRay(e.startPosition, this.pickRay)
        const startPosition = this.getPlanePosition(
            this.position,
            this.viewer.camera.position.clone(),
            this.pickRay,
            axis.direction
        )
        this.viewer.camera.getPickRay(e.endPosition, this.pickRay)
        const endPosition = this.getPlanePosition(
            this.position,
            this.viewer.camera.position.clone(),
            this.pickRay,
            axis.direction
        )

        // 获取移动长度, 并对该轴点乘, 获取在该轴实际移动的距离
        const moveVector = new Cesium.Cartesian3()
        Cesium.Cartesian3.subtract(endPosition, startPosition, moveVector)
        const moveLength = Cesium.Cartesian3.dot(axis.direction, moveVector)
        this.translation(moveVector, axis.unit, moveLength)
    }

    /**
     * 平移
     * @param moveVector
     * @param unit
     * @param moveLength
     */
    translation(moveVector, unit, moveLength) {
        //由于X、Y移动轴旋转过，所以坐标轴方向发生了改变，例如本地坐标的x轴是X移动轴的y轴方向，所以他们移动的轴需要修改
        let mX = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-90.0))
        let mY = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(-90.0))
        this.axisX.translation(
            moveVector,
            Cesium.Matrix3.multiplyByVector(mX, unit, new Cesium.Cartesian3()),
            moveLength
        )
        this.axisY.translation(
            moveVector,
            Cesium.Matrix3.multiplyByVector(mY, unit, new Cesium.Cartesian3()),
            moveLength
        )

        // this.axisX.translation(moveVector, unit, moveLength)
        // this.axisY.translation(moveVector, unit, moveLength)
        this.axisZ.translation(moveVector, unit, moveLength)
        this.axisSphereX.translation(
            moveVector,
            Cesium.Matrix3.multiplyByVector(mX, unit, new Cesium.Cartesian3()),
            moveLength
        )
        this.axisSphereY.translation(
            moveVector,
            Cesium.Matrix3.multiplyByVector(mY, unit, new Cesium.Cartesian3()),
            moveLength
        )
        // this.axisSphereX.translation(moveVector, unit, moveLength)
        // this.axisSphereY.translation(moveVector, unit, moveLength)
        this.axisSphereZ.translation(moveVector, unit, moveLength)

        // 更新模型位置
        Cesium.Matrix4.multiplyByTranslation(
            this.model.modelMatrix,
            Cesium.Cartesian3.multiplyByScalar(
                unit,
                moveLength,
                new Cesium.Cartesian3()
            ),
            this.model.modelMatrix
        )
        // Cesium.Matrix4.getTranslation(this.model.modelMatrix, this.position)

        // 辅助球的坐标系为球心坐标, 需要获取本地矩阵移动距离, 修改辅助球位置
        Cesium.Matrix4.multiplyByTranslation(
            this.auxiliaryBall.modelMatrix,
            Cesium.Cartesian3.multiplyByScalar(
                unit,
                moveLength,
                new Cesium.Cartesian3()
            ),
            this.auxiliaryBall.modelMatrix
        )
    }

    // 复位所有的材质
    _resetMaterial() {
        this.axisX.rest()
        this.axisY.rest()
        this.axisZ.rest()
        this.axisSphereY.rest()
        this.axisSphereZ.rest()
        this.axisSphereX.rest()
        this.auxiliaryBall.show = false
    }

    // 创建 旋转轴
    _createSphereAxis() {
        const radius = this.model.boundingSphere.radius * 2
        let headingPitchRoll = this.getHeadingPitchRoll(this.model,this.position)
        this.axisSphereZ = new AxisSphere(
            'axisSphereZ',
            radius,
            this.position,
            Cesium.Color.RED,
            headingPitchRoll
        )
        this.axisSphereX = new AxisSphere(
            'axisSphereX',
            radius,
            this.position,
            Cesium.Color.GREEN,
            headingPitchRoll
        )
        this.axisSphereY = new AxisSphere(
            'axisSphereY',
            radius,
            this.position,
            Cesium.Color.BLUE,
            headingPitchRoll
        )
        this.axisSphereZ.direction = this.axisZ.direction
        this.axisSphereX.direction = this.axisX.direction
        this.axisSphereY.direction = this.axisY.direction
    }

    // 旋转 旋转轴
    _rotationSphereAxis() {
        const mx = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90))
        const rotationX = Cesium.Matrix4.fromRotationTranslation(mx)
        this.axisSphereX.rotation(rotationX)
        const my = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90))
        const rotationY = Cesium.Matrix4.fromRotationTranslation(my)
        this.axisSphereY.rotation(rotationY)
    }

    // 添加旋转轴
    _addSphereAxis() {
        this.primitives.add(this.axisSphereZ.primitive)
        this.primitives.add(this.axisSphereY.primitive)
        this.primitives.add(this.axisSphereX.primitive)
    }

    /**
     * 添加辅助球  *** 选中时高亮 ***
     * @param {number} radius
     * @param {Cesium.Color} color
     */
    _addAuxiliaryBall(radius, color) {
        const cartesian3 = this.extended(this.position, -radius)
        let headingPitchRoll = this.getHeadingPitchRoll(this.model,cartesian3)
        const modelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.headingPitchRollToFixedFrame(cartesian3,headingPitchRoll),
            new Cesium.Cartesian3(0.0, 0.0, radius),
            new Cesium.Matrix4()
        )

        const sphereGeometry = new Cesium.SphereGeometry({
            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
            radius: radius
        })
        const sphereInstance = new Cesium.GeometryInstance({
            id: 'auxiliaryBall',
            geometry: sphereGeometry,
            modelMatrix: modelMatrix,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
            }
        })

        this.auxiliaryBall = this.primitives.add(
            new Cesium.Primitive({
                geometryInstances: sphereInstance,
                appearance: new Cesium.PerInstanceColorAppearance({
                    translucent: true,
                    closed: true
                })
            })
        )
        this.auxiliaryBall.show = false
    }

    /**
     * 通过轴旋转角度
     * @param vector
     * @param axis
     * @param angle
     */
    _rotateVectorByAxisForAngle(vector, axis, angle) {
        const rotateQuaternion = this.normalizingQuaternion(
            Cesium.Quaternion.fromAxisAngle(axis, angle, new Cesium.Quaternion())
        )
        const quaternion = this.cartesian3ToQuaternion(vector)
        Cesium.Quaternion.multiply(
            Cesium.Quaternion.multiply(rotateQuaternion, quaternion, quaternion),
            Cesium.Quaternion.inverse(rotateQuaternion, new Cesium.Quaternion()),
            quaternion
        )
        vector.x = quaternion.x
        vector.y = quaternion.y
        vector.z = quaternion.z
        return quaternion
    }

    /**
     * 获取平面上的位置
     * @param position{Cesium.Cartesian3} 模型位置
     * @param cameraPosition{Cesium.Cartesian3} 相机位置
     * @param pickRay{Cesium.Ray} 从相机到屏幕的射线
     * @param axisDirection{Cesium.Cartesian3} 轴的向量
     */
    getPlanePosition(position, cameraPosition, pickRay, axisDirection) {
        // 第一步, 获取相机在轴上的投影
        const cartesian3 = Cesium.Cartesian3.subtract(
            cameraPosition,
            position,
            new Cesium.Cartesian3()
        ) //c1 相机位置到模型位置向量
        const length = Cesium.Cartesian3.dot(cartesian3, axisDirection) //点乘 向量到本地坐标轴的投影长度
        // 获取轴上投影的位置, 以相机到这个位置, 为平面法线
        Cesium.Cartesian3.multiplyByScalar(axisDirection, length, cartesian3) //c2 向量：方向：坐标轴、长度：相机位置到模型位置在轴上的投影长度
        Cesium.Cartesian3.add(position, cartesian3, cartesian3) //c3 模型位置 加 相机位置到模型位置在轴上的投影长度本地坐标轴方向向量
        const pn = Cesium.Cartesian3.subtract(
            cameraPosition,
            cartesian3,
            new Cesium.Cartesian3()
        ) //相机位置与
        // 获取单位向量, 射线向投影向量投影
        Cesium.Cartesian3.normalize(pn, cartesian3) //c4
        const number = Cesium.Cartesian3.dot(pickRay.direction, cartesian3)
        // 获取射线与平面相交点
        const number1 = Cesium.Cartesian3.magnitude(pn)
        Cesium.Cartesian3.multiplyByScalar(
            pickRay.direction,
            -number1 / number,
            cartesian3
        ) //c5
        return cartesian3
    }

    /**
     * 获取平面上的位置
     * @param position{Cesium.Cartesian3} 模型位置
     * @param cameraPosition{Cesium.Cartesian3} 相机位置
     * @param pickRay{Cesium.Ray} 从相机到屏幕的射线
     * @param axisDirection{Cesium.Cartesian3} 轴的向量
     */
    getPlaneRotationPosition(position, cameraPosition, pickRay, axisDirection) {
        const cartesian3 = Cesium.Cartesian3.subtract(
            cameraPosition,
            position,
            new Cesium.Cartesian3()
        ) //c1
        const length = Cesium.Cartesian3.dot(cartesian3, axisDirection)
        const number = Cesium.Cartesian3.dot(pickRay.direction, axisDirection)
        Cesium.Cartesian3.multiplyByScalar(
            pickRay.direction,
            -length / number,
            cartesian3
        ) //c2
        Cesium.Cartesian3.add(cameraPosition, cartesian3, cartesian3)
        return Cesium.Cartesian3.subtract(
            cartesian3,
            position,
            new Cesium.Cartesian3()
        )
    }
    //数学函数
    moduloQuaternion = quaternion => {
        // N(q) = |q| = x*x + y*y + z*z + w*w
        return (
            quaternion.x * quaternion.x +
            quaternion.y * quaternion.y +
            quaternion.z * quaternion.z +
            quaternion.w * quaternion.w
        )
    }

    cartesian3ToQuaternion = cartesian3 => {
        return new Cesium.Quaternion(cartesian3.x, cartesian3.y, cartesian3.z, 0)
    }

    normalizingQuaternion = quaternion => {
        // Normalize( q ) = q/ |q| = q / (x*x + y*y + z*z + w*w)
        return Cesium.Quaternion.divideByScalar(
            quaternion,
            this.moduloQuaternion(quaternion),
            quaternion
        )
    }
    extended(cartesian, length) {
        const result = new Cesium.Cartesian3()
        Cesium.Cartesian3.normalize(cartesian, result)
        Cesium.Cartesian3.add(
            cartesian,
            Cesium.Cartesian3.multiplyByScalar(result, length, result),
            result
        )
        return result
    }
}

export default TranslationController