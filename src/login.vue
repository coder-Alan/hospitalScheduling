<template>
    <div>
        <div class="login" v-show="!toRegistered">
          <h2 class="login-title">康德医院排班管理系统</h2>
          <div class="login-form">
            <div class="form-title">欢迎登录</div>
            <el-form :model="loginRuleForm" status-icon :rules="rules" ref="loginRuleForm" label-width="60px" class="form">
            <el-form-item label="账号:" prop="uName">
                <el-input type="text" v-model="loginRuleForm.uName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="uPassword">
                <el-input type="password" v-model="loginRuleForm.uPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="form-item">
                <el-button type="primary" @click="submitForm('loginRuleForm')">登录</el-button>
                <el-button type="success" @click="resetForm()" class="success">注册</el-button>
            </el-form-item>
          </el-form>
          </div>
        </div>
        <div class="login" v-show="toRegistered">
          <div class="login-form">
            <div class="form-title">注册</div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="form">
              <el-form-item label="用户名:" prop="uNickName">
                <el-input type="text" v-model="ruleForm.uNickName" @blur='testNickName' autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="账号:" prop="uName">
                  <el-input type="text" v-model="ruleForm.uName" @blur='testName' autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码:" prop="uPassword">
                  <el-input type="password" v-model="ruleForm.uPassword" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码:" prop="againPassWord">
                  <el-input type="password" v-model="ruleForm.againPassWord" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="手机号:" prop="uPhone">
                  <el-input type="text" v-model="ruleForm.uPhone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item class="form-item">
                  <el-button type="primary" @click="registeredSure('ruleForm')">确定</el-button>
                  <el-button type="success" @click="registeredCancel()" class="success">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
    </div>
</template>

<script>
import {addUser, testName, testNickName} from './api/api'
import axios from 'axios'

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
      var validateAgainPassWord = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value !== this.ruleForm.againPassWord) {
          callback(new Error('两次输入密码不一致!'));
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
        loginRuleForm: {
          uName: '',
          uPassword: '',
        },
        ruleForm: {
          uName: '',
          uPassword: '',
          againPassWord: '',
          uNickName: '',
          uPhone: '',
        },
        rules: {
          uName: [{ validator: validateUserName, trigger: 'blur' }],
          uPassword: [{ validator: validatePassWord, trigger: 'blur' }],
          againPassWord: [{ validator: validatePassWord, trigger: 'blur' }],
          uNickName: [{ validator: validateNickName, trigger: 'blur' }],
          uPhone: [{ validator: validatePhone, trigger: 'blur' }],
        },
        toRegistered: false,
        isRegisteredName: false,
        isRegisteredNickName: false,
      };
    },
    methods: {
      testNickName() {
        if (this.ruleForm.uNickName != '') {
          testNickName({uNickName: this.ruleForm.uNickName}).then(res => {
            if (res.data.data.code == 200) {
              this.isRegisteredName = true
            } else {
              this.isRegisteredName = false
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('登录')
            axios.post('http://192.168.1.5:3000/api/login', {
              uName: this.loginRuleForm.uName,
              uPassword: this.loginRuleForm.uPassword
            }).then(res => {
              console.log(res)
              let data = res.data.data
              if (data.code == 200) {
                localStorage.setItem('userToken', data.data.uToken)
                localStorage.setItem('userName', data.data.uName)
                localStorage.setItem('userPower', data.data.uPower)
                this.$message({
                  message: '登陆成功,3秒后自动进入系统',
                  type: 'success'
                });
                setTimeout(()=>{
                  location.href = '/'
                }, 3000)
              } else {
                this.$message.error('登录失败');
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm() {
        // this.$refs[formName].resetFields();
        this.toRegistered = true
      },
      // 注册确认
      registeredSure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('注册')
            console.log('提交的表单信息：', this.ruleForm)
            let ruleForm = {
              uName: this.ruleForm.uName,
              uPassword: this.ruleForm.uPassword,
              uNickName: this.ruleForm.uNickName,
              uPhone: this.ruleForm.uPhone
            }
            addUser(ruleForm).then(res => {
              console.log(res)
              let data = res.data.data
              if (data.code == 200) {
                this.$message({
                  message: '注册成功',
                  type: 'success'
                });
                this.toRegistered = false;
              }
            })
          } else {
            console.log('error registered!!');
            return false;
          }
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