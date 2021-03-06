<template>
    <div class="user-container">
        <div class="filter-container">
            <label for="searchName" class="filter-name">用户账号：</label>
            <el-input id="searchName" v-model.trim="listQuery.uName" style="padding-right:20px;" class="filter-input" placeholder="请输入" />
            <label for="searchNickName" class="filter-name">用户名称：</label>
            <el-input id="searchNickName" v-model.trim="listQuery.uNickName" class="filter-input" placeholder="请输入" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button v-waves class="filter-item" type="success" icon="el-icon-edit" @click="handleAdd">添加</el-button>
            <el-button v-waves class="filter-item" type="danger" icon="el-icon-delete" @click="handleRemove">批量删除</el-button>
        </div>

        <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        class="user-table"
        @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                align="center"
                width="50"
            />
            <el-table-column label="用户名称" width="150" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.uNickName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户账号" width="150" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.uName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户密码" width="150" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.uPassword }}</span>
                </template>
            </el-table-column>
            <el-table-column label="手机号" width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.uPhone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户权限" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.uPower }}</span>
                </template>
            </el-table-column>
            <el-table-column label="注册日期" width="170" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.registration }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户头像" show-overflow-tooltip width="170" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.uImgUrl }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                <el-button type="success" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

        <!-- 添加、编辑对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="form">
                <el-form-item label="用户名称:" prop="uNickName">
                    <el-input type="text" v-model="ruleForm.uNickName" @blur='testNickName' autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户账号:" prop="uName">
                    <el-input type="text" v-model="ruleForm.uName" @blur='testName' autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户密码:" prop="uPassword">
                    <el-input type="password" v-model="ruleForm.uPassword" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="手机号:" prop="uPhone">
                    <el-input type="text" v-model="ruleForm.uPhone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户权限:">
                    <el-select
                        v-model="ruleForm.powerSelected"
                        multiple
                        default-first-option
                        placeholder="请选择权限"
                        style='width:260px;'
                    >
                        <el-option
                        v-for="item in dialogPower"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleAddCancel">取 消</el-button>
                <el-button type="primary" @click="handleAddSure('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    addUser,
    queryUserList,
    getAllPower,
    testName,
    testNickName,
    querySingleUser,
    updateUser,
    deleteUser
} from '../api/api'
import waves from '../directive/waves' // 按钮水波纹
import Pagination from './Pagination/index' // secondary package based on el-pagination

