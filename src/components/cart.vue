<template>
  <div>
    <van-nav-bar
            title="订单"/>

    <van-list

            :finished="finished">
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
                    <van-button size="small" type="danger" @click="buy(item.id)" v-if="item.paymentstatus !='paid'">购买</van-button>
                    <van-button size="small" type="default" v-if="item.paymentstatus=='paid'" disabled>已购买</van-button>                    
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
      patents_industryType: [],
      patents_productstatus: [],
      patents_type: []
    };
  },
  methods: {
    getData() {
      let _self = this
        _self.loading = true

      this.$http.get('/patent/IWoaPatentsController.do?apicheckPatentsOrder&userid=' + localStorage.getItem('userId'))
      .then(function(res) {
        if (res.data.length < 1) {
          _self.loading = false
          _self.finished = true
          _self.noOrder = true
        } else {
          for (let i = 0; i < res.data.length; i++) {
            _self.finished = true
            _self.$http.get('/patent/IWoaPatentsController.do?apiQueryPictureByPatentsid&patentsid=' + res.data[i].id)
                    .then(function(response) {

                      let _img = ''
                      _img = '/patent/' + response.data[0].realpath
                      res.data[i].thumb = _img
                        
                      for (let j = 0; j < _self.patents_type.length; j++) {
                            if (res.data[i].patenttype == _self.patents_type[j].typecode) {
                                res.data[i].patenttype = _self.patents_type[j].typename
                            } else {
                                continue;
                            }
                        }
                        for (let k = 0; k < _self.patents_industryType.length; k++) {
                            if (res.data[i].industry == _self.patents_industryType[k].typecode) {
                                res.data[i].industry = _self.patents_industryType[k].typename
                            } else {
                                continue;
                            }
                        }
                      _self.notpay.push(res.data[i])                
                      console.log('11111')
                      _self.loading = false
                      
                      
                        // _self.loading = flase
                      
                    //   _self.loading = true
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

            this.$http.get('/patent/IWoaPatentsController.do?apiSavePatentsOrder&patentsid=' + a + '&userid=' + localStorage.getItem('userId'))
            .then(function(res) {
                if (res.data.msgCode == '40000') {
                    _self.$http.get('/patent/IWoaPatentsController.do?apiPatentsWechatPay&orderid=' + res.data.data)
                    .then(function(response) {
                        window.location.href = response.data
                    })
                } else {
                    _self.$toast.fail(res.data.msg)
                }
            })
        },
        getCenterData() {
            let _self = this

            this.$http.get('/patent/IWoaPatentsController.do?apiqueryTsTypeByGroupCodes&groupCodesStr=patents_type,patents_industryType,patents_productstatus')
            .then(function(res) {
                _self.patents_industryType = res.data.patents_industryType
                _self.patents_productstatus = res.data.patents_productstatus
                _self.patents_type = res.data.patents_type
                _self.getData()
            })
        }

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
    this.getCenterData()
  }
};
</script>