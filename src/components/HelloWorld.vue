<template>
    <div>
        <van-nav-bar
            title="专利交易平台"/>

        <form action="/">
            <van-search
                v-model="searchvalue"
                placeholder="输入专利名称搜索"
                @search="onSearch"/>
        </form>

        <div style="margin-top: 5px"></div>

        <div style="padding: 10px 0 0 10px; background-color: #ffff; border-bottom: 1px solid #eeee;">
            <img style="vertical-align:middle;height: 30px; width: 28px" src="./5.png"><span style="margin-left: 2%; color: #FF0000">专利精选</span>
        </div>

        <van-row style="background-color: #ffff;padding-top: 10px">
                <van-col span="8" v-for="item in list2">
                    <center>
                        <img :src="item.src" style="width: 80px; height: 80px"  @click="toProductList(item)">
                        <p style="font-size: 14px;color: #aaa;">{{ item.content }}</p>
                    </center>
                </van-col>
        </van-row>

        <div style="margin-top: 5px"></div>

        <div style="padding: 10px 0 0 10px; background-color: #ffff; border-bottom: 1px solid #eeee;">
            <img style="vertical-align:middle;height: 30px; width: 28px" src="./u51.png"><span style="margin-left: 2%; color: #FF0000">热门分类</span>
        </div>

        <van-list>
            <van-row gutter="20" style="background-color: #ffff;padding-top: 10px;padding-bottom: 50px">
                <van-col span="8" v-for="(item, index) in list">
                    <center>
                        <img :src="item.src" style="width: 80px; height: 80px"  @click="toProductList(item)">
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

            for (let i = 0; i < res.data.length; i++) {
                let _data = {}
                _data.typecode = res.data[i].typecode
                _data.content = res.data[i].typename
                if (i < 3) {
                    _self.list2.push(_data)
                } else {
                    _self.list.push(_data)
                }
            }

            _self.list2[0].src = './static/img/home/jt.png'
            _self.list2[1].src = './static/img/home/ny.jpg'
            _self.list2[2].src = './static/img/home/hg.png'
            _self.list[0].src = './static/img/home/fz.png'
            _self.list[1].src = './static/img/home/jz.png'
            _self.list[2].src = './static/img/home/jx.png'
            _self.list[3].src = './static/img/home/ry.png'
            _self.list[4].src = './static/img/home/tx.png'
            _self.list[5].src = './static/img/home/yl.png'
            _self.list[6].src = './static/img/home/ny.png'
            _self.list[7].src = './static/img/home/qt.png'
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