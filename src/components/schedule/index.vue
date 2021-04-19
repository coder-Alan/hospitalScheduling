<template>
    <div class="time-table" v-show="packUp">
        <div class="table-header">
            <div class="title">康德医院排班管理系统</div>
            <div class="schedule-tab" @mouseenter="headEnter">
                <img src="../../assets/image/head-portrait.jpg" alt="">
            </div>
        </div>
        <div class="enter-system" v-show="isEnter" @mousemove="headEnter" @mouseleave="headLeave">
            <div>
                <el-button @click="enterSystem" size="small" type="success" plain>进入系统</el-button>
                <el-button size="small" type="primary" plain>退出登录</el-button>
            </div>
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
                <tr align = center>
                    <td height = 100px >内科</td>
                    <td height = 100px >小张</td>
                    <td>
                        <tr class="table-tr">
                            <td class="table-td-td" v-for="(item, index) in num" :key="index">上午</td>
                        </tr>
                        <tr class="table-tr">
                            <td class="table-td-td" v-for="(item, index) in num" :key="index">下午</td>
                        </tr>
                    </td>
                </tr>
                <!-- <tr height = 20px align = center>   
                    <td>1</td><td v-for="(item, index) in num" :key="index"><span class="has-class" @click="classDetails">有课</span></td>
                </tr>
                <tr height = 20px align = center>   
                    <td>2</td><td><span class="has-class">有课</span></td>
                </tr> -->
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'timeTable',
    data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            timeValue: '',
            num: 7,
            week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
            isEnter: false
        }
    },
    props: ['packUp'],
    created() {
    },
    methods: {
        headEnter() {
            this.isEnter = true
        },
        headLeave() {
            this.isEnter = false
        },
        enterSystem() {
            this.$parent.scheduleTab = false
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
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
}
.table-header .schedule-tab img {
    width: 50px;
    height: 50px;
}
.enter-system {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 20px;
    top: 70px;
    width: 200px;
    height: 200px;
    border-radius: 20px;
    border: 1px solid #ccc;
    background: #3b93eb;
    overflow: hidden;
    z-index: 999;
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