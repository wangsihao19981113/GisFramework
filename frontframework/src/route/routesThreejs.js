import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    mode:'history',
    routes: [
        {
            path: '/ThreeJSContianer',
            name: 'ThreeJSContianer',
            component: resolve => require(['@/components/ThreeJSExample/ThreeJSContianer'], resolve),
        },
    ]
})