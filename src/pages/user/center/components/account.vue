<template>
    <el-col>
      <h5>设置中心</h5>
      <update-home ref="home"></update-home>
      <update-avatar ref="avatar"/>
      <el-menu
              default-active="1"
              class="el-menu-vertical-demo">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span>个人信息</span>
          </template>
          <el-menu-item-group>
            <el-menu-item class='el-icon-edit' index="1-1" @click="updateName">修改姓名</el-menu-item>
            <br/>
            <el-menu-item class='el-icon-location-outline' index="1-2" @click="updateHome">修改家乡</el-menu-item>
            <br/>
            <el-menu-item class='el-icon-magic-stick' index="1-3" @click="updateAvatar">修改头像</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-claim"></i>
            <span>安全相关</span>
          </template>
          <el-menu-item-group>
            <update-email ref="email"></update-email>
            <el-menu-item class='el-icon-postcard' index="1-1" @click="updateEmail">修改邮箱</el-menu-item>
            <br/>
            <update-password ref="password"/>
            <el-menu-item class='el-icon-key' index="1-2" @click="updatePassword">修改密码</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
</template>

<script>
  import { mapState} from 'vuex'
  import { updateUserName } from '@/api/update/updateUserName'
  import updateEmail from '../dialog/email'
  import updateHome from '../dialog/cascader'
  import updatePassword from '../dialog/password'
  import updateAvatar from '../dialog/uploadAvatar'

  export default {
    components: {updateEmail, updateHome, updatePassword, updateAvatar},
    data(){
      return{

      }
    },
    methods:{
      updateName(){
        this.$prompt('请输入修改后姓名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(value.length >= 30){
            this.$message.error("用户名不能超过30个字符")
            return
          }
          updateUserName({
              username: value
          }).then(res =>{
            this.$message.success('你的姓名更新为: ' + value)
            this.$store.dispatch('d2admin/user/set', {
              name: value,
              mail: this.info.mail,
              createTime: this.info.createTime,
              city: this.info.city,
              avatar: this.info.avatar
            }, { root: true })
          }).catch(err =>{
            this.$message.error("更新失败，请尝试重新登录")
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      updateEmail(){
        this.$refs.email.open()
      },
      updateHome(){
        this.$refs.home.open()
      },
      updatePassword(){
        this.$refs.password.open()
      },
      updateAvatar(){
        this.$refs.avatar.open()
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
</style>