export default {
    data() {
        var validateUserName = (rule, value, callback) => {
            setTimeout(() => {
            if (this.isRegisteredName) {
                callback(new Error('该账号已存在'));
            } else if (value === '') {
                callback(new Error('请输入账号'));
            } else {
                callback();
            }
            }, 500)
        };
        var validatePassWord = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        var validateNickName = (rule, value, callback) => {
            setTimeout(() => {
            if (this.isRegisteredNickName) {
                callback(new Error('该用户名已存在'));
            } else if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                callback();
            }
            }, 500)
        };
        var validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else {
                callback();
            }
        };
        return {
            list: [],
            total: 0,
            listQuery: {
                uName: '',
                uNickName: '',
                page: 1,
                pageSize: 10
            },
            listLoading: false, // 加载中
            dialogFormVisible: false, // 添加、编辑弹出框
            formLabelWidth: '120px',
            dialogTitle: '',
            dialogPower: [],
            // 添加、编辑表单验证
            ruleForm: {
                uName: '',
                uPassword: '',
                uNickName: '',
                uPhone: '',
                powerSelected: []
            },
            rules: {
                uName: [{ validator: validateUserName, trigger: 'blur' }],
                uPassword: [{ validator: validatePassWord, trigger: 'blur' }],
                uNickName: [{ validator: validateNickName, trigger: 'blur' }],
                uPhone: [{ validator: validatePhone, trigger: 'blur' }],
            }, 
            handle: '', // 当前操作
            currentDelete: '', // 当前删除(单个/批量)对象
        }
    },
    watch: {
    },
    components: { 
        Pagination,
    },
    directives: { waves },
    created() {
        this.getList()
        getAllPower().then(res => {
            let data = res.data.data
            if (data.code == 200) {
                console.log('获取所有权限：', data)
                data.data.forEach(item => {
                    this.dialogPower.push({
                        value: item.id,
                        label: item.name
                    })
                });
            }
        }), (err) => {
            console.log(err)
        }
    },
    methods: {
        getList() {
            this.listLoading = true
            queryUserList(this.listQuery).then(res => {
                let data = res.data.data
                if (data.code == 200) {
                    this.listLoading = false
                    this.list = data.data
                    this.total = data.total
                }
            }), (err) => {
                console.log(err)
            }
        },
        handleSelectionChange(val) {
            let uNameList = []
            val.forEach(item => {
                uNameList.push(item.uName)
            })
            let str = ''
            uNameList.forEach(item => {
                str += ("'" + item + "',")
            })
            str = str.slice(0, str.lastIndexOf(','))
            this.currentDelete = str
        },
        handleFilter() {
            this.listLoading = true
            this.listQuery.page = 1
            this.listQuery.pageSize = 10
            queryUserList(this.listQuery).then(res => {
                let data = res.data.data
                if (data.code == 200) {
                    this.listLoading = false
                    this.list = data.data
                    this.total = data.data.length
                }
            }), (err) => {
                console.log(err)
            }
        },
        handleAdd() {
            this.dialogTitle = '添加'
            this.handle = 'add'
            this.dialogFormVisible = true
            this.ruleForm = {
                uName: '',
                uPassword: '',
                uNickName: '',
                uPhone: '',
                powerSelected: []
            }
        },
        handleRemove() {
            this.$confirm('是否确定批量删除选中项', '批量删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.currentDelete != '') {
                    deleteUser({uName: this.currentDelete}).then(res => {
                        let data = res.data.data
                        if (data.code == 200) {
                            this.listLoading = false
                            this.$message({
                                message: '批量删除成功',
                                type: 'success'
                            });
                        }
                        this.getList()
                    }), (err) => {
                        console.log(err)
                    }
                } else {
                    this.$message({
                    type: 'info',
                    message: '请选择删除项'
                }); 
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleEdit(val, formName) {
            this.dialogTitle = '编辑'
            this.handle = 'edit'
            this.dialogFormVisible = true
            this.ruleForm.uName = val.uName
            this.ruleForm.uPassword = val.uPassword
            this.ruleForm.uNickName = val.uNickName
            this.ruleForm.uPhone = val.uPhone
            this.ruleForm.powerSelected = val.uPower.split(',').map(item => {
                return item = JSON.parse(item)
            })
            /* querySingleUser({
              uName: val.uName
            }).then(res => {
                console.log(res)
                if (res.data.data.code == 200) {
                    let data = res.data.data.data
                    this.ruleForm.uName = data.uName
                    this.ruleForm.uPassword = data.uPassword
                    this.ruleForm.uNickName = data.uNickName
                    this.ruleForm.uPhone = data.uPhone
                    this.ruleForm.powerSelected = data.uPower.split(',').map(item => {
                        return item = JSON.parse(item)
                    })
                }
            }) */
        },
        handleDelete(val) {
            this.currentDelete = "'" + val.uName + "'"
            this.$confirm('是否确定删除', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteUser({uName: this.currentDelete}).then(res => {
                    let data = res.data.data
                    if (data.code == 200) {
                        this.listLoading = false
                        this.$message({
                            message: data.message,
                            type: 'success'
                        });
                    }
                    this.getList()
                }), (err) => {
                    console.log(err)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleAddSure(formName) {
            if (this.handle == 'add') {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false
                        let uPower =  this.ruleForm.powerSelected.join(',')
                        let ruleForm =  {
                            uName: this.ruleForm.uName,
                            uPassword: this.ruleForm.uPassword,
                            uNickName: this.ruleForm.uNickName,
                            uPhone: this.ruleForm.uPhone,
                            uPower: uPower
                        }
                        console.log('提交的表单', ruleForm)
                        addUser(ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    uName: '',
                                    uPassword: '',
                                    uNickName: '',
                                    uPhone: '',
                                    powerSelected: []
                                }
                                this.getList()
                            }
                        })
                    } else {
                        console.log('表单验证失败')
                    }
                })
            } else if (this.handle == 'edit') {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false
                        let uPower =  this.ruleForm.powerSelected.join(',')
                        let ruleForm =  {
                            uName: this.ruleForm.uName,
                            uPassword: this.ruleForm.uPassword,
                            uNickName: this.ruleForm.uNickName,
                            uPhone: this.ruleForm.uPhone,
                            uPower: uPower
                        }
                        console.log('提交的表单', ruleForm)
                        updateUser(ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: data.message,
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    uName: '',
                                    uPassword: '',
                                    uNickName: '',
                                    uPhone: '',
                                    powerSelected: []
                                }
                                this.getList()
                            }
                        })
                    } else {
                        console.log('表单验证失败')
                    }
                })
            }
            this.handle = ''
        },
        handleAddCancel() {
            this.dialogFormVisible = false
        },
        testNickName() {
            if (this.ruleForm.uNickName != '') {
                testNickName({uNickName: this.ruleForm.uNickName}).then(res => {
                    if (res.data.data.code == 200) {
                        this.isRegisteredNickName = true
                    } else {
                        this.isRegisteredNickName = false
                    }
                })
            }
        },
        testName() {
            if (this.ruleForm.uName != '') {
                testName({uName: this.ruleForm.uName}).then(res => {
                    if (res.data.data.code == 200) {
                        this.isRegisteredName = true
                    } else {
                        this.isRegisteredName = false
                    }
                })
            }
        },
    },
}
</script>

<style lang="scss">
.user-container {
    .user-table {
        width: 99%;
        margin-top: 20px;
    }
    .filter-name {
        font-size: 14px;
    }
    .filter-input {
        width: 200px;
    }
    .filter-item {
        margin-left: 10px;
    }
    .el-table th.gutter{
        display: table-cell!important;
    }
    .el-upload__tip {
        position: absolute;
        left: 120px;
        bottom: 0;
        font-size: 12px;
        color: #606266;
        margin-top: 7px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
    .el-dialog__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        .el-dialog {
            margin: 0 !important;
        }
    }
}
</style>
