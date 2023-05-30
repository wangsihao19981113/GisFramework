
class Measure {
   constructor(option) {
       this.viewer = option.viewer;
       this._viewer = option.viewer;
       this.options = option;
       this.bMeasuring = false;
       this.measureIds = [];
       this._drawLayer = new Cesium.CustomDataSource('measureLayer')
       this._viewer.dataSources.add(this._drawLayer)
   }

    measureLineGround = function () {
        if (this.bMeasuring)
            return;

        this.bMeasuring = true;
        this._measureLineSpace();
    }

    measureAreaGround = function () {
        if (this.bMeasuring)
            return;
        this.bMeasuring = true;
        this._measureAreaSpace();
    }

    measureArea = function (){
        if (this.bMeasuring)
            return;

        this.bMeasuring = true;
        this.drawAreaMeasureGraphics();
    }

    measureLine = function (){
        if (this.bMeasuring)
            return;

        this.bMeasuring = true;
        this.drawLineMeasureGraphics();
    }

    measureHeight = function (){
        if (this.bMeasuring)
            return;

        this.bMeasuring = true;
        this.drawTrianglesMeasureGraphics();
    }

    /**
     * 删除
     */
    clearResult = function () {
        //删除事先记录的id
        for (var jj = 0; jj < this.measureIds.length; jj++) {
            this.viewer.entities.removeById(this.measureIds[jj]);
        }
        this.measureIds.length = 0;
        //删除测量实体
        this._drawLayer.entities.removeAll()
    }

    /**
     * 结束测量
     */
    _finishMeasure = function () {
        this.bMeasuring = false;
    }

    /**
     * 空间测量距离函数
     */

