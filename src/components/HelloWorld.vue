<template>
    <div>
        <!-- <van-nav-bar
            title="专利交易平台"/> -->

        <form action="/" style="height:200px;background-image:url(/static/img/home2/banner.jpg)">
            <center style="padding-top:25px;color:#202020;letter-spacing:3px;opacity:0.8"><h3>专利交易平台</h3></center>
            <van-search
                style="top:10px;background: rgba(0,0,0,0)"
                v-model="searchvalue"
                show-action
                placeholder="输入专利名称搜索"
                @search="onSearch">
                <div slot="action" @click="onSearch" style="margin-left:10px;margin-right:10px;color:#666666;">
                    <van-button type="default" size="small" style="">搜索</van-button></div>
            </van-search>
        </form>

        <div style="margin-top: 5px"></div>

        <div style="padding: 10px 0 0 10px; background-color: #ffff; border-bottom: 1px solid #eeeeee;">
            <img style="vertical-align:middle;height: 30px; width: 28px;margin-bottom:10px" src="./5.png"><span style="margin-left: 2%; color: #666666;font-weight:bold;">专利精选</span>
        </div>
        <!-- <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(item, index) in list2" :key="index">
                <img v-lazy="item.src" style="width:100%;height:120px;"/>
                <img :src="item.src">
                <div style="width:100%;height:60px">
                    <p>{{ item.content }}</p>
                </div>
            </van-swipe-item>
        </van-swipe> -->

        <van-row style="background-color: #ffffff;padding-top: 10px">
                <van-col span="6" v-for="(item,index) in list2" :key=index>
                    <center>
                        <img v-lazy="item.src" style="width: 80px; height: 80px;"  @click="toDetail(item)">
                        <p style="font-size: 14px;color: #aaa;">{{ item.content }}</p>
                    </center>
                </van-col>
        </van-row>

        <div style="margin-top: 5px"></div>

        <div style="padding: 10px 0 0 10px; background-color: #ffff; border-bottom: 1px solid #eeeeee;">
            <img style="vertical-align:middle;height: 30px; width: 28px;margin-bottom:10px" src="./u51.png"><span style="margin-left: 2%;color: #666666;font-weight:bold;">热门分类</span>
        </div>

        <van-list>
            <van-row gutter="20" style="background-color: #ffffff;padding-top: 10px;padding-bottom: 50px;padding-left:15px;padding-right:15px">
                <van-col span="6" v-for="(item, index) in list" :key=index style="height:130px">
                    <center>
                        <img :src="item.src" style="width: 50px; height: 50px"  @click="toProductList(item)">
                        <p style="font-size: 14px;color: #aaa;">{{ item.content }}</p>
                    </center>
                </van-col>
            </van-row>
        </van-list>

        <van-tabbar v-model="active" @change="tochange" v-if="isInput">
            <van-tabbar-item icon="wap-home">首页</van-tabbar-item>
            <van-tabbar-item icon="cart">订单</van-tabbar-item>
            <van-tabbar-item icon="contact">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
  data() {
    return{
      active: 0,
      searchvalue: '',
      isInput: true,
      images: [
        'https://img.yzcdn.cn/public_files/2017/09/05/100a7845756a70af2df513bdd1307d0e.jpg',
        'https://img.yzcdn.cn/public_files/2017/09/05/8a4f5be8289cb3a7434fc19a3de780a2.jpg',
      ],
      list: [],
      list2: []
    }
  },
  methods: {
    // 用户点击键盘上的 搜索/回车 按钮触发
    onSearch() {
        let _self = this
        
        if (_self.searchvalue == '') {
            _self.$toast('请输入搜索内容')
        } else {
            _self.$router.push({
                name: 'searchList',
                params: {
                    searchvalue: _self.searchvalue
                }
            })
        }
    },

    toProductList(a) {
        this.$router.push({
            name: 'productList',
            params: {
                typecode: a.typecode
            }
        })
    },

    getParding() {
        let _self = this
        this.$http.get('/api/IWoaPatentsController.do?apiQueryPatentsClassify')
        .then(function(res) {
            _self.list = []
            // alert(res.data)
            for (let i = 0; i < res.data.length; i++) {
                let _data = {}
                _data.typecode = res.data[i].typecode
                _data.content = res.data[i].typename
                // if (i < 3) {
                //     _self.list2.push(_data)
                // } 
                _self.list.push(_data)

            }

            // _self.list2[0].src = './static/img/home/jt.png'
            // _self.list2[1].src = './static/img/home/ny.jpg'
            // _self.list2[2].src = './static/img/home/hg.png'
            _self.list[0].src = './static/img/home2/jt.png'
            _self.list[1].src = './static/img/home2/sp.png'
            _self.list[2].src = './static/img/home2/hg.png'
            _self.list[3].src = './static/img/home2/fz.png'
            _self.list[4].src = './static/img/home2/jz.png'
            _self.list[5].src = './static/img/home2/jx.png'
            _self.list[6].src = './static/img/home2/ry.png'
            _self.list[7].src = './static/img/home2/tx.png'
            _self.list[8].src = './static/img/home2/yl.png'
            _self.list[9].src = './static/img/home2/ny.png'
            _self.list[10].src = './static/img/home2/qt.png'
        })
        this.$http.get('/api/IWoaPatentsController.do?apiqueryPatentChoiceness')
        .then(function(res) {
            _self.list2 = []
            // alert(res.data)
            for (let i = 0; i < res.data.length; i++) {
                let _data = {}
                _self.$http.get('/api/IWoaPatentsController.do?apiQueryPictureByPatentsid&patentsid=' + res.data[i].pid).then(function(srcres){
                    // console.log(srcres.data[0].realpath)
                    _data.src = '/api/' + srcres.data[0].realpath
                    _data.pid = res.data[i].pid
                    _data.content = res.data[i].patentname
                    _data.typecode = res.data[i].typecode
                    // if (i < 3) {
                    //     _self.list2.push(_data)
                    // } 
                    // console.log(_data)
                    _self.list2.push(_data)
                })
                

            }
        })
    },

        getUserId() {
            let _self = this
            let url = window.location.href
            let theRequest = new Object()
            let strs = []

            if (url.indexOf("?") != -1) {
                let str = url.substr(1)
                strs = str.split("id=")
                localStorage.setItem('userId', strs[1])
            } else {
                localStorage.setItem('userId', _self.$route.params.id)
            }
        },

        tochange(a) {
            let _self = this

            if (a == 1) {
                _self.$router.push({
                    name: 'cart'
                })
            } else if (a == 2) {
                _self.$router.push({
                    name: 'orderList'
                })
            }
        },

        test() {
            this.isInput = false
        },

        test2() {
            this.isInput = true
        },

        toDetail(a) {
            let _self = this
            console.log(a)
            this.$router.push({
                name: 'productDetail',
                params: {
                    patdetid: a.pid,
                    typecode: _self.typecode
                }
            })
        },
  },
  mounted() {
      this.getParding()
      this.getUserId() 
  }
}
</script>

<style>
    .imgswipe{
        width: 100%;
        height: 240px;
        display: block;
        padding: 30px 60px;
        box-sizing: border-box;
        background-color: #fff;
        pointer-events: none;
    }
</style>