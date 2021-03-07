<template>
<!-- 地点信息表 -->
    <div class="user-container">
        <div class="filter-container">
            <label for="searchName" class="filter-name">地点编号：</label>
            <el-input id="searchName" v-model.trim="listQuery.dCode" style="padding-right:20px;" class="filter-input" placeholder="请输入" />
            <label for="searchNickName" class="filter-name">地点名称：</label>
            <el-input id="searchNickName" v-model.trim="listQuery.dName" class="filter-input" placeholder="请输入" />
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
            <el-table-column label="地点编号" width="150" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.dCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="地点名称" width="200" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.dName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="所属科室" width="300" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.kName }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="地点图片" show-overflow-tooltip width="200" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.dImgUrlList }}</span>
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
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="form">
                <el-form-item label="地点编号:" prop="dCode">
                    <el-input type="text" v-model="ruleForm.dCode" @blur='testDCode' autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地点名称:" prop="dName">
                    <el-input type="text" v-model="ruleForm.dName" @blur='testDName' autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属科室:" prop="kName">
                    <el-select v-model="ruleForm.kName" placeholder="请选择">
                        <el-option
                        v-for="item in kNameList"
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
    addPlaces,
    queryPlacesList,
    queryAllKName,
    testDCode,
    testDName,
    querySinglePlaces,
    updatePlaces,
    deletePlaces,
} from '../api/places'
import waves from '../directive/waves' // 按钮水波纹
import Pagination from './Pagination/index' // secondary package based on el-pagination

export default {
    data() {
        var validateDCode = (rule, value, callback) => {
            setTimeout(() => {
                if (this.isRegisteredDCode == 201) {
                    callback(new Error('该地点编号已存在'));
                    this.isRegisteredDCode = ''
                } else if (value === '') {
                    callback(new Error('请输入地点编号'));
                } else {
                    callback();
                }
            }, 500)
        };
        var validateDName = (rule, value, callback) => {
            setTimeout(() => {
                if (this.isRegisteredDName == 201) {
                    callback(new Error('该地点名称已存在'));
                    this.isRegisteredDName = ''
                } else if (value === '') {
                    callback(new Error('请输入地点名称'));
                } else {
                    callback();
                }
            }, 500)
        };
        var validateKName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入所属科室'));
            } else {
                callback();
            }
        };
        return {
            list: [],
            total: 0,
            listQuery: {
                dName: '',
                kName: '',
                page: 1,
                pageSize: 10
            },
            listLoading: false, // 加载中
            dialogFormVisible: false, // 添加、编辑弹出框
            dialogTitle: '',
            // 添加、编辑表单验证
            ruleForm: {
                dCode: '',
                dName: '',
                kName: '',
            },
            rules: {
                dCode: [{ validator: validateDCode, trigger: 'blur' }],
                dName: [{ validator: validateDName, trigger: 'blur' }],
                // kName: [{ validator: validateKName, trigger: 'blur' }],
            }, 
            handle: '', // 当前操作
            currentDelete: '', // 当前删除(单个/批量)对象

            kNameList: [],
            selectedKName: ''
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
        queryAllKName().then(res => {
                let data = res.data.data
                if (data.code == 200) {
                    data.data.forEach(item => {
                        this.kNameList.push({
                            value: item.kName,
                            label: item.kName
                        })
                    })
                }
            }), (err) => {
                console.log(err)
            }
    },
    methods: {
        getList() {
            this.listLoading = true
            queryPlacesList(this.listQuery).then(res => {
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
            let dCodeList = []
            val.forEach(item => {
                dCodeList.push(item.dCode)
            })
            let str = ''
            dCodeList.forEach(item => {
                str += ("'" + item + "',")
            })
            str = str.slice(0, str.lastIndexOf(','))
            this.currentDelete = str
        },
        handleFilter() {
            this.listLoading = true
            this.listQuery.page = 1
            this.listQuery.pageSize = 10
            queryPlacesList(this.listQuery).then(res => {
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
                dCode: '',
                dName: '',
                kName: '',
            }
        },
        handleRemove() {
            this.$confirm('是否确定批量删除选中项', '批量删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.currentDelete != '') {
                    deletePlaces({dCode: this.currentDelete}).then(res => {
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
            this.ruleForm.dCode = val.dCode
            this.ruleForm.dName = val.dName
            this.ruleForm.kName = val.kName
        },
        handleDelete(val) {
            this.currentDelete = "'" + val.dCode + "'"
            this.$confirm('是否确定删除', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deletePlaces({dCode: this.currentDelete}).then(res => {
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
                        addPlaces(this.ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    dCode: '',
                                    dName: '',
                                    kName: '',
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
                        updatePlaces(this.ruleForm).then(res => {
                            let data = res.data.data
                            if (data.code == 200) {
                                this.$message({
                                    message: data.message,
                                    type: 'success'
                                });
                                this.ruleForm = {
                                    dCode: '',
                                    dName: '',
                                    kName: '',
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
        testDCode() {
            if (this.ruleForm.dCode != '') {
                testDCode({dCode: this.ruleForm.dCode}).then(res => {
                    if (res.data.data.code == 201) {
                        this.isRegisteredDCode = 201
                    } else {
                        this.isRegisteredDCode = ''
                    }
                })
            }
        },
        testDName() {
            if (this.ruleForm.dName != '') {
                testDName({dName: this.ruleForm.dName}).then(res => {
                    if (res.data.data.code == 201) {
                        this.isRegisteredDName = 201
                    } else if (res.data.data.code == 300) {
                        this.isRegisteredDName = 300
                    } else {
                        this.isRegisteredDName = ''
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
