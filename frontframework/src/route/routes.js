import Vue from 'vue'
import UploadShapefileView from "@/components/home/View/UploadShapefileView";
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    mode:'history',
    routes: [
        {
            path: '/home',
            name: 'home',
            component: resolve => require(['@/components/home/HomePage'], resolve),
            children: [
                { path: 'UploadShapefile', component: UploadShapefileView },
                { path: 'ServiceQuery', component:resolve => require(['@/components/home/View/ServiceQueryView'], resolve) },
                { path: 'register', component: () => import('@/components/home/HelloWorld.vue') }
            ]
        },
        //例子总览面板
        {
            path: '/example',
            name: 'example',
            component: resolve => require(['@/components/example/ExamplePage'], resolve),
        },
        //上升线
        {
            path: '/Risingline',
            name: 'Risingline',
            component:resolve => require(['@/components/example/LineStyle/Risingline'], resolve)
        },
        //精灵光线
        {
            path: '/ShiningLine',
            name: 'ShiningLine',
            component:resolve => require(['@/components/example/LineStyle/ShiningLine'], resolve)
        },
        //抛物线
        {
            path:'/ParabolaLine',
            name:'ParabolaLine',
            component:resolve => require(['@/components/example/LineStyle/ParabolaLine'], resolve)
        },
        //饼图
        {
            path:'/PieChart',
            name:'PieChart',
            component:resolve => require(['@/components/example/StatisticalChart/PieChart'], resolve)
        },
        //动态水纹
        {
            path:'/WaterNormal',
            name:'WaterNormal',
            component:resolve => require(['@/components/example/WaterStyle/WaterNormal'], resolve)
        },
        //建筑白膜
        {
            path:'/BuildingModel',
            name:'BuildingModel',
            component:resolve => require(['@/components/example/DataLoad/BuildingModel'], resolve)
        },
        //shp文件加载
        {
            path:'/ShapeFile',
            name:'ShapeFile',
            component:resolve => require(['@/components/example/DataLoad/ShapeFile'], resolve)
        },
        //阴影
        {
            path:'/Shadow',
            name:'Shadow',
            component:resolve => require(['@/components/example/SceneEffect/Shadow'], resolve)
        },
        //倒影（半废弃）
        {
            path:'/InvertedEffect',
            name:'InvertedEffect',
            component:resolve => require(['@/components/example/Mars3d/InvertedEffect'], resolve)
        },
        //gif点样式
        {
            path:'/GifPoint',
            name:'GifPoint',
            component:resolve => require(['@/components/example/PointStyle/GifPoint'], resolve)
        },
        //热力图
        {
            path:'/HeatMapNormal',
            name:'HeatMapNormal',
            component:resolve => require(['@/components/example/HeatMap/HeatMapNormal'], resolve)
        },
        //BIM模型（3dtiles格式）
        {
            path:'/BIMModel',
            name:'BIMModel',
            component:resolve => require(['@/components/example/DataLoad/BIMModel'], resolve)
        },
        //threejs和cesium相机融合
        {
            path:'/CameraFusion',
            name:'CameraFusion',
            component:resolve => require(['@/components/example/CesiumWithThreeJS/CameraFusion'], resolve)
        },
        //ModelInstanceCollection加载Model，实例化加载重复模型
        {
            path:'/ModelInstance',
            name:'ModelInstance',
            component:resolve => require(['@/components/example/DataLoad/ModelInstance'], resolve)
        },
        //ThreeJS界面
        {
            path:'/ThreeJSContainer',
            name:'ThreeJSContainer',
            component:resolve => require(['@/components/example/CesiumWithThreeJS/ThreeJSContainer'], resolve)
        },
        //
        {
            path:'/ThreeJSLoad3dtiles',
            name:'ThreeJSLoad3dtiles',
            component:resolve => require(['@/components/example/DataLoad/ThreeJSLoad3dtiles'], resolve)
        },
        //
        {
            path:"/ModelAdjustment",
            name:"ModelAdjustment",
            component:resolve => require(['@/components/example/CesiumWithThreeJS/ModelAdjustment'], resolve)
        },
        //
        {
            path:"/OceanWater",
            name:"OceanWater",
            component:resolve => require(['@/components/example/WaterWithThreejs/OceanWater'], resolve)
        },
        //风场
        {
            path:"/Windy",
            name:"Windy",
            component:resolve => require(['@/components/example/Weather/Windy'], resolve)
        },
        //扇形
        {
            path:"/SectorShape",
            name:"SectorShape",
            component:resolve => require(['@/components/example/Figure/SectorShape'], resolve)
        },
        //卷帘
        {
            path: "/RollerShutter",
            name: "RollerShutter",
            component: resolve => require(['@/components/example/SplitScreen/RollerShutter'], resolve)
        },
        //加载OSGB
        {
            path:"/OSGBLoad",
            name:"OSGBLoad",
            component:resolve => require(['@/components/example/DataLoad/OSGBLoad'], resolve)
        },
        //模型剖面视图
        {
            path:"/SectionView",
            name:"SectionView",
            component:resolve => require(['@/components/example/SceneEffect/SectionView'],resolve)
        },
        //云层
        {
            path:"/Cloudy",
            name:"Cloudy",
            component:resolve => require(['@/components/example/Weather/Cloudy'],resolve)
        },
        //GeoServer管理
        {
            path:"/GeoserverManager",
            name:"GeoserverManager",
            component:resolve => require(['@/components/example/GeoserverManager/GeoserverManager'],resolve)
        },
        //等值线
        {
          path:"/Isopleth",
          name:"Isopleth",
          component:resolve => require(['@/components/example/Isopleth/IsoplethMap'],resolve)
        },
        //可视域分析
        {
            path:"/Viewshed",
            name:"Viewshed",
            component:resolve => require(['@/components/example/Analysis/Viewshed'],resolve)
        },
        //水淹分析
        {
            path:"/Flooding",
            name:"Flooding",
            component:resolve => require(['@/components/example/Analysis/Flooding'],resolve)
        },
        //测量工具
        {
            path:"/MeasureTool",
            name:"MeasureTool",
            component:resolve => require(['@/components/example/Measure/Measure'],resolve)
        },
        //通视分析
        {
            path:"/AnalysisVisible",
            name:"AnalysisVisible",
            component:resolve => require(['@/components/example/Analysis/AnalysisVisible'],resolve)
        },
        //等高线分析
        {
            path:"/ContourAnalysis",
            name:"ContourAnalysis",
            component:resolve => require(['@/components/example/Analysis/ContourAnalysis'],resolve)
        },
        //模型变换
        {
            path:"/ModelTranslation",
            name:"ModelTranslation",
            component:resolve => require(['@/components/example/Analysis/ModelTranslation'],resolve)
        },
        //注记集合
        {
            path: "/LabelCollection",
            name: "LabelCollection",
            component: resolve => require(['@/components/example/Primitive/LabelCollection'], resolve)
        },
        //图元要素聚类
        {
            path:"/PrimitiveCluster",
            name:"PrimitiveCluster",
            component:resolve => require(['@/components/example/Primitive/PrimitiveCluster'],resolve)
        },
        //缓冲区分析
        {
            path:"/BufferAnalysis",
            name:"BufferAnalysis",
            component:resolve => require(['@/components/example/Analysis/BufferAnalysis'],resolve)
        },
        //烟花
        {
            path:"/Firework",
            name:"Firework",
            component:resolve => require(['@/components/example/ParticleSystem/Firework'],resolve)
        },
        //火焰
        {
            path:"/Flame",
            name:"Flame",
            component:resolve => require(['@/components/example/ParticleSystem/Flame'],resolve)
        },
        //爆炸
        {
            path:"/Explot",
            name:"Explot",
            component:resolve => require(['@/components/example/ParticleSystem/Explot'],resolve)
        },
        //挖填方分析
        {
            path: "/CutFillAnalysis",
            component: resolve => require(['@/components/example/Analysis/CutFillAnalysis'], resolve)
        },
        //地形裁剪
        {
            path:"/TerrainClipAnalysis",
            component: resolve => require(['@/components/example/Analysis/TerrainClipAnalysis'], resolve)
        },
        //地形加载
        {
            path:"/TerrainLoad",
            component: resolve => require(['@/components/example/DataLoad/Terrain'], resolve)
        }
    ]
})