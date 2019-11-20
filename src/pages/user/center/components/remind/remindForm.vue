<template>
    <el-dialog title="修改提醒相关信息" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="sizeForm" label-width="80px" >
        <el-form-item label="提醒时间"
                      style="text-align: center;">
          <el-col :span="11">
            <el-date-picker placeholder="选择日期" v-model="sizeForm.date1"
                            style="width: 100%;" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="sizeForm.date2" style="width: 100%;"
                            value-format="HH:mm:ss"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="推送方式" style="text-align: left;">
          <el-radio-group v-model="sizeForm.resource" size="medium">
            <el-radio border label="1">邮箱</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系方式" prop="email">
          <el-autocomplete
                  v-model="sizeForm.contact"
                  placeholder="请输入内容"
                  :fetch-suggestions="querySearch"
                  maxlength="30"
                  show-word-limit
                  clearable></el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateRemindInfo">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
  import {isEmail} from '@/common/emailUtil.js'
  import { updateRemindInfo } from '@/api/remind/remind'
  import axios from 'axios'

  export default {
    data() {
      return {
        dialogFormVisible: false,
        sizeForm: {
          contact: '',
          date1: '',
          date2: '',
          resource: '1'
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        name: '',
        email: [{
          value: ''
        }]
      };
    },
    methods: {
      open(tableDate){
        let sendDate = tableDate.sendDate.trim().split(" ");
        this.sizeForm.date1 = sendDate[0]
        this.sizeForm.date2 = sendDate[1]
        this.sizeForm.contact = tableDate.to
        this.name = tableDate.name
        this.dialogFormVisible = true
      },
      cancel(){
        this.dialogFormVisible = false
        this.$message('取消输入')
      },
      updateRemindInfo(){
        if(this.sizeForm.date1 === '' || this.sizeForm.date2 === ''){
          this.$message.error("请选择日期")
          return
        }
        if(this.sizeForm.resource === ''){
          this.$message.error("请选择推送方式")
          return
        }
        if(this.sizeForm.contact === ''){
          this.$message.error("请输入联系方式")
          return
        }
        let s = isEmail(this.sizeForm.contact)
        if(s !== ''){
          this.$message.error(s)
          return
        }
        setIntoStorage(this.sizeForm.contact)
        axios.get('https://greenhathg.co/api/v1/contests/name', {
          params: {
            name: this.name
          }
        }).then(res =>{
          if(res.data.code === 400){
            this.$message.error("该比赛已过期,请删除")
            return
          }
          updateRemindInfo({
            remindDate: this.sizeForm.date1 + ' ' + this.sizeForm.date2,
            type: this.sizeForm.resource,
            contact: this.sizeForm.contact,
            contest: res.data.data
          }).then(res =>{
            this.$bus.$emit('updateData')
            this.dialogFormVisible = false
            this.$message.success("设置成功")
          }).catch(err =>{
            this.dialogFormVisible = false
          })
        }).catch(err=>{
          this.$message.error("设置失败,请重试")
          return
        })
      },
      querySearch(queryString ,cb){
        cb(JSON.parse(localStorage.getItem('email')))
      }
    }
  }
</script>

<style scoped>
  .el-col-11{
    padding-left: 0 !important ;
    padding-right: 0 !important
  }
</style>