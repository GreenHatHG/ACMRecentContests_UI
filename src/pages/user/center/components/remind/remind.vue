<template>
  <div>
    <el-button type="danger" @click="deleteInfo">删除</el-button>
    <d2-crud
            ref="d2Crud"
            :columns="columns"
            selection-row
            @dialog-cancel="handleDialogCancel"
            @selection-change="handleSelectionChange"
            :data="tableData"
            :loading="loading"/>
  </div>
</template>

<script>
  import remindOperating from './remindOperating'
  import { getRemindInfos} from '@/api/remind/remind'
  import { delRemindInfos} from '@/api/remind/remind'
  export default {
    data () {
      return {
        tableData:[],
        loading: true,
        columns: [
          {
            title: '日期',
            key: 'sendDate',
            showOverflowTooltip: true,
            sortable: true
          },
          {
            title: '名字',
            key: 'name',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            title: '方式',
            key: 'type',
            minWidth: 50
          },
          {
            title: '状态',
            key: 'state',
            minWidth: 50
          },
          {
            width: 120,
            title: '操作',
            key: 'operating',
            component: {
              name: remindOperating
            }
          }
        ],
        deleteList: []
      }
    },
    methods:{
      handleDialogCancel (done) {
        this.$message.info('取消编辑',)
        done()
      },
      getData(){
        getRemindInfos().then(res=>{
          this.tableData = res
          this.$store.dispatch('d2admin/db/set', {
            dbName: 'remindData',
            path: 'remindData.tableData',
            value: this.tableData,
            user: true
          })
          this.loading = false
        })
      },
      handleSelectionChange (selection) {
        this.deleteList = selection
      },
      deleteInfo(){
        this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param =  []
          let index
          let deleteList = this.deleteList
          for(index in deleteList){
            param.push(deleteList[index].name)
          }
          delRemindInfos({
            names: JSON.stringify(param)
          }).then(res =>{
            this.$bus.$emit('updateData')
            this.$message.success("删除成功")
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    mounted() {
      this.getData()
      this.$bus.$on('updateData',()=>{
        this.getData()
      });
    },
    components:{
      remindOperating
    }

  }
</script>