<template>
    <div class="user-message">
        <div class="message" v-if="!isSupper">
            <div class="edit-message">
                <div class="head-portrait">
                    <img src="../assets/image/head-portrait.jpg" alt="">
                </div>
                <el-button v-if="staffMessage" style="width: 180px; padding: 8px 23px;" @click="handleEdit" icon="el-icon-edit" round>信息修改</el-button>
            </div>
            <div class="details" v-if="staffMessage">
                <p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：{{staffMessage.yName}}</p>
                <p>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：{{staffMessage.ySex}}</p>
                <p>类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：{{staffMessage.yCategory}}</p>
                <p>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：{{staffMessage.yTitle}}</p>
                <p>所属科室：{{staffMessage.yDepartment}}</p>
                <p>手机号码：{{staffMessage.yPhone}}</p>
            </div>
            <div class="details" v-else>
                <p>请联系管理员绑定你的职工信息！</p>
            </div>
        </div>
        <div class="message" v-else>
            <div class="edit-message">
                <div class="head-portrait">
                    <img src="../assets/image/head-portrait.jpg" alt="">
                </div>
            </div>
            <div class="details">
                <p>超级管理员</p>
            </div>
        </div>
        <div class="punch-clock" v-if="!isSupper && staffMessage">
            <div class="clock-btn" ref="clock" @click="punchClock">
                <span>{{tabText}}</span>
                <span>{{currentTime}}</span>
            </div>
            <div style="height:130px;width:350px;">
                <el-steps direction="vertical" :active="clockActive">
                    <el-step title="上班打卡" :description="startTime"></el-step>
                    <el-step title="下班打卡" :description="endTime"></el-step>
                </el-steps>
            </div>
        </div>
        <!-- 添加、编辑对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="form">
                <el-form-item label="员工姓名:" prop="yName">
                    <el-input type="text" v-model="ruleForm.yName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="员工性别:" prop="ySex">
                    <el-input type="text" v-model="ruleForm.ySex" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="员工类别:" prop="yCategory">
                    <el-input type="text" v-model="ruleForm.yCategory" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="员工职称:" prop="yTitle">
                    <el-input type="text" v-model="ruleForm.yTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属科室:" prop="yDepartment">
                    <el-input type="text" v-model="ruleForm.yDepartment" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码:" prop="yPhone">
                    <el-input type="text" v-model="ruleForm.yPhone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="员工头像:" prop="yImgUrl">
                    <el-input type="text" v-model="ruleForm.yImgUrl" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleAddSure('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { 
    querySingleUser,
    queryWorkTimes,
    inserWorkTimes,
    updateWorkTimes
} from '../api/user'
import { querySingleStaff, updateStaff } from '../api/staff'
let timer
export default {
    data() {
        var validateYName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入员工姓名'));
            } else {
                callback();
            }
        };
        var validateYCategory = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入员工类别'));
            } else {
                callback();
            }
        };
        var validateYTitle = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入员工职称'));
            } else {
                callback();
            }
        };
        var validateYDepartment = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入所属科室'));
            } else {
                callback();
            }
        };
        var validateYPhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号码'));
            } else {
                callback();
            }
        };
        return {
            staffMessage: null,
            startTime: '',
            endTime: '',
            tabText: '上班打卡',
            currentTime: '',
            clockActive: 0,
            isSupper: false,
            dialogFormVisible: false, // 添加、编辑弹出框
            dialogTitle: '',
            // 编辑表单验证
            ruleForm: {
                yCode: null,
                uCode: null,
                yName: '',
                ySex: '',
                yCategory: '',
                yTitle: '',
                yDepartment: '',
                yPhone: '',
                yImgUrl: ''
            },
            rules: {
                yName: [{ validator: validateYName, trigger: 'blur' }],
                yCategory: [{ validator: validateYCategory, trigger: 'blur' }],
                yTitle: [{ validator: validateYTitle, trigger: 'blur' }],
                yDepartment: [{ validator: validateYDepartment, trigger: 'blur' }],
                yPhone: [{ validator: validateYPhone, trigger: 'blur' }],
            },
        }
    },
    watch: {
    },
    created() {
        this.init()
    },
    methods: {
        init () {
            /* this.getStaffMessage()
            this.getCurrentTime()
            let myDate = new Date();
            let hours = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours();
            if (!this.startTime && hours > 12) {
                this.tabText = '下班打卡'
                this.startTime = '已超过打卡时间,请及时处理'
                this.clockActive = 1
            } */
            if (localStorage.getItem('userName') && localStorage.getItem('userName') != 'admin') {
                this.getStaffMessage()
                this.getCurrentTime()
                let myDate = new Date();
                let hours = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours();
                if (!this.startTime && hours > 12) {
                    this.tabText = '下班打卡'
                    this.startTime = '已超过打卡时间,请及时处理'
                    this.clockActive = 1
                }
            } else {
                this.isSupper = true
            }
        },
        getStaffMessage() {
            querySingleUser({
              uName: localStorage.getItem('userName')
            }).then(res => {
                if (res.data.data.code == 200) {
                    let data = res.data.data.data
                    querySingleStaff({
                        uCode: data.uCode
                    }).then(staff => {
                        console.log(111, staff)
                        let staffData = staff.data.data
                        if (staffData.code === 200) {
                            this.staffMessage = staffData.data
                            this.ruleForm = {
                                yCode: this.staffMessage.yCode,
                                uCode: this.staffMessage.uCode,
                                yName: this.staffMessage.yName,
                                ySex: this.staffMessage.ySex,
                                yCategory: this.staffMessage.yCategory,
                                yTitle: this.staffMessage.yTitle,
                                yDepartment: this.staffMessage.yDepartment,
                                yPhone: this.staffMessage.yPhone,
                                yImgUrl: this.staffMessage.yImgUrl
                            }
                            queryWorkTimes({yCode: this.staffMessage.yCode}).then((times) => {
                                let timeData = times.data.data
                                if (timeData.code === 200) {
                                    if (timeData.data.startTime && !timeData.data.endTime) {
                                        this.startTime = timeData.data.startTime
                                        this.tabText = '下班打卡'
                                        this.clockActive = 1
                                    } else if (timeData.data.endTime) {
                                        clearInterval(timer)
                                        this.startTime = timeData.data.startTime
                                        this.endTime = timeData.data.endTime
                                        this.tabText = '打卡完成'
                                        this.currentTime = ''
                                        this.$refs.clock.style = 'background: #999'
                                        this.clockActive = 2
                                    }
                                    // 如果当天日期不同，先清空数据库里的上班时间和下班时间
                                    if (timeData.data.workDate != this.getNowFormatDate()) {
                                        let data = {
                                            yCode: this.staffMessage.yCode,
                                            startTime: '',
                                            endTime: '',
                                            workDate: this.getNowFormatDate()
                                        }
                                        updateWorkTimes(data).then(res => {
                                            if (res.data.data.code === 200) {
                                                console.log(res.data.data.message)
                                            }
                                        })
                                    }
                                }
                            })
                        } else {
                            this.$message({
                                message: '请联系管理员绑定你的职工信息',
                                type: 'warning'
                            });
                        }
                    })
                }
            })
        },
        getCurrentTime() {
            timer = setInterval(() => {
                let myDate = new Date();
                let hours = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours();
                let minutes = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes();
                let seconds = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds();
                this.currentTime = hours + ':' + minutes + ':' + seconds
            }, 1000);
        },
        punchClock() {
            if (!this.startTime) {
                let myDate = new Date();
                let hours = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours();
                let minutes = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes();
                let seconds = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds();
                this.startTime = '时间：' + hours + ':' + minutes + ':' + seconds
                this.tabText = '下班打卡'
                this.clockActive = 1
                queryWorkTimes({yCode: this.staffMessage.yCode}).then((times) => {
                    let timeData = times.data.data
                    if (timeData.code === 200) {
                        if (timeData.data.length === 0) {
                            // 添加
                            let data = {
                                yCode: this.staffMessage.yCode,
                                startTime: this.startTime,
                                endTime: this.endTime,
                                workDate: this.getNowFormatDate()
                            }
                            inserWorkTimes(data).then(res => {
                                if (res.data.data.code === 200) {
                                    console.log(res.data.data.message)
                                }
                            })
                        } else {
                            // 修改
                            let data = {
                                yCode: this.staffMessage.yCode,
                                startTime: this.startTime,
                                endTime: this.endTime,
                                workDate: this.getNowFormatDate()
                            }
                            updateWorkTimes(data).then(res => {
                                if (res.data.data.code === 200) {
                                    console.log(res.data.data.message)
                                }
                            })
                        }
                    }
                })
            } else if (!this.endTime) {
                clearInterval(timer)
                let myDate = new Date();
                let hours = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours();
                let minutes = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes();
                let seconds = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds();
                this.endTime = '时间：' + hours + ':' + minutes + ':' + seconds
                this.tabText = '打卡完成'
                this.currentTime = ''
                this.$refs.clock.style = 'background: #999'
                this.clockActive = 2
                queryWorkTimes({yCode: this.staffMessage.yCode}).then((times) => {
                    let timeData = times.data.data
                    if (timeData.code === 200) {
                        if (timeData.data.length === 0) {
                            // 添加
                            let data = {
                                yCode: this.staffMessage.yCode,
                                startTime: this.startTime,
                                endTime: this.endTime,
                                workDate: this.getNowFormatDate()
                            }
                            inserWorkTimes(data).then(res => {
                                if (res.data.data.code === 200) {
                                    console.log(res.data.data.message)
                                }
                            })
                        } else {
                            // 修改
                            let data = {
                                yCode: this.staffMessage.yCode,
                                startTime: this.startTime,
                                endTime: this.endTime,
                                workDate: this.getNowFormatDate()
                            }
                            updateWorkTimes(data).then(res => {
                                if (res.data.data.code === 200) {
                                    console.log(res.data.data.message)
                                }
                            })
                        }
                    }
                })
            }
        },
        handleEdit() {
            this.dialogTitle = '编辑'
            this.dialogFormVisible = true
        },
        handleCancel() {
            this.dialogFormVisible = false
        },
        handleAddSure(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogFormVisible = false
                    console.log('提交的表单', this.ruleForm)
                    updateStaff(this.ruleForm).then(res => {
                        let data = res.data.data
                        if (data.code == 200) {
                            this.$message({
                                message: data.message,
                                type: 'success'
                            });
                            this.ruleForm = {
                                uCode: data.uCode,
                                yCode: this.staffMessage.yCode,
                                yName: '',
                                ySex: '',
                                yCategory: '',
                                yTitle: '',
                                yDepartment: '',
                                yPhone: '',
                                yImgUrl: ''
                            }
                            this.getStaffMessage()
                        }
                    })
                } else {
                    console.log('表单验证失败')
                }
            })
        },
        getNowFormatDate() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + '-' + month + '-' + strDate;
            return currentdate;
        },
    },
}
</script>

<style scoped>
.user-message {
    width: 100%;
    height: 100%;
}
.message {
    display: flex;
    width: 60%;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    box-sizing: border-box;
}
.punch-clock {
    display: flex;
    align-items: center;
    width: 60%;
    padding: 40px 80px;
    margin-top: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    box-sizing: border-box;
}
.edit-message {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    margin-right: 60px;
}
.head-portrait {
    margin: 30px ;
    border: 1px solid #ccc;
    border-radius: 50%;
    overflow: hidden;
}
.head-portrait img {
    width: 200px;
}
/* color: #757B83; */
.details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 380px;
    overflow: hidden;
}
.details p{
    padding: 10px 0;
    color: #757B83;
    font-size: 18px;
}
.clock-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 160px;
    height: 160px;
    margin-right: 100px;
    border-radius: 50%;
    color: #fff;
    font-size: 18px;
    background: #409EFF;
    box-shadow: 0 4px 6px rgba(0, 0, 0, .2), 0 0 6px rgba(0, 0, 0, .04);
    cursor: pointer;
}
.clock-btn:hover {
    background: #3a90e6;
}
</style>