    _measureLineSpace = function () {
        var me = this;
        var viewer = this.viewer;
        // 取消双击事件-追踪该位置
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
        var positions = [];
        var poly = null;
        var distance = 0;
        var cartesian = null;
        var floatingPoint;
        var labelPt;

        handler.setInputAction(function (movement) {

            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (!Cesium.defined(cartesian)) //跳出地球时异常
                return;
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolyLinePrimitive(positions);
                } else {
                    positions.pop();
                    positions.push(cartesian);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {

            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (!Cesium.defined(cartesian)) //跳出地球时异常
                return;

            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            //记录鼠标单击时的节点位置，异步计算贴地距离
            labelPt = positions[positions.length - 1];
            if (positions.length > 2) {
                getSpaceDistance(positions);
            } else if (positions.length == 2) {
                //在三维场景中添加Label
                floatingPoint = viewer.entities.add({
                    name: '空间距离',
                    position: labelPt,
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                    }
                });
                me.measureIds.push(floatingPoint.id);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (movement) {
            handler.destroy(); //关闭事件句柄
            handler = undefined;
            positions.pop(); //最后一个点无效
            if (positions.length == 1)
                viewer.entities.remove(floatingPoint);
            //记录测量工具状态
            me._finishMeasure();

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        var PolyLinePrimitive = (function () {
            function _(positions) {
                this.options = {
                    name: '直线',
                    polyline: {
                        show: true,
                        positions: [],
                        material: Cesium.Color.RED,
                        width: 5,
                        clampToGround: true
                    }
                };
                this.positions = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.positions;
                };
                //实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                var addedEntity = viewer.entities.add(this.options);
                me.measureIds.push(addedEntity.id);
            };

            return _;
        })();

        //空间两点距离计算函数
        function getSpaceDistance(positions) {
            //只计算最后一截，与前面累加
            //因move和鼠标左击事件，最后两个点坐标重复
            var i = positions.length - 3;
            var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            getTerrainDistance(point1cartographic, point2cartographic);
        }

        function getTerrainDistance(point1cartographic, point2cartographic) {
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            var s = geodesic.surfaceDistance;
            var cartoPts = [point1cartographic];
            for (var jj = 1000; jj < s; jj += 1000) {
                var cartoPt = geodesic.interpolateUsingSurfaceDistance(jj);
                cartoPts.push(cartoPt);
            }
            cartoPts.push(point2cartographic);
            //返回两点之间的距离
            var promise = Cesium.sampleTerrain(viewer.terrainProvider, 8, cartoPts);
            promise.then(function (updatedPositions) {
                // positions height have been updated.
                // updatedPositions is just a reference to positions.
                for (var jj = 0; jj < updatedPositions.length - 1; jj++) {
                    var geoD = new Cesium.EllipsoidGeodesic();
                    geoD.setEndPoints(updatedPositions[jj], updatedPositions[jj + 1]);
                    var innerS = geoD.surfaceDistance;
                    innerS = Math.sqrt(Math.pow(innerS, 2) + Math.pow(updatedPositions[jj + 1].height - updatedPositions[jj].height, 2));
                    distance += innerS;
                }

                //在三维场景中添加Label
                var textDisance = distance.toFixed(2) + "米";
                if (distance > 10000)
                    textDisance = (distance / 1000.0).toFixed(2) + "千米";
                floatingPoint = viewer.entities.add({
                    name: '贴地距离',
                    position: labelPt,
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                    },
                    label: {
                        text: textDisance,
                        font: '18px sans-serif',
                        fillColor: Cesium.Color.GOLD,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(20, -20),
                    }
                });
                me.measureIds.push(floatingPoint.id);
            });
        }

    }

    /**
     * 空间测量面积函数
     */
    _measureAreaSpace = function () {

        // 取消双击事件-追踪该位置
        var me = this;
        let viewer = this.viewer
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        // 鼠标事件
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
        var positions = [];
        var tempPoints = [];
        var polygon = null;
        // var tooltip = document.getElementById("toolTip");
        var cartesian = null;
        var floatingPoint;//浮动点
        // tooltip.style.display = "block";

        handler.setInputAction(function (movement) {
            // tooltip.style.left = movement.endPosition.x + 3 + "px";
            // tooltip.style.top = movement.endPosition.y - 25 + "px";
            // tooltip.innerHTML ='<p>单击开始，右击结束</p>';
            // cartesian = viewer.scene.pickPosition(movement.endPosition);
            //debugger
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if (positions.length >= 2) {
                if (!Cesium.defined(polygon)) {
                    polygon = new PolygonPrimitive(positions);
                } else {
                    positions.pop();
                    // cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                }
                // tooltip.innerHTML='<p>'+distance+'米</p>';
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            // tooltip.style.display = "none";
            // cartesian = viewer.scene.pickPosition(movement.position);

            console.log(movement);
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            //positions.pop();
            positions.push(cartesian);
            //在三维场景中添加点
            var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            var heightString = cartographic.height;
            tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
            floatingPoint = viewer.entities.add({
                name: '多边形面积',
                position: positions[positions.length - 1],
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
            me.measureIds.push(floatingPoint.id);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (movement) {
            handler.destroy();
            positions.pop();
            //tempPoints.pop();
            // viewer.entities.remove(floatingPoint);
            // tooltip.style.display = "none";
            //在三维场景中添加点
            // var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
            // var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            // var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            // var heightString = cartographic.height;
            // tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});

            //记录测量工具状态
            me._finishMeasure();

            var textArea = getArea(tempPoints);
            var floatingText = viewer.entities.add({
                name: '多边形面积',
                position: positions[positions.length - 1],
                // point : {
                //  pixelSize : 5,
                //  color : Cesium.Color.RED,
                //  outlineColor : Cesium.Color.WHITE,
                //  outlineWidth : 2,
                //  heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                // },
                label: {
                    text: textArea,
                    font: '18px sans-serif',
                    fillColor: Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(20, -40),
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
            me.measureIds.push(floatingText.id);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
        var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

        //计算多边形面积
        function getArea(points) {

            var res = 0;
            //拆分三角曲面

            for (var i = 0; i < points.length - 2; i++) {
                var j = (i + 1) % points.length;
                var k = (i + 2) % points.length;
                var totalAngle = Angle(points[i], points[j], points[k]);


                var dis_temp1 = distance(positions[i], positions[j]);
                var dis_temp2 = distance(positions[j], positions[k]);
                res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
            }
            let message = null;

            if (res < 1000000) {
                message = Math.abs(res).toFixed(4) + " 平方米";
            } else {
                message = Math.abs((res / 1000000.0).toFixed(4)) + " 平方公里";
            }

            return message;
        }

        /*角度*/
        function Angle(p1, p2, p3) {
            var bearing21 = Bearing(p2, p1);
            var bearing23 = Bearing(p2, p3);
            var angle = bearing21 - bearing23;
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        }
        /*方向*/
        function Bearing(from, to) {
            var lat1 = from.lat * radiansPerDegree;
            var lon1 = from.lon * radiansPerDegree;
            var lat2 = to.lat * radiansPerDegree;
            var lon2 = to.lon * radiansPerDegree;
            var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
            if (angle < 0) {
                angle += Math.PI * 2.0;
            }
            angle = angle * degreesPerRadian;//角度
            return angle;
        }


        var PolygonPrimitive = (function () {

            function _(positions) {
                this.options = {
                    name: '多边形',
                    polygon: {
                        hierarchy: [],
                        // perPositionHeight : true,
                        material: Cesium.Color.RED.withAlpha(0.5),
                        // heightReference:20000
                    }
                };

                this.hierarchy = { positions };
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.hierarchy;
                };
                //实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                var addedEntity = viewer.entities.add(this.options);
                me.measureIds.push(addedEntity.id);
            };

            return _;
        })();

        function distance(point1, point2) {
            var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
            var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
            /**根据经纬度计算出距离**/
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            var s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            return s;
        }

    }

    transformWGS84ToCartesian = function (position, alt) {
        if (this._viewer) {
            return position
                ? Cesium.Cartesian3.fromDegrees(
                    position.lng || position.lon,
                    position.lat,
                    position.alt = alt || position.alt,
                    Cesium.Ellipsoid.WGS84
                )
                : Cesium.Cartesian3.ZERO
        }
    }
    /***
     * 坐标数组转换 笛卡尔转84
     *
     * @param {Array} WSG84Arr {lng,lat,alt} 地理坐标数组
     * @param {Number} alt 拔高
     * @return {Array} Cartesian3 三维位置坐标数组
     */
    transformWGS84ArrayToCartesianArray= function (WSG84Arr, alt) {
        if (this._viewer && WSG84Arr) {
            var $this = this
            return WSG84Arr
                ? WSG84Arr.map(function (item) { return $this.transformWGS84ToCartesian(item, alt) })
                : []
        }
    }
    /***
     * 坐标转换 笛卡尔转84
     *
     * @param {Object} Cartesian3 三维位置坐标
     *
     * @return {Object} {lng,lat,alt} 地理坐标
     */
    transformCartesianToWGS84= function (cartesian) {
        if (this._viewer && cartesian) {
            var ellipsoid = Cesium.Ellipsoid.WGS84
            var cartographic = ellipsoid.cartesianToCartographic(cartesian)
            return {
                lng: Cesium.Math.toDegrees(cartographic.longitude),
                lat: Cesium.Math.toDegrees(cartographic.latitude),
                alt: cartographic.height
            }
        }
    }
    /***
     * 坐标数组转换 笛卡尔转86
     *
     * @param {Array} cartesianArr 三维位置坐标数组
     *
     * @return {Array} {lng,lat,alt} 地理坐标数组
     */
    transformCartesianArrayToWGS84Array= function (cartesianArr) {
        if (this._viewer) {
            var $this = this
            return cartesianArr
                ? cartesianArr.map(function (item) { return $this.transformCartesianToWGS84(item) })
                : []
        }
    }
    /**
     * 84坐标转弧度坐标
     * @param {Object} position wgs84
     * @return {Object} Cartographic 弧度坐标
     *
     */
    transformWGS84ToCartographic= function (position) {
        return position
            ? Cesium.Cartographic.fromDegrees(
                position.lng || position.lon,
                position.lat,
                position.alt
            )
            : Cesium.Cartographic.ZERO
    }
    /**
     * 拾取位置点
     *
     * @param {Object} px 屏幕坐标
     *
     * @return {Object} Cartesian3 三维坐标
     */
    getCatesian3FromPX= function (px) {

        if (this._viewer && px) {
            var picks = this._viewer.scene.drillPick(px)
            var cartesian = null;
            var isOn3dtiles = false, isOnTerrain = false;
            // drillPick
            for (let i in picks) {
                let pick = picks[i]

                if (pick &&
                    pick.primitive instanceof Cesium.Cesium3DTileFeature
                    || pick && pick.primitive instanceof Cesium.Cesium3DTileset
                    || pick && pick.primitive instanceof Cesium.Model) { //模型上拾取
                    isOn3dtiles = true;
                }
                // 3dtilset
                if (isOn3dtiles) {
                    this._viewer.scene.pick(px) // pick
                    cartesian = this._viewer.scene.pickPosition(px);
                    if (cartesian) {
                        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        if (cartographic.height < 0) cartographic.height = 0;
                        let lon = Cesium.Math.toDegrees(cartographic.longitude)
                            , lat = Cesium.Math.toDegrees(cartographic.latitude)
                            , height = cartographic.height;
                        cartesian = this.transformWGS84ToCartesian({ lng: lon, lat: lat, alt: height })

                    }
                }
            }
            // 地形
            let boolTerrain = this._viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
            // Terrain
            if (!isOn3dtiles && !boolTerrain) {
                var ray = this._viewer.scene.camera.getPickRay(px);
                if (!ray) return null;
                cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);
                isOnTerrain = true
            }
            // 地球
            if (!isOn3dtiles && !isOnTerrain && boolTerrain) {

                cartesian = this._viewer.scene.camera.pickEllipsoid(px, this._viewer.scene.globe.ellipsoid);
            }
            if (cartesian) {
                let position = this.transformCartesianToWGS84(cartesian)
                if (position.alt < 0) {
                    cartesian = this.transformWGS84ToCartesian(position, 0.1)
                }
                return cartesian;
            }
            return false;
        }

    }
    /**
     * 获取84坐标的距离
     * @param {*} positions
     */
    getPositionDistance= function (positions) {
        let distance = 0
        for (let i = 0; i < positions.length - 1; i++) {
            let point1cartographic = this.transformWGS84ToCartographic(positions[i])
            let point2cartographic = this.transformWGS84ToCartographic(positions[i + 1])
            let geodesic = new Cesium.EllipsoidGeodesic()
            geodesic.setEndPoints(point1cartographic, point2cartographic)
            let s = geodesic.surfaceDistance
            s = Math.sqrt(
                Math.pow(s, 2) +
                Math.pow(point2cartographic.height - point1cartographic.height, 2)
            )
            distance = distance + s
        }
        return distance.toFixed(3)
    }
    /**
     * 计算一组坐标组成多边形的面积
     * @param {*} positions
     */
    getPositionsArea= function (positions) {
        let result = 0
        if (positions) {
            let h = 0
            let ellipsoid = Cesium.Ellipsoid.WGS84
            positions.push(positions[0])
            for (let i = 1; i < positions.length; i++) {
                let oel = ellipsoid.cartographicToCartesian(
                    this.transformWGS84ToCartographic(positions[i - 1])
                )
                let el = ellipsoid.cartographicToCartesian(
                    this.transformWGS84ToCartographic(positions[i])
                )
                h += oel.x * el.y - el.x * oel.y
            }
            result = Math.abs(h).toFixed(2)
        }
        return result
    }
    /**
     * 测距
     * @param {*} options
     */
    drawLineMeasureGraphics= function (options = {}) {

        if (this._viewer && options) {

            var positions = [], _lineEntity = new Cesium.Entity(), $this = this, lineObj,
                _handlers = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
            // left
            _handlers.setInputAction(function (movement) {

                var cartesian = $this.getCatesian3FromPX(movement.position);
                if (cartesian && cartesian.x) {
                    if (positions.length == 0) {
                        positions.push(cartesian.clone());
                    }
                    // 添加量测信息点
                    _addInfoPoint(cartesian)
                    positions.push(cartesian);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            _handlers.setInputAction(function (movement) {

                var cartesian = $this.getCatesian3FromPX(movement.endPosition);
                if (positions.length >= 2) {
                    if (cartesian && cartesian.x) {
                        positions.pop();
                        positions.push(cartesian);
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            // right
            _handlers.setInputAction(function (movement) {

                _handlers.destroy()
                _handlers = null
                $this._finishMeasure()
                let cartesian = $this.getCatesian3FromPX(movement.position);
                positions.pop();
                // _addInfoPoint(cartesian)

                if (typeof options.callback === 'function') {

                    options.callback($this.transformCartesianArrayToWGS84Array(positions), lineObj);
                }
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

            _lineEntity.polyline = {
                width: options.width || 5
                , material: options.material || Cesium.Color.BLUE.withAlpha(0.8)
                , clampToGround: options.clampToGround || false
            }
            _lineEntity.polyline.positions = new Cesium.CallbackProperty(function () {
                return positions
            }, false)

            lineObj = this._drawLayer.entities.add(_lineEntity)

            //添加坐标点
            function _addInfoPoint(position) {
                let _labelEntity = new Cesium.Entity()
                _labelEntity.position = position
                _labelEntity.point = {
                    pixelSize: 10,
                    outlineColor: Cesium.Color.BLUE,
                    outlineWidth: 5
                }
                let distance = $this.getPositionDistance($this.transformCartesianArrayToWGS84Array(positions)) * 1
                _labelEntity.label = {
                    text: distance > 1000 ? (distance / 1000).toFixed(4) + '公里' : (distance).toFixed(4) + '米',
                    show: true,
                    showBackground: true,
                    font: '14px monospace',
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(-20, -80) //left top
                }
                $this._drawLayer.entities.add(_labelEntity)
            }
        }

    }
    /**
     * 测面积
     * @param {*} options
     */
    drawAreaMeasureGraphics= function (options = {}) {

        if (this._viewer && options) {

            var positions = [], polygon = new Cesium.PolygonHierarchy(), _polygonEntity = new Cesium.Entity(), $this = this, polyObj = null, _label = '',
                _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
            // left
            _handler.setInputAction(function (movement) {

                var cartesian = $this.getCatesian3FromPX(movement.position);
                if (cartesian && cartesian.x) {
                    if (positions.length == 0) {
                        polygon.positions.push(cartesian.clone())
                        positions.push(cartesian.clone());
                    }
                    positions.push(cartesian.clone());
                    polygon.positions.push(cartesian.clone())
                    _addPoint(cartesian)
                    if (!polyObj) create()
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            // mouse
            _handler.setInputAction(function (movement) {

                var cartesian = $this.getCatesian3FromPX(movement.endPosition);
                // var cartesian = $this._viewer.scene.camera.pickEllipsoid(movement.endPosition, $this._viewer.scene.globe.ellipsoid);
                if (positions.length >= 2) {
                    if (cartesian && cartesian.x) {
                        positions.pop()
                        positions.push(cartesian);
                        polygon.positions.pop()
                        polygon.positions.push(cartesian);
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            // right
            _handler.setInputAction(function (movement) {
                let cartesian = $this.getCatesian3FromPX(movement.endPosition);

                _handler.destroy();

                positions.pop();
                polygon.positions.pop()
                positions.push(positions[0]);
                $this._finishMeasure()
                // 添加信息点
                _addInfoPoint(positions[positions.length-2])
                if (typeof options.callback === 'function') {

                    options.callback($this.transformCartesianArrayToWGS84Array(positions), polyObj);
                }
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

            function create() {
                _polygonEntity.polyline = {
                    width: 3
                    , material: Cesium.Color.BLUE.withAlpha(0.8)
                    , clampToGround: options.clampToGround || false
                }

                _polygonEntity.polyline.positions = new Cesium.CallbackProperty(function () {
                    return positions
                }, false)

                _polygonEntity.polygon = {

                    hierarchy: new Cesium.CallbackProperty(function () {
                        return polygon
                    }, false),

                    material: Cesium.Color.BLUE.withAlpha(0.5)
                    , clampToGround: options.clampToGround || true
                }

                polyObj = $this._drawLayer.entities.add(_polygonEntity)
            }

            function _addPoint(position){
                var _labelEntity = new Cesium.Entity()
                _labelEntity.position = position
                _labelEntity.point = {
                    pixelSize: 10,
                    outlineColor: Cesium.Color.BLUE,
                    outlineWidth: 5
                }
                $this._drawLayer.entities.add(_labelEntity)
            }

            function _addInfoPoint(position) {
                var _labelEntity = new Cesium.Entity()
                _labelEntity.position = position
                _labelEntity.point = {
                    pixelSize: 10,
                    outlineColor: Cesium.Color.BLUE,
                    outlineWidth: 5
                }
                let area = $this.getPositionsArea($this.transformCartesianArrayToWGS84Array(positions));

                _labelEntity.label = {
                    text: area > 1000000 ? (( area / 1000000.0).toFixed(4) + '平方公里') : ((area*1).toFixed(4) + '平方米'),
                    show: true,
                    showBackground: true,
                    font: '14px monospace',
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(-20, -50) //left top
                }
                $this._drawLayer.entities.add(_labelEntity)
            }
        }

    }
    /**
     * 画三角量测
     * @param {*} options
     */
    drawTrianglesMeasureGraphics= function (options = {}) {
        options.style = options.style ||
            {
                width: 3
                , material: Cesium.Color.BLUE.withAlpha(0.5)
            }
        if (this._viewer && options) {

            var _trianglesEntity = new Cesium.Entity(), _tempLineEntity = new Cesium.Entity(), _tempLineEntity2 = new Cesium.Entity(),
                _positions = [], _tempPoints = [], _tempPoints2 = [], $this = this,
                _handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
            // 高度
            function _getHeading(startPosition, endPosition) {
                if (!startPosition && !endPosition) return 0
                if (Cesium.Cartesian3.equals(startPosition, endPosition)) return 0
                let cartographic = Cesium.Cartographic.fromCartesian(startPosition);
                let cartographic2 = Cesium.Cartographic.fromCartesian(endPosition);
                return (cartographic2.height - cartographic.height).toFixed(2)
            }
            // 偏移点
            function _computesHorizontalLine(positions) {
                let cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
                let cartographic2 = Cesium.Cartographic.fromCartesian(positions[1]);
                return Cesium.Cartesian3.fromDegrees(
                    Cesium.Math.toDegrees(cartographic.longitude),
                    Cesium.Math.toDegrees(cartographic.latitude),
                    cartographic2.height
                )
            }
            // left
            _handler.setInputAction(function (movement) {

                var position = $this.getCatesian3FromPX(movement.position);
                if (!position && !position.z) return false
                if (_positions.length == 0) {
                    _positions.push(position.clone())
                    _positions.push(position.clone())
                    _tempPoints.push(position.clone())
                    _tempPoints.push(position.clone())
                } else {
                    _handler.destroy();
                    $this._finishMeasure()
                    if (typeof options.callback === 'function') {

                        options.callback({ e: _trianglesEntity, e2: _tempLineEntity, e3: _tempLineEntity2 });
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            // mouse
            _handler.setInputAction(function (movement) {

                var position = $this.getCatesian3FromPX(movement.endPosition);
                if (position && _positions.length > 0) {
                    //直线
                    _positions.pop()
                    _positions.push(position.clone());
                    let horizontalPosition = _computesHorizontalLine(_positions)
                    //高度
                    _tempPoints.pop()
                    _tempPoints.push(horizontalPosition.clone())
                    //水平线
                    _tempPoints2.pop(), _tempPoints2.pop()
                    _tempPoints2.push(position.clone())
                    _tempPoints2.push(horizontalPosition.clone())
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

            // create entity

            //直线
            _trianglesEntity.polyline = {
                positions: new Cesium.CallbackProperty(function () {
                    return _positions
                }, false),
                ...options.style
            }
            _trianglesEntity.position = new Cesium.CallbackProperty(function () {
                return _positions[0]
            }, false)
            _trianglesEntity.point = {
                pixelSize: 5,
                outlineColor: Cesium.Color.BLUE,
                outlineWidth: 5
            }
            _trianglesEntity.label = {
                text: new Cesium.CallbackProperty(function () {
                    return '直线:' + $this.getPositionDistance($this.transformCartesianArrayToWGS84Array(_positions)) + '米'
                }, false),
                show: true,
                showBackground: true,
                font: '14px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(50, -100) //left top
            }
            //高度
            _tempLineEntity.polyline = {
                positions: new Cesium.CallbackProperty(function () {
                    return _tempPoints
                }, false),
                ...options.style
            }
            _tempLineEntity.position = new Cesium.CallbackProperty(function () {
                return _tempPoints2[1]
            }, false)
            _tempLineEntity.point = {
                pixelSize: 5,
                outlineColor: Cesium.Color.BLUE,
                outlineWidth: 5
            }
            _tempLineEntity.label = {
                text: new Cesium.CallbackProperty(function () {
                    return '高度:' + _getHeading(_tempPoints[0], _tempPoints[1]) + '米'
                }, false),
                show: true,
                showBackground: true,
                font: '14px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(-20, 100) //left top
            }
            //水平
            _tempLineEntity2.polyline = {
                positions: new Cesium.CallbackProperty(function () {
                    return _tempPoints2
                }, false),
                ...options.style
            }
            _tempLineEntity2.position = new Cesium.CallbackProperty(function () {
                return _positions[1]
            }, false)
            _tempLineEntity2.point = {
                pixelSize: 5,
                outlineColor: Cesium.Color.BLUE,
                outlineWidth: 5
            }
            _tempLineEntity2.label = {
                text: new Cesium.CallbackProperty(function () {
                    return '水平距离:' + $this.getPositionDistance($this.transformCartesianArrayToWGS84Array(_tempPoints2)) + '米'
                }, false),
                show: true,
                showBackground: true,
                font: '14px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(-150, -20) //left top
            }
            this._drawLayer.entities.add(_tempLineEntity2)
            this._drawLayer.entities.add(_tempLineEntity)
            this._drawLayer.entities.add(_trianglesEntity)
        }
    }


}

export default Measure;