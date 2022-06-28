/**
 * 获取当前相机姿态信息
 * 包括经度、纬度、高程、Heading、Pitch、Roll
 * @param viewer
 */
let getCameraInfo = (viewer) => {
    if (viewer && viewer.camera && viewer.camera.position && viewer.camera.heading) {
        let p = toDegrees(viewer.camera.position);
        let heading = Cesium.Math.toDegrees(viewer.camera.heading);
        let pitch = Cesium.Math.toDegrees(viewer.camera.pitch);
        let roll = Cesium.Math.toDegrees(viewer.camera.roll);
        return {
            heading: parseFloat(heading).toFixed(5),
            pitch: parseFloat(pitch).toFixed(5),
            roll: parseFloat(roll).toFixed(5),
            lng: parseFloat(p.lng).toFixed(7),
            lat: parseFloat(p.lat).toFixed(7),
            alt: parseFloat(p.alt).toFixed(2)
        }
    } else {
        throw new Error("Error in Parameter!");
    }
};

/**
 * 距离（米）转换为纬度  一米对应的纬度为定值
 * @param meter 距离多少米
 * @returns {number}
 */
let meter2Lat = (meter) => {
    if (!meter) {
        throw new Error("Error in Parameter!");
    }
    let pi = Math.PI;
    let lngInMeter = (6371 * 2 * pi) / 360;
    return (meter / lngInMeter) / 1000;
};

/**
 * 距离（米）转换为经度  不同纬度下一米对应的经度不同
 * @param meter 距离
 * @param lat 所在纬度
 * @returns {number}
 */
let meter2Lng = (meter, lat) => {
    if ((!meter) || (!lat)) {
        throw new Error("Error in Parameter!");
    }
    let pi = Math.PI;
    let latInMeter = (Math.cos(lat * pi / 180) * 6371 * 2 * pi) / 360;
    return (meter / latInMeter) / 1000;
};

/**
 * 判断该点是否是经纬度或者笛卡尔坐标
 * @param point
 */
let isDegreesOrCartesian = (point) => {
    if (!point) {
        throw new Error("Error in Parameter!");
    }
    if (('number' === typeof point.x) && ('number' === typeof point.y) && ('number' === typeof point.z)) {
        return true
    }
    if (('number' === typeof point.lng) && ('number' === typeof point.lat)) {
        return true
    }
    return false;
};

/**
 * 转化成经纬度
 * @param point
 */
let toDegrees = (point) => {
    if (isDegreesOrCartesian(point)) {
        /**
         * 笛卡尔坐标转地理坐标
         * @param point
         */
        let toDegreesFromCartesian = (point) => {
            let cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
            return {
                lng: parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8)),
                lat: parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8)),
                alt: parseFloat(cartographic.height.toFixed(8))
            };

        };
        if (point.x) {
            point = toDegreesFromCartesian(point);
        }
        return point;
    }
};

/**
 * 转化成笛卡尔坐标
 * @param point
 */
let toCartesian = (point) => {
    if (isDegreesOrCartesian(point)) {
        /**
         * 地理坐标转笛卡尔坐标
         * @param point
         */
        let toCartesianFromDegrees = (point) => {
            return Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt || 0);
        };
        if (point.lng) {
            point = toCartesianFromDegrees(point);
        }
        return point;
    }
};

/**
 * 转屏幕坐标
 * @param point
 * @param viewer
 */
let toWindowCoordinates = (point, viewer) => {
    if (viewer && point && point.x && point.y && point.z) {
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, point);
    } else if (viewer && point.lng && point.lat && point.alt) {
        return Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, toCartesianFromDegrees(point));
    } else {
        throw new Error("Error in Parameter!");
    }
};

/**
 * 点到线段的最短距离
 * @param a 线段端点
 * @param b 线段端点
 * @param s 该点到ab的最短距离
 * @returns {number}
 */
