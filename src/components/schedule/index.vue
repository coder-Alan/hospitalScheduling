<template>
    <div class="time-table" v-show="packUp">
        <div class="table-header">
            <div class="title">康德医院排班管理系统</div>
            <div class="schedule-tab" @mouseenter="headEnter">
                <img src="../../assets/image/head-portrait.jpg" alt="">
            </div>
        </div>
        <div class="schedule-fixed">
            <template v-if="isLogin">
                <div class="schedule-system" v-show="isEnter" @mouseleave="headLeave">
                    <div>{{userName}}，欢迎您</div>
                    <div>
                        <el-button @click="enterSystem" size="small" type="success" plain>进入系统</el-button>
                        <el-button @click="loginOut" size="small" type="primary" plain>退出登录</el-button>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="schedule-system-login" v-show="isEnter" @mouseleave="headLeave">
                <div>
                    <el-button @click="loginIn" size="small" type="success" plain>登录</el-button>
                </div>
            </div>
            </template>
        </div>
        <div class="table-container">
            <table border="1" class="table-border">
                <tr align = center>   
                    <th class="table-th">科室</th>
                    <th class="table-th">医师</th>
                    <th align = center>
                        <tr class="table-tr" style="padding: 10px 0;font-size: 20px;">出诊时间</tr>
                        <tr class="table-tr">
                            <th style="flex: 1;padding: 5px 0;" v-for="(day, index) in week" :key="index">{{day}}</th>
                        </tr>
                    </th>
                </tr>
                <tr align = center v-for="(item, index) in dutyList" :key="index">
                    <td height = 100px >{{item.kName}}</td>
                    <td height = 100px >{{item.yName}}</td>
                    <td>
                        <tr class="table-tr">
                            <td class="table-td-td" v-for="(i, idx) in item.class" :key="idx">{{i.length>0?i[0]:''}}</td>
                        </tr>
                        <tr class="table-tr">
                            <td class="table-td-td" v-for="(i, idx) in item.class" :key="idx">{{i.length>1?i[1]:''}}</td>
                        </tr>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
import { queryStaffList } from '../../api/staff'
import { queryAllDutyList } from '../../api/duty'
export default {
    name: 'timeTable',
    data() {
        return {
            week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
            isEnter: false,
            staffList: [],
            dutyList: []
        }
    },
    props: ['packUp', 'userName'],
    computed: {
        ...mapGetters(['isLogin'])
    },
    created() {
        this.init()
    },
    methods: {
        ...mapMutations(['setIsLogin']),
        init() {
            this.getRoomList()
        },
        // 获取所有的科室列表
        getRoomList() {
            let listQuery = {
                yCode: '',
                yName: '',
                page: 1,
                pageSize: 999
            }
            queryStaffList(listQuery).then(res => {
                let data = res.data.data
                if (data.code === 200) {
                    data.data.forEach(item => {
                        if (item.yName != '超级管理员') {
                            this.staffList.push(item.yName)
                        }
                    })
                    queryAllDutyList({staffList: this.staffList}).then(ress => {
                        let dutyData = ress.data.data
                        if (dutyData.code === 200) {
                            let dutyList = dutyData.data
                            console.log(333, dutyList)
                            dutyList.forEach(item => {
                                let oneClass = []
                                this.week.forEach(day => {
                                    let one = []
                                    item.dutyList.forEach(days => {
                                        if (day == days.zDay) {
                                            one.push(days.zClasses)
                                        }
                                    })
                                    oneClass.push(one)
                                })
                                item.class = oneClass
                            });
                            console.log(dutyList)
                            this.dutyList = dutyList
                        }
                    })
                }
            }), (err) => {
                console.log(err)
            }
        },
        headEnter() {
            this.isEnter = true
        },
        headLeave() {
            this.isEnter = false
        },
        enterSystem() {
            this.$parent.scheduleTab = false
            this.isEnter = false
            location.href = './?isLogin=1#/personalManagement'
        },
        loginOut() {
            localStorage.clear()
            this.setIsLogin(false)
            location.href = './'
        },
        loginIn() {
            location.href = './login.html'
        }
    },
}
</script>

<style scoped>
.time-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 80px;
    padding: 0 80px 0 50px;
    border-bottom: 1px solid #ccc;
    background: #3b93eb;
    box-sizing: border-box;
}
.table-header .title {
    color: #fff;
    font-size: 48px;
    font-style: italic;
    letter-spacing: 5px;
    text-shadow: 5px 5px 5px red;
}
.table-header .schedule-tab {
    width: 50px;
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
}
.table-header .schedule-tab img {
    width: 50px;
    height: 50px;
}
.schedule-fixed {
    position: fixed;
    right: 50px;
    top: 70px;
    z-index: 999;
}
.schedule-system {
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
}
.schedule-system div:first-child {
    color: #fff;
    padding-bottom: 30px;
}
.schedule-system::before {
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
.schedule-system-login {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 200px;
    height: 100px;
    margin-top: 15px;
    border-radius: 20px;
    border: 3px solid rgb(176, 194, 212);
    background: rgba(59, 147, 235, 1);
    overflow: hidden;
}
.schedule-system-login::before {
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
.table-container {
    position: relative;
    flex: 1;
    background: url('../../assets/image/login.jpg');
}
.table-border {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 93%;
    border-collapse:collapse;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
}
.table-border th, td{
    text-align: center;
    border: 1px solid #E4E7ED;
    border-collapse:collapse;
    box-sizing: border-box;
}
.table-th {
    width: 10%;
    font-size: 20px;
}
.table-tr {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
}
.table-td-td {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height:50px;
}
.has-class {
    display: inline-block;
    width: 100%;
    height: 100%;
    color: #fff;
    background: #7BCAF8;
    cursor: pointer;
}
.oblique-line {
    position: absolute;
    top: 7px;
    left: 0;
    display: inline-block;
    width: 100%;
    height: 1px;
    background-color: #E4E7ED;
    transform: rotateZ(32deg) scale(1.414) translateY(4px);
}
</style>