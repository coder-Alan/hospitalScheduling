import Vue from 'vue'
import resource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import login from './login.vue'

Vue.use(resource);
Vue.use(ElementUI);

new Vue({
  el: '#login',
  render: h => h(login)
})
