<template>
  <div id="app">
    <el-dialog title="请选择你的家乡" :visible.sync="dialogFormVisible">
      <el-cascader
              size="mini"
              placeholder="单选可搜索"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
              filterable>
      </el-cascader>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateHome">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { regionData, CodeToText } from 'element-china-area-data'
  import { mapState} from 'vuex'
  import { upHome } from '@/api/update/updateHome'

  export default {
    data () {
      return {
        dialogFormVisible: false,
        city: '',
        options: regionData,
        selectedOptions: []
      }
    },

    methods: {
      handleChange (value) {
        let s = ''
        let len = value.length
        value.forEach(function (item) {
          s += CodeToText[item]
          len--
          if (len >= 1)
            s += '-'
        })
        this.city = s
      },
      updateHome(){
        upHome({
          city: this.city
        }).then(res =>{
          this.$store.dispatch('d2admin/user/set', {
            name: this.info.name,
            mail: this.info.mail,
            createTime: this.info.createTime,
            city: this.city,
            avatar: this.info.avatar
          }, { root: true })
          this.dialogFormVisible = false
          this.$message.success("修改成功")
        }).catch(err =>{
          this.$message.error("更新失败，请尝试重新登录")
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