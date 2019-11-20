<template>
  <d2-container>
    <Form ref="dataForm"/>
    <div class="block">
       <el-timeline>
        <el-timeline-item v-for="(val, key) in contests"
                          :timestamp="key" placement="top">
          <el-card v-for="item in val">
            <el-link type="primary" class="el-icon-alarm-clock" @click="openForm(item)" :underline="false"></el-link>
            <h4><i class="el-icon-s-opportunity"></i>{{item.name}}</h4>
            <p>
              <i class="el-icon-time"></i>{{item.startTime}} {{item.week}}&#8195;&#8195;
              <i class="el-icon-timer"></i>  {{item.length}}&#8195;&#8195;
              <i class="el-icon-guide"></i> {{item.oj}}
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </d2-container>
</template>

<script>
import axios from 'axios'
import Form from './dialog/form'

  export default {
    data(){
      return{
        contests: []
      }
    },
    methods:{
      openForm(item){
        // let snapshot = JSON.parse(JSON.stringify(item))
        // snapshot.name = encodeURIComponent(snapshot.name)
        this.$refs.dataForm.open(item)
      }
    },
    mounted() {
      axios.get('https://greenhathg.co/api/v1/contests/day').then(res=>{
        this.contests = res.data.data
      })
    },
    components:{
      Form
    }
  }
</script>
<style scoped>
  .el-icon-alarm-clock{
    float: right;
    font-size: 200%;
    color: dodgerblue;
  }


</style>