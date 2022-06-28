import Vue from 'vue'
import UploadShapefile from "@/components/UploadShapefile";
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    mode:'history',
    routes: [
        {
            path: '/home',
            name: 'home',
            component: resolve => require(['@/components/HomePage'], resolve),
            children: [
                { path: 'UploadShapefile', component: UploadShapefile },
                { path: 'register', component: () => import('@/components/HelloWorld.vue') }
            ]
        }
    ]
})