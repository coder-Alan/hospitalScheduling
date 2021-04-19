import Vue from 'vue';
import Router from 'vue-router';
import index from '../components/index.vue';
import userManagement from '../components/userManagement.vue';
import staffManagement from '../components/staffManagement.vue';
import roomManagement from '../components/roomManagement.vue';
import placesManagement from '../components/placesManagement';
import classesManagement from '../components/classesManagement';
import shiftManagement from '../components/shiftManagement';
import dutyManagement from '../components/dutyManagement';

/* const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}; */

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'personalManagement',
        component: index
    },
    {
        path: '/userManagement',
        ename: 'userManagement',
        name: '用户信息管理',
        component: userManagement,
    },
    {
        path: '/staffManagement',
        ename: 'staffManagement',
        name: '员工信息管理',
        component: staffManagement,
    },
    {
        path: '/roomManagement',
        ename: 'roomManagement',
        name: '科室信息管理',
        component: roomManagement,
    },
    {
        path: '/placesManagement',
        ename: 'placesManagement',
        name: '地点信息管理',
        component: placesManagement,
    },
    {
        path: '/classesManagement',
        ename: 'classesManagement',
        name: '班次信息管理',
        component: classesManagement,
    },
    {
        path: '/shiftManagement',
        ename: 'shiftManagement',
        name: '调班信息管理',
        component: shiftManagement,
    },
    {
        path: '/dutyManagement',
        ename: 'dutyManagement',
        name: '值班信息管理',
        component: dutyManagement,
    },
];

export default new Router({
    routes
})