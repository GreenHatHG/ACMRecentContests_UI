<template>
  <div id="app">
    <el-dialog title="提醒信息" :visible.sync="dialogFormVisible" style="text-align: left">
      <el-card class="box-card">
        <i class="el-icon-guide"/> {{contest.oj}}
      </el-card>
      <el-card v-if="contest.link">
        <i class="el-icon-s-opportunity"/>
        <el-link :href="contest.link" target="_blank">{{tableData.name}}</el-link>
      </el-card>
      <el-card v-else>
        <i class="el-icon-s-opportunity"/>
        {{tableData.name}}
      </el-card>
      <el-card class="box-card">
        <i class="el-icon-time"/> {{contest.startTime}} -- {{contest.endTime}}
      </el-card>
      <el-card class="box-card">
        <i class="el-icon-timer"/> {{contest.length}}
      </el-card>
      <el-card class="box-card">
        <i class="el-icon-message"/> {{tableData.to}}
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data(){
      return{
        dialogFormVisible: false,
        tableData: [],
        remindInfos: [],
        contest: {}
      }
    },
    methods:{
      open(row, index){
        this.tableData = this.remindInfos[index]
        axios.get('https://greenhathg.co/api/v1/contests/name', {
          params: {
            name: row.name
          }
        }).then(res =>{
          if(res.data.code === 400){
            this.$message.error("该比赛已过期,请删除")
            return
          }
          this.contest = res.data.data
          this.dialogFormVisible = true
          })
        },
      confirm(){
        this.dialogFormVisible = false
      },

    },
    mounted() {
      const value = this.$store.dispatch('d2admin/db/get', {
        dbName: 'remindData',
        path: 'remindData.tableData',
        defaultValue: null,
        user: true
      })
      value.then(val =>{
        this.remindInfos = val
      })
    }

  }
</script>

<style scoped>

</style>