let point2LineDistance = (a, b, s) => {
    a = toCartesian(a);
    b = toCartesian(b);
    s = toCartesian(s);
    let ab = Math.sqrt(Math.pow((a.x - b.x), 2.0) + Math.pow((a.y - b.y), 2.0) + Math.pow((a.z - b.z), 2.0));
    let as = Math.sqrt(Math.pow((a.x - s.x), 2.0) + Math.pow((a.y - s.y), 2.0) + Math.pow((a.z - s.z), 2.0));
    let bs = Math.sqrt(Math.pow((s.x - b.x), 2.0) + Math.pow((s.y - b.y), 2.0) + Math.pow((s.z - b.z), 2.0));
    let cos_A = (Math.pow(as, 2.0) + Math.pow(ab, 2.0) - Math.pow(bs, 2.0)) / (2 * ab * as);
    let sin_A = Math.sqrt(1 - Math.pow(cos_A, 2.0));
    let t = ((a.x - s.x) * (a.x - b.x) + (a.y - s.y) * (a.y - b.y) + (a.z - s.z) * (a.z - b.z)) / (Math.pow((a.x - b.x), 2.0) + Math.pow((a.y - b.y), 2.0) + Math.pow((a.z - b.z), 2.0));
    if (t < 0) {
        return as;
    } else if (t <= 1 && t >= 0) {
        return as * sin_A;
    } else if (t > 1) {
        return bs;
    }
};

/**
 * 求多边形的面积
 * @param arr
 * @returns {*}
 */
let countArea = (arr) => {
    if ((!arr) || (arr.length < 3)) {
        throw new Error("Error in Parameter!");
    } else {
        let area = 0;
        for (let i = 0; i < arr.length; i++) {
            let j = (i + 1) % arr.length;
            let p1 = arr[i], p2 = arr[j];
            p1 = toCartesian(p1);
            p2 = toCartesian(p2);
            area += p1.x * p2.y;
            area -= p1.y * p2.x;
        }
        area /= 2;
        return Math.abs(area);
    }
};

/**
 * 求三角形面积;返回-1为不能组成三角形;
 * @param a
 * @param b
 * @param c
 * @returns {*}
 */
let countAreaByThreePoints = (a, b, c) => {
    a = toCartesian(a);
    b = toCartesian(b);
    c = toCartesian(c);
    let area = -1;
    let side = [];//存储三条边的长度;
    side[0] = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
    side[1] = Math.sqrt(Math.pow(a.x - c.x, 2) + Math.pow(a.y - c.y, 2) + Math.pow(a.z - c.z, 2));
    side[2] = Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2) + Math.pow(c.z - b.z, 2));
    //不能构成三角形;
    if (side[0] + side[1] <= side[2] || side[0] + side[2] <= side[1] || side[1] + side[2] <= side[0]) {
        return area;
    }
    //利用海伦公式。area =sqr(p*(p-a)(p-b)(p-c));
    let p = (side[0] + side[1] + side[2]) / 2; //半周长;
    area = Math.sqrt(p * (p - side[0]) * (p - side[1]) * (p - side[2]));
    return area;
};

/**
 * 计算空间上两点之间的距离
 * @param p1
 * @param p2
 * @returns {null|number}
 */
let getDistance = (p1, p2) => {
    if ((!p1) || (!p2)) {
        throw new Error("Error in Parameter!");
    }
    p1 = toCartesian(p1);
    p2 = toCartesian(p2);
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2) + Math.pow((p1.z - p2.z), 2));
};

/**
 * 已知三点坐标，求平面的法向量
 * @param p1 {{x: number, y: number, z: number}}
 * @param p2 {{x: number, y: number, z: number}}
 * @param p3 {{x: number, y: number, z: number}}
 * @returns {{x: number, y: number, z: number}}
 */
let getNormal = (p1, p2, p3) => {
    // p1=toCartesian(p1);
    // p2=toCartesian(p2);
    // p3=toCartesian(p3);
    let x = ((p2.y - p1.y) * (p3.z - p1.z) - (p2.z - p1.z) * (p3.y - p1.y));
    let y = ((p2.z - p1.z) * (p3.x - p1.x) - (p2.x - p1.x) * (p3.z - p1.z));
    let z = ((p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x));
    return {"x": x, "y": y, "z": z};
};

/**
 * 求线面交点 线面平行返回undefined //参考网址[https://blog.csdn.net/abcjennifer/article/details/6688080]
 * @param planeVector 平面的法线向量
 * @param planePoint 平面经过的一点坐标
 * @param lineVector 直线的方向向量
 * @param linePoint 直线经过的一点坐标
 * @returns {Array}  返回交点坐标
 * @constructor
 */
