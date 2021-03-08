import Vue from 'vue';
import Router from 'vue-router';
import index from '../components/index.vue';
import userManagement from '../components/userManagement.vue';
import staffManagement from '../components/staffManagement.vue';
import roomManagement from '../components/roomManagement.vue';
import placesManagement from '../components/placesManagement';
import classesManagement from '../components/classesManagement';
import shiftManagement from '../components/shiftManagement';

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
    {
        path: '/roomManagement',
        enname: 'roomManagement',
        name: '科室信息管理',
        component: roomManagement,
    },
    {
        path: '/placesManagement',
        enname: 'placesManagement',
        name: '地点信息管理',
        component: placesManagement,
    },
    {
        path: '/classesManagement',
        enname: 'classesManagement',
        name: '班次信息管理',
        component: classesManagement,
    },
    {
        path: '/shiftManagement',
        enname: 'shiftManagement',
        name: '调班信息管理',
        component: shiftManagement,
    },
];

export default new Router({
    routes
})