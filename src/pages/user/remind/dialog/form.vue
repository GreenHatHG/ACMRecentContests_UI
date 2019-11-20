<template>
    <el-dialog title="填写提醒相关信息" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="sizeForm" label-width="80px">
          <el-form-item label="提醒时间" style="text-align: center;">
            <el-col :span="11">
              <el-date-picker placeholder="选择日期" v-model="sizeForm.date1"
                              style="width: 100%;" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" >-</el-col>
            <el-col :span="11">
              <el-time-picker placeholder="选择时间" v-model="sizeForm.date2" style="width: 100%;"
                    value-format="HH:mm:ss"></el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="推送方式">
            <el-radio-group v-model="sizeForm.resource" size="medium">
              <el-radio border label="1">邮箱</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系方式" prop="email">
              <el-autocomplete
                      v-model="sizeForm.contact"
                      placeholder="请输入内容"
                      :fetch-suggestions="querySearch"
                      show-word-limit
                      clearable></el-autocomplete>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addRemindInfo">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
  import {isEmail} from '@/common/emailUtil.js'
  import { setRemind } from '@/api/remind/remind'
  import {setIntoStorage} from '@/common/inputHistoryUtil.js'
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
        item: {},
        email: [{
          value: ''
        }]
      };
    },
    methods: {
      open(item){
        this.item = item
        this.dialogFormVisible = true
      },
      cancel(){
        this.dialogFormVisible = false
        this.$message('取消输入')
      },
      addRemindInfo(){
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
        setRemind({
          remindDate: this.sizeForm.date1 + ' ' + this.sizeForm.date2,
          type: this.sizeForm.resource,
          contact: this.sizeForm.contact,
          contest: this.item
        }).then(res =>{
          this.dialogFormVisible = false
          this.$message.success("设置成功")
        }).catch(err =>{
          this.dialogFormVisible = false
        })

      },
      querySearch(queryString ,cb){
        cb(JSON.parse(localStorage.getItem('email')))
      }
    }
  }
</script>

<style>
  .el-input__count-inner {
    background: rgba(255, 255, 255, 0);
  }
</style>