<template>
  <div>
    <van-nav-bar
            title="订单"/>

    <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad">
            <van-card
                :price="item.price"
                :title="item.patentname"
                style="background-color: #fff;"
                v-for="(item,index) in notpay"
                :key=index
                :thumb="item.thumb">
                <div slot="desc" style="margin-top: 10px" @click="toDetail(item.id)">
                    <span style="font-size: 10px; float: left">申请号：{{ item.patentcode }}</span><br>
                    <span style="font-size: 10px; float: left">行业分类：{{ item.industry }}</span><br>
                    <span style="font-size: 10px; float: left">专利类型：{{ item.patenttype }}</span>
                </div>
                <div slot="footer">
                    <van-button size="small" type="danger" @click="buy(item.id)" v-if="item.paymentstatus!=notpaid">购买</van-button>
                </div>
            </van-card>
        </van-list>

        <div style="margin-top: 50%;margin-left: 35%" v-if="noOrder">
          <p>您还没有订单哦！</p>
          <p><a style="color: blue" onclick="window.location.href = '/#/HelloWorld?id=' + localStorage.getItem('userId')">点击</a>去订购吧</p>
        </div>

        <van-tabbar v-model="active" @change="tochange">
            <van-tabbar-item icon="wap-home">首页</van-tabbar-item>
            <van-tabbar-item icon="cart">订单</van-tabbar-item>
            <van-tabbar-item icon="contact">我的</van-tabbar-item>
        </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      loading: false,
      finished: false,
      noOrder: false,
      notpay: [],
    };
  },
  methods: {
    getData() {
      let _self = this

      this.$http.get('/api/IWoaPatentsController.do?apicheckPatentsOrder&userid=' + localStorage.getItem('userId'))
      .then(function(res) {
        if (res.data.length < 1) {
          _self.loading = false
          _self.finished = true
          _self.noOrder = true
        } else {
          for (let i = 0; i < res.data.length; i++) {
            _self.$http.get('/api/IWoaPatentsController.do?apiQueryPictureByPatentsid&patentsid=' + res.data[i].id)
                    .then(function(response) {
                      let _img = ''
                      _img = '/api/' + response.data[0].realpath
                      res.data[i].thumb = _img
                        _self.notpay.push(res.data[i])
                  })
          }
        }
      })
    },

    onClickLeft() {
      this.$router.go(-1)
    },

    tochange(a) {
            let _self = this
            
            if (a == 0) {
                window.location.href = '/#/HelloWorld?id=' + localStorage.getItem('userId')
            } else if (a == 2) {
                _self.$router.push({
                    name: 'orderList'
                })
            }
        },

        buy(a) {
            let _self = this

            this.$http.get('/api/IWoaPatentsController.do?apiSavePatentsOrder&patentsid=' + a + '&userid=' + localStorage.getItem('userId'))
            .then(function(res) {
                if (res.data.msgCode == '40000') {
                    _self.$http.get('/api/IWoaPatentsController.do?apiPatentsWechatPay&orderid=' + res.data.data)
                    .then(function(response) {
                        window.location.href = response.data
                    })
                } else {
                    _self.$toast.fail(res.data.msg)
                }
            })
        },

        // toDetail(a) {
        //     let _self = this
        //     this.$router.push({
        //         name: 'productDetail',
        //         params: {
        //             patdetid: a,
        //             typecode: _self.typecode
        //         }
        //     })
        // }
  },
  mounted() {
    this.getData()
  }
};
</script>