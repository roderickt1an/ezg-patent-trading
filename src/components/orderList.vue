<template>
  <div>
    <van-nav-bar
            title="个人中心"/>

    <div style="height: 200px;background-color:#fff">
      <center>
        <img :src="userInfo.pictureurl" style="width:100px;height:100px;border-radius:100px;margin-top: 50px">
        <p>{{ userInfo.nickname }}</p>
      </center>
    </div>

    <van-cell-group style="margin-top: 5%">
      <van-cell icon="gold-coin" :title="userInfo.usertel" :is-link="userInfo.usertel=='手机号码：未认证'" @click="gotoTel"/>
    </van-cell-group>

    <van-tabbar v-model="active" @change="tochange">
            <van-tabbar-item icon="wap-home">首页</van-tabbar-item>
            <van-tabbar-item icon="cart">订单</van-tabbar-item>
            <van-tabbar-item icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Row, Col, Icon, Cell, CellGroup } from 'vant';
export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  data() {
    return{
      userInfo: {},
      active: 2,
    }
  },
  methods: {
    getData() {
      let _self = this

      this.$http.get('/patent/IWoaPatentsController.do?apicheckPatentUserMsg&userid=' + localStorage.getItem('userId'))
      .then(function(res) {
        _self.userInfo = res.data[0]
        if (_self.userInfo.usertel == null) { _self.userInfo.usertel = '未认证' }  
        _self.userInfo.usertel = '手机号码：' + _self.userInfo.usertel
      })
    },

    onClickLeft() {
      this.$router.go(-1)
    },

    gotoTel() {
      this.$router.push({
          name: 'tel'
      })
    },

    tochange(a) {
            console.log(a)
            if (a == 1) {
                this.$router.push({
                    name: 'cart'
                })
            } else if (a == 0) {
                window.location.href = '/#/HelloWorld?id=' + localStorage.getItem('userId')
            }
        }
  },
  mounted() {
    this.getData()
  }
};
</script>

<style lang="less">
.user {
  &-poster {
    width: 7.5rem;
    height: 4rem;
    display: block;
  }
  &-group {
    margin-bottom: .3rem;
  }
  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
    }
  }
}
</style>