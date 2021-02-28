<template>
  <div id="app">
    <el-container>
      <el-aside>
         <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          v-if="menu"
          >
            <el-submenu :index="index" v-for="(item,index) in menu" :key="index">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item index="3">
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
      </el-aside>
      <el-main>222</el-main>
    </el-container>
  </div>
</template>

<script>
import {HTTP, LISTFORROUTER} from './api/api'
import {mapMutations} from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      menu: []
    }
  },
  mounted() {
    this.getmenu()
  },
  methods: {
    ...mapMutations(['setMenu']),
    getmenu() {
      this.$http.get(HTTP + LISTFORROUTER).then((res) => {
        let data = res.body.data
        this.menu = data
        console.log(data)
        this.setMenu(data)
      }), (err) => {
        console.log(err)
        location.href('./login.html')
      }
    }
  },
}
</script>

<style lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
</style>
<style lang="scss" scoped>
  .el-aside {
    height: 100vh;
    border-right: solid 1px #e6e6e6;
    background-color: #434a50;
    box-sizing: border-box;
  }
  .el-menu {
    border: none;
  }
</style>
