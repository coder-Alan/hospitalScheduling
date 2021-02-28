<template>
    <div>
        <div class="login" v-show="!toRegistered">
          <h2 class="login-title">康德医院排班管理系统</h2>
          <div class="login-form">
            <div class="form-title">欢迎登录</div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="60px" class="form">
            <el-form-item label="账号:" prop="userName">
                <el-input type="text" v-model="ruleForm.userName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="passWord">
                <el-input type="password" v-model="ruleForm.passWord" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="form-item">
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                <el-button type="success" @click="resetForm('ruleForm')" class="success">注册</el-button>
            </el-form-item>
          </el-form>
          </div>
        </div>
        <div class="login" v-show="toRegistered">
          <div class="login-form">
            <div class="form-title">注册</div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="form">
              <el-form-item label="用户名:" prop="number">
                <el-input type="text" v-model="ruleForm.number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="账号:" prop="userName">
                  <el-input type="text" v-model="ruleForm.userName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码:" prop="passWord">
                  <el-input type="password" v-model="ruleForm.passWord" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码:" prop="againPassWord">
                  <el-input type="password" v-model="ruleForm.againPassWord" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别:" prop="sex">
                  <el-input type="text" v-model="ruleForm.sex" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="手机号:" prop="phone">
                  <el-input type="text" v-model="ruleForm.phone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item class="form-item">
                  <el-button type="primary" @click="registeredSure()">确定</el-button>
                  <el-button type="success" @click="registeredCancel()" class="success">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
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
      var validateAgainPassWord = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value !== this.ruleForm.againPassWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateNumber = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (value !== this.ruleForm.number) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateSex = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入性别'));
        } else if (value !== this.ruleForm.sex) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (value !== this.ruleForm.phone) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          userName: '',
          passWord: '',
          againPassWord: '',
          number: '',
          sex: '',
          phone: ''
        },
        rules: {
          userName: [{ validator: validateUserName, trigger: 'blur' }],
          passWord: [{ validator: validatePassWord, trigger: 'blur' }],
          againPassWord: [{ validator: validatePassWord, trigger: 'blur' }],
          number: [{ validator: validateNumber, trigger: 'blur' }],
          sex: [{ validator: validateSex, trigger: 'blur' }],
          phone: [{ validator: validatePhone, trigger: 'blur' }],
        },
        toRegistered: false
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('登录')
            this.$http.post(HTTP + LOGIN,{
                username: this.ruleForm.userName,
                password: this.ruleForm.passWord
            },{emulateJSON:true}).then((data)=>{
                if (data.data.msg == '用户名或密码错误') {
                    this.$message.error('用户名或密码错误');
                } else if (data.data.msg == '成功') {
                    localStorage.token = data.data.data.token;
                    console.log('登录成功');
                    this.$message({
                      message: '登陆成功',
                      type: 'success'
                    });
                    setTimeout(()=>{
                      location.href = '/'
                    },500)
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
        // this.$refs[formName].resetFields();
        this.toRegistered = true
      },
      registeredSure() {
        this.$message({
          message: '注册成功',
          type: 'success'
        });
      },
      registeredCancel() {
        this.toRegistered = false
      }
    }
}
</script>

<style>
.el-form-item__label{
  /* color: #ffffff; */
}
</style>

<style scoped>
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('./assets/image/login.jpg') no-repeat;
  background-size: cover;
}
.login-title {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, 0);
  color: #fff;
  font-size: 48px;
  font-style: italic;
  letter-spacing: 5px;
  text-shadow: 5px 5px 5px red;
}
.login-form {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 360px;
  /* margin-left: -50px; */
  padding-top: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0 0 5px 5px;
}
.form-title {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(0, -100%);
  width: 100%;
  padding: 5px 0 5px 20px;
  color: rgb(0, 4, 255);
  font-size: 20px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.877);
  border-radius: 5px 5px 0 0;
  box-sizing: border-box;
}
.form{
  width: 300px;
  margin-left: -50px;
}
.form-item{
  padding: 0 20px;
}
.success{
  float: right;
}
</style>