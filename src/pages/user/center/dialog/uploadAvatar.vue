<template>
  <div>
    <my-upload field="smfile"
               @crop-upload-success="cropUploadSuccess"
               @crop-upload-fail="cropUploadFail"
               v-model="show"
               url="https://sm.ms/api/v2/upload"
               :max-size="1024"
               img-format="png">
    </my-upload>
    <img :src="imgDataUrl">
  </div>
</template>

<script>

  import "@babel/polyfill"
  import { mapState} from 'vuex'
  import ImageCropper from '@/pages/user/center/components/ImageCropper'
  import {updateAvatar} from '@/api/update/updateAvatar'

  export default {
    data() {
      return {
        show: false,
        url: 'https://sm.ms/api/v2/upload',
        imgDataUrl: '' // the datebase64 url of created image
      }
    },
    components: {
      'my-upload': ImageCropper
    },
    methods: {
      cropUploadSuccess(jsonData, field){
        this.show = false
        let avatar = ''
        if(jsonData.data.code === 'exception'){
          let message = jsonData.data.message
          if(message.indexOf('exists') !== -1){
            let at = message.indexOf(':')
            avatar = message.substr(at+1, message.length-at-1)
          }
        }else{
          avatar = jsonData.data.data.url
        }
        this.$notify({
          title: '成功',
          message: '更改成功',
          type: 'success'
        });
        this.$store.dispatch('d2admin/user/set', {
          name: this.info.name,
          mail: this.info.mail,
          createTime: this.info.createTime,
          city: this.info.city,
          avatar: avatar
        }, { root: true })
        updateAvatar({
          avatarUrl: avatar
        }).then(res => {
        }).catch(err =>{
          this.$notify.error({
            title: '错误',
            message: '请稍后再试'
          });
        })

      },
      cropUploadFail(status, field){
        this.show = false
        this.$notify.error({
          title: '错误',
          message: '请稍后再试'
        });
      },
      open(){
        this.show = true
      }
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    }
  }
</script>

<style scoped>
  span.vicp-hint {
    white-space: pre-wrap;
  }
</style>