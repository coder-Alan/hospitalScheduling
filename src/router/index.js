import Vue from 'vue';
import Router from 'vue-router';
import index from '../components/index.vue';
import userManagement from '../components/userManagement.vue';

Vue.use(Router);

const routes = [
    {
        path: '/personalManagement',
        name: 'personalManagement',
        component: index
    },
    {
        path: '/userManagement',
        enname: 'userManagement',
        name: '用户信息管理',
        component: userManagement,
    }
];

export default new Router({
    routes
})