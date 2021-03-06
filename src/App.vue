<template>
  <div id="app" class="app">
    <el-container>
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
          <el-menu-item :index="item.enname" v-for="(item,index) in menu" :key="index">
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
        <el-header style="height:50px;">
          <el-radio-group v-model="isCollapse" size="small">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
          </el-radio-group>
        </el-header>
        <el-main class="app-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {getPower} from './api/api'
import {mapMutations} from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      menu: [],
      isCollapse: true,
      activeName: 'first',
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['setMenu']),
    init() {
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
        location.href = './login.html'
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
</style>