let countIntersectionOfLineAndPlane = (planeVector, planePoint, lineVector, linePoint) => {
    let vp1, vp2, vp3, n1, n2, n3, v1, v2, v3, m1, m2, m3, t, vpt;
    vp1 = planeVector.x;
    vp2 = planeVector.y;
    vp3 = planeVector.z;
    n1 = planePoint.x;
    n2 = planePoint.y;
    n3 = planePoint.z;
    v1 = lineVector.x;
    v2 = lineVector.y;
    v3 = lineVector.z;
    m1 = linePoint.x;
    m2 = linePoint.y;
    m3 = linePoint.z;
    vpt = v1 * vp1 + v2 * vp2 + v3 * vp3;
    //首先判断直线是否与平面平行
    let result = {};
    if (vpt === 0) {
        return undefined;
    } else {
        t = ((n1 - m1) * vp1 + (n2 - m2) * vp2 + (n3 - m3) * vp3) / vpt;
        result.x = m1 + v1 * t;
        result.y = m2 + v2 * t;
        result.z = m3 + v3 * t;
    }
    return result;
};

/**
 * 求交点 线面相交 求交点
 * @param line
 * @param polygon
 * @returns {boolean|Array}
 */
let getPointInPolygon = (line, polygon) => {
    let normal = getNormal(polygon[0], polygon[1], polygon[2]);
    let lineX = line[0].x - line[1].x;
    let lineY = line[0].y - line[1].y;
    let lineZ = line[0].z - line[1].z;
    let lineNormal = {"x": lineX, "y": lineY, "z": lineZ};
    let result = countIntersectionOfLineAndPlane(normal, polygon[1], lineNormal, line[0]);
    if (result) {
        return result;
    }
    return false;
};

/**
 * 判断点是否在四边形内部(只针对凸多边形)
 * @param point
 * @param quadrilateral
 */
let isPointInQuadrilateral = (point, quadrilateral) => {
    let s1, s2, s3, s4, s5, s6;//s1 s2是将四边形分为两个三角形的面积  s3 s4 s5 s6代表四边形四个顶点到目标点组成的四个三角形的面积
    let ab, bc, ac, cd, da;//四边形的边长和对角线ac的长度
    ab = getDistance(quadrilateral[0], quadrilateral[1]);
    bc = getDistance(quadrilateral[1], quadrilateral[2]);
    ac = getDistance(quadrilateral[0], quadrilateral[2]);
    cd = getDistance(quadrilateral[2], quadrilateral[3]);
    da = getDistance(quadrilateral[3], quadrilateral[4]);
    //海伦公式 计算出四边形中两个三角形的面积
    let p_abc = (ab + bc + ac) / 2;
    let p_acd = (ac + cd + da) / 2;
    s1 = Math.sqrt(p_abc * (p_abc - ab) * (p_abc - bc) * (p_abc - ac));
    s2 = Math.sqrt(p_acd * (p_acd - ac) * (p_acd - cd) * (p_acd - da));
    let ap, bp, cp, dp;//四边形到目标点之间的距离
    ap = getDistance(point, quadrilateral[0]);
    bp = getDistance(point, quadrilateral[1]);
    cp = getDistance(point, quadrilateral[2]);
    dp = getDistance(point, quadrilateral[3]);
    let p_abp = (ab + ap + bp) / 2;
    let p_bcp = (bc + bp + cp) / 2;
    let p_cdp = (cd + cp + dp) / 2;
    let p_dap = (da + dp + ap) / 2;
    s3 = Math.sqrt(p_abp * (p_abp - ab) * (p_abp - ap) * (p_abp - bp));
    s4 = Math.sqrt(p_bcp * (p_bcp - bc) * (p_bcp - bp) * (p_bcp - cp));
    s5 = Math.sqrt(p_cdp * (p_cdp - cd) * (p_cdp - cp) * (p_cdp - dp));
    s6 = Math.sqrt(p_dap * (p_dap - da) * (p_dap - dp) * (p_dap - ap));
    if (Math.abs((s3 + s4 + s5 + s6) - (s1 + s2)) > 0.0001) {
        return false
    }
    return true;
};

/**
 * 判断点是否在平面内部
 * @param point
 * @param polygon
 * @returns {boolean}
 * @constructor
 */
