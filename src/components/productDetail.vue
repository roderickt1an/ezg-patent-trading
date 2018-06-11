<template>
    <div>
        <van-nav-bar
            title="详情"
            left-arrow
            @click-left="onClickLeft"/>

        <van-tabs v-model="active" swipeable>
            <van-tab title="专利">
                <van-swipe class="goods-swipe" :autoplay="3000">
                    <van-swipe-item v-for="thumb in goods.thumb" :key="thumb">
                        <img :src="thumb" >
                    </van-swipe-item>
                </van-swipe>

                <van-cell-group>
                    <van-cell>
                        <div class="goods-title">{{ goods.title }}</div>
                        <div class="goods-price">¥{{ goods.price }}</div>
                    </van-cell>
                    <van-cell class="goods-express">
                        <van-col span="12">申请号：{{ goods.patentcode }}</van-col>
                        <van-col span="12">专利类型：{{ goods.patenttype }}</van-col>
                        <van-col span="12">行业分类：{{ goods.industry }}</van-col>
                        <van-col span="12">法律状态：{{ goods.legalstatus }}</van-col>
                    </van-cell>
                </van-cell-group>

                <van-cell-group style="margin-bottom: 50px">
                    <van-cell>
                        <div class="goods-title">交易流程</div>
                        <img src="../assets/u46.png" style="width: 100%">
                    </van-cell>
                    <van-cell>
                        <div class="goods-title">过户资料</div>
                        <img src="../assets/1.png" style="width: 100%">
                    </van-cell>
                </van-cell-group>
            </van-tab>
            <van-tab title="摘要及附图" style="margin-bottom: 50px">
                <br><div>{{ goods.abstracter }}</div><br>
                <img v-for="(img,index) in imageList" v-lazy="img" :key=index>
            </van-tab>
            <van-tab title="权利要求" style="margin-bottom: 50px">
                <br><div>{{ goods.requirees }}</div><br>
            </van-tab>
        </van-tabs>
        <van-goods-action>
            <van-goods-action-mini-btn icon="chat" @click="chat">
                咨询
            </van-goods-action-mini-btn>
            <van-goods-action-big-btn primary @click="buy(patdetid)">
                立即购买
            </van-goods-action-big-btn>
        </van-goods-action>
    </div>
</template>

<script>
export default {
    data() {
        return{
            patentsid: '',
            typecode: '',
            active: '',
            goods: {
                title: '',
                patdetid: '',
                price: '',
                thumb: [],
                patentcode: '',
                patenttype: '',
                industry: '',
                legalstatus: '',
                abstracter: '',
                requirees: ''
            },
            imageList: [],
            patents_industryType: [],
            patents_productstatus: [],
            patents_type: [],
            patents_legalstatus:[]
        }
    },
    methods: {
        getData() {
            let _self = this
            // if(localStorage.getItem('patdetid')!=null){
            //     _self.patdetid = localStorage.getItem('patdetid')
            //     _self.typecode = localStorage.getItem('typecode')
            // }else{
            //     _self.patdetid = this.$route.params.patdetid
            //     _self.typecode = this.$route.params.typecode
            // }
            _self.patdetid = this.$route.params.patdetid
            _self.typecode = this.$route.params.typecode
            localStorage.setItem('patdetid', _self.$route.params.patdetid)            
            _self.$http.get('/patent/IWoaPatentsController.do?apiQueryPictureByPatentsid&patentsid=' + localStorage.getItem('patdetid'))
                .then(function(res) {
                    
                    let _patenttype = ''
                    let _industryType = ''
                    let _legalstatus = ''

                    for (let k = 0; k < _self.patents_industryType.length; k++) {
                        if (res.data[0].industry == _self.patents_industryType[k].typecode) {
                            _industryType = _self.patents_industryType[k].typename
                        } else {
                            continue;
                        }
                    }
                    for (let j = 0; j < _self.patents_type.length; j++) {
                        if (res.data[0].patenttype == _self.patents_type[j].typecode) {
                            _patenttype = _self.patents_type[j].typename
                        } else {
                            continue;
                        }
                    }
                    // for (let t = 0; t < _self.patents_productstatus.length; t++) {
                    //     if (res.data[0].legalstatus == _self.patents_productstatus[t].typecode) {
                    //         _legalstatus = _self.patents_productstatus[t].typename
                    //     } else {
                    //         continue;
                    //     }
                    // }
                    for (let t = 0; t < _self.patents_legalstatus.length; t++) {
                        if (res.data[0].legalstatus == _self.patents_legalstatus[t].typecode) {
                            _legalstatus = _self.patents_legalstatus[t].typename
                        } else {
                            continue;
                        }
                    }

                    _self.goods.title = res.data[0].patentname
                    _self.goods.price = res.data[0].price
                    _self.goods.thumb.push('/patent/' + res.data[0].realpath)
                    _self.goods.patentcode = res.data[0].patentcode
                    _self.goods.patenttype = _patenttype
                    _self.goods.industry = _industryType
                    _self.goods.legalstatus = _legalstatus
                    _self.goods.requirees = res.data[0].requirees
                    _self.goods.abstracter = res.data[0].abstracter

                    if (res.data.length > 1) {
                        for (let i = 1; i < res.data.length; i++) {
                            _self.imageList.push('/patent/' + res.data[i].realpath)
                        }
                    }
                })
        },

        // 返回操作
        onClickLeft() {
            let _self = this
            this.$router.push({
                name: 'productList',
                params: {
                    typecode: _self.typecode
                }
            })
        },

        chat() {
            let _self = this
            this.$router.push({
                name: 'chat',
                params: {
                    goods: _self.goods,
                    patdetid: _self.patdetid
                }
            })
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

            this.$http.get('/patent/IWoaPatentsController.do?apiqueryTsTypeByGroupCodes&groupCodesStr=patents_type,patents_industryType,patents_productstatus,patents_legalstatus')
            .then(function(res) {
                _self.patents_industryType = res.data.patents_industryType
                _self.patents_productstatus = res.data.patents_productstatus
                _self.patents_type = res.data.patents_type
                _self.patents_legalstatus  = res.data.patents_legalstatus
                _self.getData()
            })
        }
    },
    // beforeRouteLeave(to, from, next){
    //     if(to.name == 'chat'){
    //         localStorage.setItem('patdetid', this.$route.params.patdetid)
    //         localStorage.setItem('typecode', this.$route.params.typecode)       
    //     }else{
    //         localStorage.removeItem('patdetid')
    //         localStorage.removeItem('typecode')
    //     }
    //     next()
    // },
    created() {
        let _self = this
        this.getCenterData()
        // window.addEventListener('popstate',(e)=>{
        //     console.log(_self.$route)
        //     console.log("1111")
        // })
    }
}
</script>

<style lang="less">
.goods {
  padding-bottom: 50px;
  &-swipe {
    img {
      width: 100%;
      height: 15rem;
      display: block;
    }
  }
  &-title {
    font-size: 16px;
  }
  &-price {
    color: #f44;
  }
  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }
  &-cell-group {
    margin: 15px 0;
    .van-cell__value {
      color: #999;
    }
  }
}
</style>