import Vue from 'vue'
import resource from 'vue-resource';
import axios from 'axios';
import store from './store/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index.js';
import App from './App.vue';

Vue.use(resource);
Vue.prototype.axios = axios;
Vue.use(ElementUI);

// 判断有没有登录
if (localStorage.userToken) {
  // 登录成功
  // 设置token请求头
  Vue.http.headers.common['Authorization'] = localStorage.userToken
} else {
  // 登录失败
  // location.href = './index.html'
}

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