let JudgePointInPolygon = (point, polygon) => {
    /**
     * 两个向量的叉积和
     * @param n
     * @param m
     * @returns {number}
     * @constructor
     */
    let VectorMultiplication = (n, m) => {
        return (n.y * m.z - m.y * n.z) + (n.z * m.x - n.x * m.z) + (n.x * m.y - n.y * m.x);
    };

    let p1 = polygon[0];
    let p2 = polygon[1];
    let p3 = polygon[2];
    let p4 = polygon[3];
    let n1, n2, n3, n4, n5, n6, n7, n8;
    n1 = {"x": p2.x - p1.x, "y": p2.y - p1.y, "z": p2.z - p1.z};
    n2 = {"x": point.x - p1.x, "y": point.y - p1.y, "z": point.z - p1.z};
    n3 = {"x": p4.x - p3.x, "y": p4.y - p3.y, "z": p4.z - p3.z};
    n4 = {"x": point.x - p3.x, "y": point.y - p3.y, "z": point.z - p3.z};
    n5 = {"x": p3.x - p2.x, "y": p3.y - p2.y, "z": p3.z - p2.z};
    n6 = {"x": point.x - p2.x, "y": point.y - p2.y, "z": point.z - p2.z};
    n7 = {"x": p4.x - p1.x, "y": p4.y - p1.y, "z": p4.z - p1.z};
    n8 = {"x": point.x - p4.x, "y": point.y - p4.y, "z": point.z - p4.z};
    return !(VectorMultiplication(n1, n2) * VectorMultiplication(n3, n4) >= 0 && VectorMultiplication(n5, n6) * VectorMultiplication(n7, n8) >= 0);
};

/**
 * 盘算点是否在线段上
 * @param point
 * @param polyline
 * @returns {boolean}
 * @constructor
 */
let JudgePointInPolyline = (point, polyline) => {
    let lineLength = Math.sqrt(Math.pow((polyline[0].x - polyline[1].x), 2) + Math.pow((polyline[0].y - polyline[1].y), 2) + Math.pow((polyline[0].z - polyline[1].z), 2));
    let one = Math.sqrt(Math.pow((point.x - polyline[1].x), 2) + Math.pow((point.y - polyline[1].y), 2) + Math.pow((point.z - polyline[1].z), 2));
    let two = Math.sqrt(Math.pow((point.x - polyline[0].x), 2) + Math.pow((point.y - polyline[0].y), 2) + Math.pow((point.z - polyline[0].z), 2));
    let di = one + two - lineLength;
    if (di * 10000 < 1) {
        return true;
    }
    return false;

};

/**
 * 根据3个点,计算空间平面的方程
 * Ax+By+Cz+D=0
 * 输入参数:point3fArray---空间中3个点的坐标,大小为3;输入点>3时,只取前3个点
 * 输出参数A,B,C,D
 * 返回值:true---计算成功;false----计算失败
 * @param point3fArray
 * @returns {{A: number, B: number, C: number, D: number}}
 * @constructor
 */
let GetPanelEquation = (point3fArray) => {
    if (point3fArray.length < 3) {
        return undefined;
    }
    let A, B, C, D;
    A = point3fArray[0].y * (point3fArray[1].z - point3fArray[2].z) +
        point3fArray[1].y * (point3fArray[2].z - point3fArray[0].z) +
        point3fArray[2].y * (point3fArray[0].z - point3fArray[1].z);
    B = point3fArray[0].z * (point3fArray[1].x - point3fArray[2].x) +
        point3fArray[1].z * (point3fArray[2].x - point3fArray[0].x) +
        point3fArray[2].z * (point3fArray[0].x - point3fArray[1].x);
    C = point3fArray[0].x * (point3fArray[1].y - point3fArray[2].y) +
        point3fArray[1].x * (point3fArray[2].y - point3fArray[0].y) +
        point3fArray[2].x * (point3fArray[0].y - point3fArray[1].y);
    D = -point3fArray[0].x * (point3fArray[1].y * point3fArray[2].z - point3fArray[2].y * point3fArray[1].z) -
        point3fArray[1].x * (point3fArray[2].y * point3fArray[0].z - point3fArray[0].y * point3fArray[2].z) -
        point3fArray[2].x * (point3fArray[0].y * point3fArray[1].z - point3fArray[1].y * point3fArray[0].z);
    return {A: A, B: B, C: C, D: D};
};



const INFINITY = 180;
const ESP = 1e-5;
const MAX_N = 1000;



