<template>
  <div>
<!--    <a @click="dialogFormVisible = true" target="_blank" style="color: #317EF3; text-decoration: underline;-->
<!--                  cursor: pointer; float: right">修改邮箱</a>-->
    <el-dialog title="提示" :visible.sync="dialogFormVisible" ref="email">
      <el-form :model="form" :rules="rules">

        <el-form-item label="请输入原邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off" clearable maxlength="30" show-word-limit>
            <el-button :class="{disabled: !this.canClick}" style="color: #409EFF" slot="append" @click="countDown" :loading="lodingState">{{content}}</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="请输入验证码" prop="code" >
          <el-input v-model="form.code" autocomplete="off" clearable maxlength="6" show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="请输入新邮箱" prop="code">
          <el-input v-model="form.newEmail" autocomplete="off" clearable maxlength="30" show-word-limit></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateEmail">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {isEmail} from '@/common/emailUtil.js'
  import { mapState} from 'vuex'
  import { getUpdateEmailCodeAPI, updateEmailAPI } from '@/api/update/updateEmail'

  export default {
    data() {
      return {
        dialogFormVisible: false,
        form: {
          email: '',
          code: '',
          newEmail: ''
        },
        rules: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
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
        if (!this.canClick) return
        this.canClick = false //改动的是这两行代码
        getUpdateEmailCodeAPI({
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
      updateEmail(){
        updateEmailAPI({
          originalEmail: this.form.email,
          code: this.form.code,
          newEmail: this.form.newEmail
        }).then(res =>{
          this.dialogFormVisible = false
          this.$store.dispatch('d2admin/user/set', {
            name: this.info.name,
            mail: this.form.newEmail,
            createTime: this.info.createTime,
            city: this.info.city,
            avatar: this.info.avatar
          }, { root: true })
          this.form.email=''
          this.form.code=''
          this.$message.success("更改成功")
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