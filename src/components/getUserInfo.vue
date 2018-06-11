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

        this.$http.get('/patent/IWoaPatentsController.do?apiCheckWechatUser')
        .then(function(res) {
            // alert(res.data)
            window.location.href = res.data
            // window.open(res.data)
        })
    },
  },
  mounted() {
      this.getUserInfo()
  }
}
</script>