// 计算叉乘 |P0P1| × |P0P2|
function Multiply(p1, p2, p0)
{
    return ((p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y));
}
// 判断线段是否包含点point
function IsOnline(point, line)
{
    return((Math.abs(Multiply(line.pt1, line.pt2, point)) < ESP) &&
        ((point.x - line.pt1.x) * (point.x - line.pt2.x) <= 0) &&
        ((point.y - line.pt1.y) * (point.y - line.pt2.y) <= 0));
}

// 判断直线上的点是否存在于垂直于水平面的线段上
function IsOnlineZ(point,line)
{
    return (point.z <= Math.max(line.pt1.z,line.pt2.z) && point.z >= Math.min(line.pt1.z,line.pt2.z))
}


// 判断线段相交
function Intersect(L1, L2)
{
    return((Math.max(L1.pt1.x, L1.pt2.x) >= Math.min(L2.pt1.x, L2.pt2.x)) &&
        (Math.max(L2.pt1.x, L2.pt2.x) >= Math.min(L1.pt1.x, L1.pt2.x)) &&
        (Math.max(L1.pt1.y, L1.pt2.y) >= Math.min(L2.pt1.y, L2.pt2.y)) &&
        (Math.max(L2.pt1.y, L2.pt2.y) >= Math.min(L1.pt1.y, L1.pt2.y)) &&
        (Multiply(L2.pt1, L1.pt2, L1.pt1) * Multiply(L1.pt2, L2.pt2, L1.pt1) >= 0) &&
        (Multiply(L1.pt1, L2.pt2, L2.pt1) * Multiply(L2.pt2, L1.pt2, L2.pt1) >= 0)
    );
}

/**判断点在多边形内
 * point  {{x: number, y: number, z: number}}
 * polygon:[ {x: number, y: number, z: number},...]
 * 如果点在多边形内： 返回0
 * 如果点在多边形边上： 返回1
 * 如果点在多边形外： 返回2
 */

let InPolygon = function (polygon,point)
{
    var n = polygon.length;
    var count = 0;
    var line;
    line = {"pt1":{"x":point.x,"y":point.y},"pt2":{"x":-INFINITY,"y":point.y}}
    for (var i = 0; i < n; i++)
    {
        // 得到多边形的一条边
        var side = {};
        side["pt1"] = polygon[i];
        side["pt2"] = polygon[(i + 1) % n];
        if (IsOnline(point, side))
        {
            return 1;
        }

        // 如果side平行x轴则不作考虑
        if (Math.abs(side.pt1.y - side.pt2.y) < ESP)
        {
            continue;
        }

        if (IsOnline(side.pt1, line))
        {
            if (side.pt1.y > side.pt2.y) count++;
        }
        else if (IsOnline(side.pt2, line))
        {
            if (side.pt2.y > side.pt1.y) count++;
        }
        else if (Intersect(line, side))
        {
            count++;
        }
    }

    if (count % 2 == 1) { return 0; }
    else { return 2; }
}


/**
 * 判断多边形是否与线相交
 * @param polygon [{x:lng,y:lng,z:height},...]
 * @param line [{x:lng,y:lng,z:height},{x:lng,y:lng,z:height}]
 * @returns {boolean}
 * @constructor
 */
let IntersectionOFPolygonAndLine = (polygon,line)=>
{
    var result = getPointInPolygon(line,polygon);
    //重写格式适配代码
    var rwline = {"pt1":line[0],"pt2":line[1]};
    //判断是否在线段上
    if(!IsOnline(result,rwline))
    {
        return false;
    }
    else{
        if(!IsOnlineZ(result,rwline))
        {
            return false;
        }
    }
    if(result)
    {
        var inpolygon = InPolygon(polygon,result);
        if(inpolygon != 2)
        {
            return true;
        }
        else{
            return false;
        }
    }
    else {
        return false;
    }
}






export default {
    getCameraInfo,
    meter2Lat,
    meter2Lng,
    isDegreesOrCartesian,
    toDegrees,
    toCartesian,
    toWindowCoordinates,
    point2LineDistance,
    countArea,
    countAreaByThreePoints,
    getDistance,
    getNormal,
    countIntersectionOfLineAndPlane,
    getPointInPolygon,
    isPointInQuadrilateral,
    JudgePointInPolygon,
    JudgePointInPolyline,
    GetPanelEquation,
    InPolygon,
    IntersectionOFPolygonAndLine,
}
