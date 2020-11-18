<template>
    <div>
        <div class="login">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="50px" class="form">
            <el-form-item label="账号" prop="userName">
                <el-input type="password" v-model="ruleForm.userName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passWord">
                <el-input type="password" v-model="ruleForm.passWord" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="form-item">
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                <el-button type="success" @click="resetForm('ruleForm')" class="success">注册</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {HTTP, LOGIN} from './api/api.js'
export default {
    data() {
      var validateUserName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
          if (this.ruleForm.userName !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePassWord = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value !== this.ruleForm.passWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          userName: '',
          passWord: '',
        },
        rules: {
          userName: [
            { validator: validateUserName, trigger: 'blur' }
          ],
          passWord: [
            { validator: validatePassWord, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(HTTP + LOGIN,{
                username: this.ruleForm.userName,
                password: this.ruleForm.passWord
            },{emulateJSON:true}).then((data)=>{
                if (data.data.msg == '用户名或密码错误') {
                    this.$message.error('用户名或密码错误');
                } else if (data.data.msg == '成功') {
                    localStorage.token = data.data.data.token;
                    location.href = './'
                }
            },(err)=>{
                this.$message.error('登录失败');
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style scoped>
.login {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.form{
    width: 300px;
}
.form-item{
    padding: 0 20px;
}
.success{
    float: right;
}
</style>