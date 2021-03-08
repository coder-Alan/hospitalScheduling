<template>
<!-- 班次信息表 -->
    <div class="user-container">
        <div class="filter-container">
            <label for="searchName" class="filter-name">班次编号：</label>
            <el-input id="searchName" v-model.trim="listQuery.bCode" style="padding-right:20px;" class="filter-input" placeholder="请输入" />
            <label for="searchNickName" class="filter-name">班次名称：</label>
            <el-input id="searchNickName" v-model.trim="listQuery.bName" class="filter-input" placeholder="请输入" />
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
            <el-table-column label="班次编号" width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.bCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="班次名称" width="170" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.bName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" width="200" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.bStartTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" width="200" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.bEndTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.remarks }}</span>
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
                <el-form-item label="班次编号:" prop="bCode">
                    <el-input type="text" v-model="ruleForm.bCode" @blur='testBCode' autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="班次名称:" prop="bName">
                    <el-input type="text" v-model="ruleForm.bName" @blur='testBName' autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始时间:" prop="bStartTime">
                    <el-time-picker
                        arrow-control
                        v-model="ruleForm.bStartTime"
                        value-format= 'HH:mm:ss'
                        placeholder="开始时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="结束时间:" prop="bEndTime">
                    <el-time-picker
                        arrow-control
                        value-format= 'HH:mm:ss'
                        v-model="ruleForm.bEndTime"
                        placeholder="结束时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="备注:" prop="remarks">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="ruleForm.remarks" autocomplete="off"></el-input>
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
    addClasses,
    queryClassesList,
    testBCode,
    testBName,
    querySingleClasses,
    updateClasses,
    deleteClasses,
} from '../api/classes'
import waves from '../directive/waves' // 按钮水波纹
import Pagination from './Pagination/index' // secondary package based on el-pagination

export default {
    data() {
        var validateBCode = (rule, value, callback) => {
            setTimeout(() => {
                if (this.isRegisteredBCode == 201) {
                    callback(new Error('该班次编号已存在'));
                    this.isRegisteredBCode = ''
                } else if (value === '') {
                    callback(new Error('请输入班次编号'));
                } else {
                    callback();
                }
            }, 500)
        };
        var validateBName = (rule, value, callback) => {
            setTimeout(() => {
                if (this.isRegisteredBName == 201) {
                    callback(new Error('该班次名称已存在'));
                    this.isRegisteredBName = ''
                } else if (value === '') {
                    callback(new Error('请输入班次名称'));
                } else {
                    callback();
                }
            }, 500)
        };
        var validateBStartTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入开始时间'));
            } else {
                callback();
            }
        };
        var validateBEndTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入结束时间'));
            } else {
                callback();
            }
        };
        return {
            list: [],
            total: 0,
            listQuery: {
                bCode: '',
                bName: '',
                page: 1,
                pageSize: 10
            },
            listLoading: false, // 加载中
            dialogFormVisible: false, // 添加、编辑弹出框
            dialogTitle: '',
            // 添加、编辑表单验证
            ruleForm: {
                bCode: '',
                bName: '',
                bStartTime: '',
                bEndTime: '',
                remarks: '',
            },
            rules: {
                bCode: [{ validator: validateBCode, trigger: 'blur' }],
                bName: [{ validator: validateBName, trigger: 'blur' }],
                bStartTime: [{ validator: validateBStartTime, trigger: 'blur' }],
                bEndTime: [{ validator: validateBEndTime, trigger: 'blur' }],
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
            queryClassesList(this.listQuery).then(res => {
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
            let bCodeList = []
            val.forEach(item => {
                bCodeList.push(item.bCode)
            })
            let str = ''
            bCodeList.forEach(item => {
                str += ("'" + item + "',")
            })
            str = str.slice(0, str.lastIndexOf(','))
            this.currentDelete = str
        },
        handleFilter() {
            this.listLoading = true
            this.listQuery.page = 1
            this.listQuery.pageSize = 10
            queryClassesList(this.listQuery).then(res => {
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
                bCode: '',
                bName: '',
                bStartTime: '',
                bEndTime: '',
                remarks: '',
            }
        },
        handleRemove() {
            this.$confirm('是否确定批量删除选中项', '批量删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.currentDelete != '') {
                    deleteClasses({bCode: this.currentDelete}).then(res => {
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
            this.ruleForm.bCode = val.bCode
            this.ruleForm.bName = val.bName
            this.ruleForm.bStartTime = val.bStartTime
            this.ruleForm.bEndTime = val.bEndTime
            this.ruleForm.remarks = val.remarks
        },
        handleDelete(val) {
            this.currentDelete = "'" + val.bCode + "'"
            this.$confirm('是否确定删除', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteClasses({bCode: this.currentDelete}).then(res => {
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
                        addClasses(this.ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    bCode: '',
                                    bName: '',
                                    bStartTime: '',
                                    bEndTime: '',
                                    remarks: '',
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
                        updateClasses(this.ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: data.message,
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    bCode: '',
                                    bName: '',
                                    bStartTime: '',
                                    bEndTime: '',
                                    remarks: '',
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
            this.ruleForm = {
                bCode: '',
                bName: '',
                bStartTime: '',
                bEndTime: '',
                remarks: '',
            }
        },
        testBCode() {
            if (this.ruleForm.bCode != '') {
                testBCode({bCode: this.ruleForm.bCode}).then(res => {
                    if (res.data.data.code == 201) {
                        this.isRegisteredBCode = 201
                    } else {
                        this.isRegisteredBCode = ''
                    }
                })
            }
        },
        testBName() {
            if (this.ruleForm.bName != '') {
                testBName({bName: this.ruleForm.bName}).then(res => {
                    if (res.data.data.code == 201) {
                        this.isRegisteredBName = 201
                    } else if (res.data.data.code == 300) {
                        this.isRegisteredBName = 300
                    } else {
                        this.isRegisteredBName = ''
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
