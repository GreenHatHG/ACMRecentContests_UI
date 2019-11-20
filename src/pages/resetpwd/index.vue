<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div
      class="page-login--layer page-login--layer-time"
      flex="main:center cross:center">
      {{time}}
    </div>
    <div class="page-login--layer">
      <div
        class="page-login--content"
        flex="dir:top main:justify cross:center box:justify">
        <div class="page-login--content-header">
          <p class="page-login--content-header-motto">
            ACM--国际大学生程序设计竞赛
          </p>
        </div>
        <div
          class="page-login--content-main"
          flex="dir:top main:center cross:center">
          <!-- logo -->
          <img class="page-login--logo" src="../../views/system/login/image/login_logo.png">
          <!-- 表单 -->
          <div class="page-resetpwd--form">
            <el-card shadow="never">
              <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
                <el-form-item prop="mail">
                  <el-input type="text" v-model="formLogin.mail" placeholder="邮箱" maxlength="30" show-word-limit>
                    <i slot="prepend" class="fa fa-envelope-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" v-model="formLogin.password" placeholder="密码" clearable show-password maxlength="30" show-word-limit>
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password_confirm">
                  <el-input type="password" v-model="formLogin.password_confirm" placeholder="确认密码" clearable show-password maxlength="30" show-word-limit>
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input type="text" v-model="formLogin.code" placeholder="验证码" maxlength="6" show-word-limit>
                    <i slot="prepend" class="fa fa-dot-circle-o"></i>
                    <template slot="append">
                      <el-button :class="{disabled: !this.canClick}" size="default" @click="getVerificationCode" type="primary" class="button-login" :loading="lodingState">{{content}}</el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-button size="default" @click="submit" type="primary" class="button-login">重置密码</el-button>
              </el-form>
            </el-card>
            <p
              class="page-login--options"
              flex="main:justify cross:center">
              <span @click="redirectionLogin"><d2-icon  name="question-circle"/>登录页面</span>
              <span>
                <a style="text-decoration:none;color:#409EFF" @click="redirectionRegister">注册用户</a>
              </span>
            </p>
            <el-button class="page-login--quick" size="default" type="info" @click="redirectionIndex">
              游客访问
            </el-button>
          </div>
        </div>
        <div class="page-login--content-footer">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import { getCode } from '@/api/getCode'
import { resetpwd } from '@/api/resetpwd'

export default {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formLogin.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      timeInterval: null,
      time: dayjs().format('HH:mm:ss'),
      dialogVisible: false,
      // 表单
      formLogin: {
        username: '',
        password: '',
        password_confirm: '',
        code: '',
        mail: ''
      },
      //密码显示
      loadingReset: false,
      // 校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        password_confirm:[
          {validator: validatePass, trigger: 'blur'}
        ]
      },
      content: '发送验证码',
      totalTime: 60,
      canClick: true,
      lodingState: false
    }
  },
  mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    submit(){
      this.$refs["loginForm"].validate((valid) =>{
        if(valid){
          this.loadingReset = true
          resetpwd({
            password: this.formLogin.password,
            mail: this.formLogin.mail,
            code: this.formLogin.code
          }).then(res =>{
            this.loadingReset = false
            this.$message.success("重置成功")
            this.$router.push({path:'/login'})
          }).catch(err =>{
            this.loadingReset = false
          })
        }else{
          this.$message.error("提交失败,请检查是否有未符合要求的信息")
        }
        });
    },
    getVerificationCode(){
      this.lodingState = true
      if (!this.canClick) return
      this.canClick = false
      let s = this.isEmail(this.formLogin.mail)
      console.log(s)
      if(s !== ''){
        this.$message.error(s)
        return
      }
      getCode({
        username: this.formLogin.username,
        mail: this.formLogin.mail,
        type: 'resetpwd'
      }).then(res => {
        this.lodingState = false
        this.$message.success("发送到邮箱成功，如果没有收到，请检查垃圾箱")
        this.content = this.totalTime + 's后重试'
        let clock = window.setInterval(() => {
          this.totalTime--
          this.content = this.totalTime + 's后重试'
          if (this.totalTime < 0) {
            this.lodingState = false
            window.clearInterval(clock)
            this.content = '重新发送验证码'
            this.totalTime = 60
            this.canClick = true   //这里重新开启
          }
        }, 1000)
      }).catch(err =>{
        this.lodingState = false
        this.canClick = true
      })
    },
    isEmail(value){
      if (!value) {
        return '请输入邮箱'
      }
      let pattern = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
      if(!pattern.test(value)){
        return '输入的邮箱格式错误'
      }
      return ''
    },
    redirectionIndex(){
      this.$router.push({path:'/index'})
    },
    redirectionLogin(){
      this.$router.replace({path:'/login'})
    },
    redirectionRegister(){
      this.$router.replace({path:'/register'})
    },
    //密码显示
    changePass(value) {
      this.visible = !(value === 'show');
    }
  }
}
</script>

<style lang="scss">
.page-login {
  @extend %unable-select;
  $backgroundColor: #F0F2F5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
      span {
        color: $color-text-sub;
      }
    }
  }
  // main
  .page-login--logo {
    width: 240px;
    margin-bottom: 2em;
    margin-top: -2em;
  }
  // 登录表单
  .page-resetpwd--form {
    width: 340px;
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 14px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
