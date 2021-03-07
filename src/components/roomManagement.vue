<template>
<!-- 科室信息表 -->
    <div class="user-container">
        <div class="filter-container">
            <label for="searchName" class="filter-name">科室编号：</label>
            <el-input id="searchName" v-model.trim="listQuery.kCode" style="padding-right:20px;" class="filter-input" placeholder="请输入" />
            <label for="searchNickName" class="filter-name">科室名称：</label>
            <el-input id="searchNickName" v-model.trim="listQuery.kName" class="filter-input" placeholder="请输入" />
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
            <el-table-column label="科室编号" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.kCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="科室名称" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.kName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="科室负责人编号" width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.yCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="科室简介" width="400" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.kBrief }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.remarks }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="科室图片" show-overflow-tooltip width="200" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.yImgUrl }}</span>
                </template>
            </el-table-column> -->
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
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="form">
                <el-form-item label="科室编号:" prop="kCode">
                    <el-input type="text" v-model="ruleForm.kCode" @blur='testKCode' autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="科室名称:" prop="kName">
                    <el-input type="text" v-model="ruleForm.kName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="科室负责人编号:" prop="yCode">
                    <el-input type="text" v-model="ruleForm.yCode" @blur='testYCode' autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="科室简介:" prop="kBrief">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="ruleForm.kBrief" autocomplete="off"></el-input>
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
    addRoom,
    queryRoomList,
    testKCode,
    testYCode,
    querySingleRoom,
    updateRoom,
    deleteRoom,
} from '../api/room'
import waves from '../directive/waves' // 按钮水波纹
import Pagination from './Pagination/index' // secondary package based on el-pagination

export default {
    data() {
        var validateKCode = (rule, value, callback) => {
            setTimeout(() => {
                if (this.isRegisteredKCode) {
                    callback(new Error('该科室编号已存在'));
                    this.isRegisteredKCode = false
                } else if (value === '') {
                    callback(new Error('请输入科室编号'));
                } else {
                    callback();
                }
            }, 500)
        };
        var validateKName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入科室名称'));
            } else {
                callback();
            }
        };
        var validateYCode = (rule, value, callback) => {
            setTimeout(() => {
                if (this.isRegisteredYCode == 201) {
                    callback(new Error('该员工编号已是其他科室的负责人'));
                    this.isRegisteredYCode = ''
                } else if (this.isRegisteredYCode == 300) {
                    callback(new Error('在员工信息中不存在该员工编号'));
                    this.isRegisteredYCode = ''
                } else if (value === '') {
                    callback(new Error('请输入员工编号'));
                } else {
                    callback();
                }
            }, 500)
        };
        return {
            list: [],
            total: 0,
            listQuery: {
                kCode: '',
                kName: '',
                page: 1,
                pageSize: 10
            },
            listLoading: false, // 加载中
            dialogFormVisible: false, // 添加、编辑弹出框
            dialogTitle: '',
            // 添加、编辑表单验证
            ruleForm: {
                kCode: '',
                kName: '',
                yCode: '',
                kBrief: '',
                remarks: ''
            },
            rules: {
                kCode: [{ validator: validateKCode, trigger: 'blur' }],
                kName: [{ validator: validateKName, trigger: 'blur' }],
                yCode: [{ validator: validateYCode, trigger: 'blur' }],
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
            queryRoomList(this.listQuery).then(res => {
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
            let kCodeList = []
            val.forEach(item => {
                kCodeList.push(item.kCode)
            })
            let str = ''
            kCodeList.forEach(item => {
                str += ("'" + item + "',")
            })
            str = str.slice(0, str.lastIndexOf(','))
            this.currentDelete = str
        },
        handleFilter() {
            this.listLoading = true
            this.listQuery.page = 1
            this.listQuery.pageSize = 10
            queryRoomList(this.listQuery).then(res => {
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
                kCode: '',
                kName: '',
                yCode: '',
                kBrief: '',
                remarks: ''
            }
        },
        handleRemove() {
            this.$confirm('是否确定批量删除选中项', '批量删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.currentDelete != '') {
                    deleteRoom({kCode: this.currentDelete}).then(res => {
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
            this.ruleForm.kCode = val.kCode
            this.ruleForm.kName = val.kName
            this.ruleForm.yCode = val.yCode
            this.ruleForm.kBrief = val.kBrief
            this.ruleForm.remarks = val.remarks
        },
        handleDelete(val) {
            this.currentDelete = "'" + val.kCode + "'"
            this.$confirm('是否确定删除', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRoom({kCode: this.currentDelete}).then(res => {
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
                        addRoom(this.ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    kCode: '',
                                    kName: '',
                                    yCode: '',
                                    kBrief: '',
                                    remarks: ''
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
                        updateRoom(this.ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: data.message,
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    kCode: '',
                                    kName: '',
                                    yCode: '',
                                    kBrief: '',
                                    remarks: ''
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
        testKCode() {
            console.log(this.ruleForm)
            if (this.ruleForm.kCode != '') {
                testKCode({kCode: this.ruleForm.kCode}).then(res => {
                    if (res.data.data.code == 200) {
                        this.isRegisteredKCode = true
                    } else {
                        this.isRegisteredKCode = false
                    }
                })
            }
        },
        testYCode() {
            if (this.ruleForm.yCode != '') {
                testYCode({yCode: this.ruleForm.yCode}).then(res => {
                    if (res.data.data.code == 201) {
                        this.isRegisteredYCode = 201
                    } else if (res.data.data.code == 300) {
                        this.isRegisteredYCode = 300
                    } else {
                        this.isRegisteredYCode = ''
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
