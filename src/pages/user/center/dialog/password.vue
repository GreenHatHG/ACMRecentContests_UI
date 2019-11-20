<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">

        <el-form-item label="验证邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off" clearable maxlength="30" show-word-limit>
            <el-button :class="{disabled: !this.canClick}" style="color: #409EFF" slot="append" @click="countDown" :loading="lodingState">{{content}}</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="请输入验证码" prop="code" >
          <el-input v-model="form.code" autocomplete="off" clearable maxlength="6" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="请输入要重置的密码" prop="password" >
          <el-input type="password" v-model="form.password" autocomplete="off" clearable show-password maxlength="30" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="请确认密码" prop="password_confirm" >
          <el-input type="password" v-model="form.password_confirm" autocomplete="off" clearable show-password maxlength="30" show-word-limit></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {isEmail} from '@/common/emailUtil.js'
  import { mapState} from 'vuex'
  import { resetpwd } from '@/api/resetpwd'
  import {getUpdatePasswordCodeAPI, updatePasswordAPI} from '@/api/update/updatePassword'

  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        dialogFormVisible: false,
        form: {
          email: '',
          code: '',
          password: '',
          password_confirm: ''
        },
        rules: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          password_confirm: [
            {
               trigger: 'blur',
              validator: validatePass
            }
          ]
        },
        content: '发送验证码',
        totalTime: 60,
        canClick: true,
        lodingState: false
      }
    },
    methods: {
      countDown() {
        this.lodingState = true
        if (!this.canClick) return   //改动的是这两行代码
        this.canClick = false
        getUpdatePasswordCodeAPI({
          originalEmail: this.form.email
        }).then(res =>{
          this.lodingState = false
          this.$message.success("发送到邮箱成功，如果没有收到，请检查垃圾箱")
          this.content = this.totalTime + 's后重新发送'
          let clock = window.setInterval(() => {
            this.totalTime--
            this.content = this.totalTime + 's后重新发送'
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
      updatePassword(){
        updatePasswordAPI({
          password: this.form.password_confirm,
          email: this.form.email,
          code: this.form.code
        }).then(res =>{
          this.$message.success("更改成功")
          this.dialogFormVisible = false
        })
      },
      open(){
        this.dialogFormVisible = true
      },
      cancel(){
        this.dialogFormVisible = false
        this.$message('取消输入')
      }
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    }
  }
</script>

<style scoped>

  .disabled{
    background-color: #ddd;
    border-color: #ddd;
    color:#57a3f3;
    cursor: not-allowed;
  }

</style>
