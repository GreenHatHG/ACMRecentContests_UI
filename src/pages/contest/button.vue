<template>
  <div>
    <!-- 报名button -->
    <el-button :type="scope.row.link === null?'info':'warning'"
      :disabled="scope.row.link === null" plain
        @click.native="handleClick">报名</el-button>
  </div>
</template>

<script>
  export default {
    props: {
      scope: {
        default: null
      }
  },
  methods:{
    // 跳转到对应的link页面
    handleClick(){
      let link = this.scope.row.link;
      if(link != null){
        window.open(this.scope.row.link);
      }
    }
  }
}
</script>

<style scoped>

.el-button--warning.is-plain {
    color: #E6A23C;
    background: #fdf6ec;
    border-color: #f5dab1;
}

</style>
