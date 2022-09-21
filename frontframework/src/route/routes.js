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
        //
        {
            path:"/Windy",
            name:"Windy",
            component:resolve => require(['@/components/example/Weather/Windy'], resolve)
        },
        {
            path:"/SectorShape",
            name:"SectorShape",
            component:resolve => require(['@/components/example/Figure/SectorShape'], resolve)
        }
    ]
})