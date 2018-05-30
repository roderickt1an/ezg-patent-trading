<template>
    <div></div>
</template>

<script>
export default {
  data() {
    return{
    }
  },
  methods: {
    getUserInfo() {
        let _self = this

        this.$http.get('/api/IWoaPatentsController.do?apiCheckWechatUser')
        .then(function(res) {
            window.location.href = res.data
        })
    },
  },
  mounted() {
      this.getUserInfo()
  }
}
</script>