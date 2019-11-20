<template>
  <div>
    <remind-info ref="remind_info"/>
    <div>
    <remind-form ref="remind_form"></remind-form></div>
  <el-dropdown split-button type="primary" @click="handleRowView"
               @command="handleCommand">
    查看
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="edit">编辑</el-dropdown-item>
      <el-dropdown-item command="delete">删除</el-dropdown-item>
      <el-dropdown-item command="pause">暂停</el-dropdown-item>
      <el-dropdown-item command="resume">重新启动</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  </div>
</template>

<script>
  import remindForm from './remindForm'
  import { delRemindInfo, pauseRemind, resumeRemind} from '@/api/remind/remind'
  import remindInfo from './remindInfo'

  export default {
    props: {
      scope: {
        default: null
      }
    },
    methods: {
      handleRowView(){
        this.$refs.remind_info.open(this.scope.row, this.scope.$index)
      },
      handleCommand(command) {
        if(command === 'edit'){
          this.handleRowEdit()
        }else if(command === 'delete'){
         this.handleRowRemove()
        }else if(command === 'pause'){
         this.handlePause()
        }else if(command === 'resume'){
         this.hanleResume()
        }
      },
      handleRowEdit(){
        this.$refs.remind_form.open(this.scope.row)
      },
      handleRowRemove () {
        this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRemindInfo({
            name: this.scope.row.name
          }).then(res =>{
            this.$message.success("删除成功")
            this.$bus.$emit('updateData')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handlePause(){
        pauseRemind({
          name: this.scope.row.name
        }).then(res =>{
          this.$message.success("暂停成功")
          this.$bus.$emit('updateData')
        })
      },
      hanleResume(){
        resumeRemind({
          name: this.scope.row.name
        }).then(res =>{
          this.$message.success("重新启动成功")
          this.$bus.$emit('updateData')
        })
      }
    },
    components:{
      remindForm, remindInfo
    }
  }
</script>

<style>
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
