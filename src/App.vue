<template>
  <div id="app" class="app">
    <Schedule :userName='userName' v-show="scheduleTab" />
    <el-container v-show="!scheduleTab">
      <el-aside width="auto">
        <el-menu
          v-if="menu"
          default-active="personalManagement"
          class="el-menu-vertical-demo"
          background-color="#434A50"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          @select='selectMenu'
        >
          <el-menu-item :index="'header'">
            <i v-show="isCollapse" class="el-icon-office-building"></i>
            <span class="leftNav-header">康德医院排班管理系统</span>
          </el-menu-item>
          <el-menu-item :index="item.ename" v-for="(item,index) in menu" :key="index">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </el-menu-item>
          <!-- <el-submenu :index="JSON.stringify(index)" v-for="(item,index) in menu" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item index="3">
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="app-header">
          <el-radio-group v-model="isCollapse" size="small">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
          </el-radio-group>
          <div class="schedule-tab" @mouseenter="headEnter">
            <img src="./assets/image/head-portrait.jpg" alt="">
          </div>
        </el-header>
        <el-main class="app-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <div class="enter-fixed">
      <div class="enter-system" v-show="isEnter" @mouseleave="headLeave">
        <div>{{userName}}，欢迎您</div>
        <div>
          <el-button @click="backHome" size="small" type="success" plain>返回首页</el-button>
          <el-button @click="loginOut" size="small" type="primary" plain>退出登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getPower} from './api/user'
import {mapMutations, mapGetters} from 'vuex'
import Schedule from '../src/components/schedule'

export default {
  name: 'app',
  data () {
    return {
      menu: [],
      isCollapse: true,
      activeName: 'first',
      scheduleTab: true,
      isEnter: false,
      userName: ''
    }
  },
  components: {
    Schedule
  },
  created() {
    this.init()
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  methods: {
    ...mapMutations(['setMenu', 'setIsLogin']),
    init() {
      if (location.search.indexOf('isLogin') != -1) {
        let param = location.search.slice(location.search.indexOf('=')+1, location.search.length)
        if (param) {
          this.setIsLogin(true)
        }
      }
      if (localStorage.getItem('userName')) {
        this.userName = localStorage.getItem('userName')
        getPower({
          uPower: localStorage.userPower
        }).then(res => {
          let data = res.data.data
          if (data.code == 200) {
            console.log(data.data)
            this.menu = data.data
            this.setMenu(data.data)
          }
        }), (err) => {
          console.log(err)
          // location.href = './login.html'
          this.loginOut()
        }
      }
    },
    handleClick() {
      
    },
    selectMenu(val) {
      let beforeNav = location.hash.slice(location.hash.lastIndexOf('/')+1,location.hash.length)
      if (beforeNav != val) {
        if (val != 'header') {
          this.$router.push(val)
        }
        this.beforeNav = val
      }
    },
    headEnter() {
      this.isEnter = true
    },
    headLeave() {
      this.isEnter = false
    },
    backHome() {
      this.isEnter = false
      this.scheduleTab = true
      location.href = '/?isLogin=1'
    },
    loginOut() {
      localStorage.clear()
      this.setIsLogin(false)
      location.href = './'
    }
  },
}
</script>

<style lang="scss" scoped>
.app {
  overflow-y: scroll;
}
.leftNav-header {
  font-size: 14px;
  font-weight: bold;
  color: #FFD04B;
}
.el-container {
  height: auto;
  min-height: 100vh;
}
.el-aside {
  height: inherit;
  border-right: solid 1px #e6e6e6;
  background-color: #434a50;
  box-sizing: border-box;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.app-main {
  overflow: hidden;
}
.el-menu {
  border: none;
}
.el-menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.app-header {
  height:50px;
}
.app-header .schedule-tab {
  width: 50px;
  height: 50px;
  margin-right: 30px;
  border-radius: 50%;
  border: 1px solid #ccc;
  overflow: hidden;
  cursor: pointer;
}
.app-header .schedule-tab img {
  width: 50px;
  height: 50px;
}
.enter-fixed {
  position: fixed;
  right: 20px;
  top: 60px;
}
.enter-system {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 200px;
  height: 200px;
  margin-top: 15px;
  border-radius: 20px;
  border: 3px solid rgb(176, 194, 212);
  background: rgba(59, 147, 235, 1);
  overflow: hidden;
  z-index: 999;
}
.enter-system::before {
  content: '';
  position: absolute;
  top: 0px;
  right: 60px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 15px solid rgb(176, 194, 212);
}
.enter-system div:first-child {
    color: #fff;
    padding-bottom: 30px;
}
</style>
