<template>
  <div class="user-container">
    <div class="filter-container">
      <label for="searchName" class="filter-name">用户账号：</label>
      <el-input id="searchName" v-model.trim="listQuery.uName" style="padding-right:20px;" class="filter-input" placeholder="请输入" />
      <label for="searchNickName" class="filter-name">用户名称：</label>
      <el-input id="searchNickName" v-model.trim="listQuery.uNickName" class="filter-input" placeholder="请输入" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleAdd">添加</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleRemove">批量删除</el-button>
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
      <el-table-column label="用户头像" show-overflow-tooltip='true' width="170" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.uImgUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template>
          <el-button type="success" size="mini" @click="userEdit">编辑</el-button>
          <el-button type="danger" size="mini" @click="userDelate">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
  </div>
</template>

<script>
// import waves from '@/directive/waves'
// import { getRecord } from '@/api/product'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        uName: '',
        uNickName: '',
        page: 1,
        pageSize: 10
      },
      listLoading: false,
    }
  },
  watch: {
  },
//   components: { Pagination },
//   directives: { waves },
  created() {
      this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.axios.post('http://192.168.1.5:3000/api/queryUserList', this.listQuery)
        .then(res => {
            let data = res.data.data
            console.log(data)
            if (data.code == 200) {
                this.listLoading = false
                this.list = data.data
                this.total = data.total
            }
        }), (err) => {
            console.log(err)
        }
      /* getRecord({deviceCode: this.listQuery.deviceCode, startTime: this.listQuery.startTime, endTime: this.listQuery.endTime, page: this.listQuery.page, pageSize: this.listQuery.pageSize}).then(res => {
        if (res.code == 200) {
          console.log(111, res.data.content)
          this.listLoading = false
          this.list = res.data.content
          this.total = res.data.totalElements
          console.log(555, res.data.totalElements)
        } else {
          this.elTools.onError('用户信息列表获取失败')
        }
      }) */
    },
    handleSelectionChange(val) {
      console.log('复选框：', val)
    },
    handleFilter() {
      this.getList()
    },
    handleAdd() {

    },
    handleRemove() {

    },
    userEdit() {

    },
    userDelate() {

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
  }
</style>
