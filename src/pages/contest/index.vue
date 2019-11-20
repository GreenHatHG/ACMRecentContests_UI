<template>
  <d2-container>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="tableData"
      :options="options"
      :loading="loading"/>
  </d2-container>
</template>

<script>
  import axios from 'axios'
  import button from './button'

  export default{
    components:{
      button
    },
    data(){
      return{
        tableData:[],
        loading: true,
        columns: [
          {
            key: 'oj', title: '平台', minWidth: 60, align: 'center', resizable: true,
            filters: [
              { text: 'Atcoder', value: 'Atcoder' },
              { text: 'Bestcoder', value: 'Bestcoder' },
              { text: 'CodeChef', value: 'CodeChef' },
              { text: 'CodeForces', value: 'CoderForces' },
              { text: 'Hdu', value: 'Hdu' },
              { text: 'Luogu', value: 'Luogu' },
              { text: '牛客', value: '牛客' },
              { text: '计蒜客', value: '计蒜客' }
            ],
            filterMethod (value, row) {
               return row.oj === value
            },
            filterPlacement: 'bottom-end'
          },
          {key: 'name', title: '比赛', tooltip: true, align: 'center', resizable: true, sortable: true},
          {key: 'startTime', title: '开始时间', align: 'center', resizable: true, sortable: true},
          {key: 'endTime', title: '结束时间', align: 'center', resizable: true, sortable: true},
          {key: 'length', title: '时长', align: 'center', resizable: true, sortable: true},
          {key: 'week', title: '星期', align: 'center', resizable: true, sortable: true},
          {
            key: 'link', title: '报名', align: 'center',
            component:{
              name: button
            }
          }
        ],
        options: {
          stripe: true,
          highlightCurrentRow: true,
          headerCellStyle: {
            'background':'rgb(128, 102, 160)',
            'color': '#fff',
          },
          rowStyle:{
            'border-color': 'rgb(128, 102, 160)'
          }
        }
      }
    },
    methods: {
      getData(){
        let api = 'https://greenhathg.co/api/v1/contests'
        axios.get(api).then((response)=>{
          this.loading = false
          this.tableData=response.data.data;
        }).catch((error)=>{
        }).finally(()=>{
        });
      }
    },
    mounted(){
      this.getData();
      this.$nextTick(() => {
        let self = this;
        this.options.height = window.innerHeight - this.$refs.d2Crud.$refs.elTable.$el.offsetHeight - 55;

        window.onresize = function() {
            self.options.height = window.innerHeight - this.$refs.d2Crud.$refs.elTable.$el.offsetHeight - 55;
        }
    })
    }
  }

</script>

<style scoped>

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table td,
  .el-table th.is-leaf {
          border-bottom: 1px solid rgb(128, 102, 160);
  }

  .el-table::before{
    border-bottom:  1px solid rgb(128, 102, 160);
    }

  .el-table::after{
    border-bottom:  1px solid rgb(128, 102, 160);
  }

  .el-table--border, .el-table--group{
    border-bottom:  1px solid rgb(128, 102, 160);
  }

  .el-table__header-wrapper th:nth-last-of-type(2){
    border-bottom:  1px solid rgb(128, 102, 160);
  }

</style>