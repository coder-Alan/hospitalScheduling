import Vue from 'vue';
import Router from 'vue-router';
import index from '../components/index.vue';
import userManagement from '../components/userManagement.vue';
import staffManagement from '../components/staffManagement.vue';

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
    },
    {
        path: '/staffManagement',
        enname: 'staffManagement',
        name: '员工信息管理',
        component: staffManagement,
    },
];

export default new Router({
    routes
})