<template>
    <d2-container >
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <userCard/>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="账户设置" name="account">
                <account />
              </el-tab-pane>
              <el-tab-pane label="提醒管理" name="ac">
                <remind/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </d2-container>
</template>

<script>
  import userCard from './components/user_card'
  import account from './components/account'
  import remind from './components/remind/remind'
  export default{
    data(){
      return{
        activeTab: 'account'
      }
    },
    components:{
      userCard, account, remind
    }
  }
</script>

<style lang="scss" scoped>

</style>