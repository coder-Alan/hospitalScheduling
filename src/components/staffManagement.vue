<template>
    <div class="user-container">
        <div class="filter-container">
            <label for="searchName" class="filter-name">员工编号：</label>
            <el-input id="searchName" v-model.trim="listQuery.yCode" style="padding-right:20px;" class="filter-input" placeholder="请输入" />
            <label for="searchNickName" class="filter-name">员工姓名：</label>
            <el-input id="searchNickName" v-model.trim="listQuery.yName" class="filter-input" placeholder="请输入" />
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
            <el-table-column label="员工编号" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.yCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户编号" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.uCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="员工姓名" width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.yName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="员工性别" width="80" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.ySex }}</span>
                </template>
            </el-table-column>
            <el-table-column label="员工类别" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.yCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="员工职称" width="150" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.yTitle }}</span>
                </template>
            </el-table-column>
            <el-table-column label="所属科室" show-overflow-tooltip width="170" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.yDepartment }}</span>
                </template>
            </el-table-column>
            <el-table-column label="手机号码" show-overflow-tooltip width="170" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.yPhone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="员工头像" show-overflow-tooltip width="170" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.yImgUrl }}</span>
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
                <el-form-item label="员工编号:" prop="yCode">
                    <el-input type="text" v-model="ruleForm.yCode" @blur='testYCode' autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户编号:" prop="uCode">
                    <el-input type="text" v-model="ruleForm.uCode" @blur='testUCode' autocomplete="off"></el-input>
                </el-form-item>
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
                <el-button @click="handleAddCancel">取 消</el-button>
                <el-button type="primary" @click="handleAddSure('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    addStaff,
    queryStaffList,
    testYCode,
    testUCode,
    querySingleStaff,
    updateStaff,
    deleteStaff
} from '../api/staff'
import waves from '../directive/waves' // 按钮水波纹
import Pagination from './Pagination/index' // secondary package based on el-pagination

export default {
    data() {
        var validateYCode = (rule, value, callback) => {
            setTimeout(() => {
                if (this.isRegisteredYCode) {
                    callback(new Error('该员工编号已存在'));
                    this.isRegisteredYCode = false
                } else if (value === '') {
                    callback(new Error('请输入员工编号'));
                } else {
                    callback();
                }
            }, 500)
        };
        var validateUCode = (rule, value, callback) => {
            setTimeout(() => {
                if (this.isRegisteredUCode) {
                    callback(new Error('该用户编号已存在'));
                    this.isRegisteredUCode = false
                } else if (value === '') {
                    callback(new Error('请输入用户编号'));
                } else if (value == 1) {
                    callback(new Error('该用户编号无法绑定'));
                } else {
                    callback();
                }
            }, 500)
        };
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
            list: [],
            total: 0,
            listQuery: {
                yCode: '',
                yName: '',
                page: 1,
                pageSize: 10
            },
            listLoading: false, // 加载中
            dialogFormVisible: false, // 添加、编辑弹出框
            dialogTitle: '',
            // 添加、编辑表单验证
            ruleForm: {
                yCode: '',
                uCode: '',
                yName: '',
                ySex: '',
                yCategory: '',
                yTitle: '',
                yDepartment: '',
                yPhone: '',
                yImgUrl: ''
            },
            rules: {
                yCode: [{ validator: validateYCode, trigger: 'blur' }],
                uCode: [{ validator: validateUCode, trigger: 'blur' }],
                yName: [{ validator: validateYName, trigger: 'blur' }],
                yCategory: [{ validator: validateYCategory, trigger: 'blur' }],
                yTitle: [{ validator: validateYTitle, trigger: 'blur' }],
                yDepartment: [{ validator: validateYDepartment, trigger: 'blur' }],
                yPhone: [{ validator: validateYPhone, trigger: 'blur' }],
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
    },
    methods: {
        getList() {
            this.listLoading = true
            queryStaffList(this.listQuery).then(res => {
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
                uNameList.push(item.yCode)
            })
            this.currentDelete = uNameList.join(',')
        },
        handleFilter() {
            this.listLoading = true
            this.listQuery.page = 1
            this.listQuery.pageSize = 10
            queryStaffList(this.listQuery).then(res => {
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
                yCode: '',
                uCode: '',
                yName: '',
                ySex: '',
                yCategory: '',
                yTitle: '',
                yDepartment: '',
                yPhone: '',
                yImgUrl: ''
            }
        },
        handleRemove() {
            this.$confirm('是否确定批量删除选中项', '批量删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.currentDelete != '') {
                    deleteStaff({yCode: this.currentDelete}).then(res => {
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
            this.ruleForm.yCode = val.yCode
            this.ruleForm.uCode = val.uCode
            this.ruleForm.yName = val.yName
            this.ruleForm.ySex = val.ySex
            this.ruleForm.yCategory = val.yCategory
            this.ruleForm.yTitle = val.yTitle
            this.ruleForm.yDepartment = val.yDepartment
            this.ruleForm.yPhone = val.yPhone
            this.ruleForm.yImgUrl = val.yImgUrl
        },
        handleDelete(val) {
            this.currentDelete = val.yCode
            this.$confirm('是否确定删除', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteStaff({yCode: this.currentDelete}).then(res => {
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
                        console.log('提交的表单', this.ruleForm)
                        addStaff(this.ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    yCode: '',
                                    uCode: '',
                                    yName: '',
                                    ySex: '',
                                    yCategory: '',
                                    yTitle: '',
                                    yDepartment: '',
                                    yPhone: '',
                                    yImgUrl: ''
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
                        console.log('提交的表单', this.ruleForm)
                        updateStaff(this.ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: data.message,
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    yCode: '',
                                    uCode: '',
                                    yName: '',
                                    ySex: '',
                                    yCategory: '',
                                    yTitle: '',
                                    yDepartment: '',
                                    yPhone: '',
                                    yImgUrl: ''
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
        testYCode() {
            if (this.ruleForm.yCode != '') {
                testYCode({yCode: this.ruleForm.yCode}).then(res => {
                    if (res.data.data.code == 200) {
                        this.isRegisteredYCode = true
                    } else {
                        this.isRegisteredYCode = false
                    }
                })
            }
        },
        testUCode() {
            console.log(this.ruleForm)
            if (this.ruleForm.uCode != '') {
                testUCode({uCode: this.ruleForm.uCode}).then(res => {
                    if (res.data.data.code == 200) {
                        this.isRegisteredUCode = true
                    } else {
                        this.isRegisteredUCode = false
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
    .el-dialog__body {
        padding: 0 30px;
    }
    .el-dialog__footer {
        padding: 0 30px 20px;
    }
}
</style>
