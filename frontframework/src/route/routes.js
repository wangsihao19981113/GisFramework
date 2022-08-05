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
        {
            path: '/example',
            name: 'example',
            component: resolve => require(['@/components/example/ExamplePage'], resolve),
        },
        {
            path: '/Risingline',
            name: 'Risingline',
            component:resolve => require(['@/components/example/LineStyle/Risingline'], resolve)
        },
        {
            path: '/ShiningLine',
            name: 'ShiningLine',
            component:resolve => require(['@/components/example/LineStyle/ShiningLine'], resolve)
        },
        {
            path:'/ParabolaLine',
            name:'ParabolaLine',
            component:resolve => require(['@/components/example/LineStyle/ParabolaLine'], resolve)
        },
        {
            path:'/PieChart',
            name:'PieChart',
            component:resolve => require(['@/components/example/StatisticalChart/PieChart'], resolve)
        }

    ]
})