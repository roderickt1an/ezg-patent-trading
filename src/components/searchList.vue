<template>
    <div>
        <van-nav-bar
            title="列表"
            left-arrow
            @click-left="onClickLeft"/>

        <form action="/">
            <van-search
                v-model="searchvalue"
                placeholder="输入专利名称搜索"
                @search="onSearch"/>
        </form>

        <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad">
            <van-card
                :price="item.price"
                :title="item.patentname"
                style="background-color: #fff;"
                v-for="item in pList"
                :thumb="item.thumb">
                <div slot="desc" style="margin-top: 10px" @click="toDetail(item.id)">
                    <span style="font-size: 10px; float: left">申请号：{{ item.patentcode }}</span><br>
                    <span style="font-size: 10px; float: left">行业分类：{{ item.industry }}</span><br>
                    <span style="font-size: 10px; float: left">专利类型：{{ item.patenttype }}</span>
                </div>
                <div slot="footer">
                    <van-button size="small" type="danger" @click="buy(item.id)">购买</van-button>
                </div>
            </van-card>
        </van-list>
    </div>
</template>

<script>
export default {
    data() {
        return{
            loading: false,
            finished: false,
            page: 1,
            typecode: '',
            imageURL: '',
            pList: [],
            searchvalue: '',
            searchvalue2: '',
            imageURL: 'https://img.yzcdn.cn/public_files/2017/09/05/100a7845756a70af2df513bdd1307d0e.jpg',
            patents_industryType: [],
            patents_productstatus: [],
            patents_type: []
        }
    },
    methods: {
        // 返回操作
        onClickLeft() {
            // this.$router.go(-1)
            window.location.href = '/#/HelloWorld?id=' + localStorage.getItem('userId')
        },

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

        // 瀑布流
        onLoad() {
            let _self = this
            _self.page = _self.page + 1

            setTimeout(() => {
                        _self.loading = false
                        _self.finished = true;
            }, 500);
        },

        // 点击购买按钮
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

        getData() {
            let _self = this

            this.$http.get('/api/IWoaPatentsController.do?apiCheckPatentsMsg&patentsname=' + _self.searchvalue2)
            .then(function(res) {
                for (let i = 0; i < res.data.length; i++) {
                    _self.$http.get('/api/IWoaPatentsController.do?apiQueryPictureByPatentsid&patentsid=' + res.data[i].id)
                    .then(function(response) {
                        let _img = ''
                        let _patenttype = ''
                        let _industryType = ''
                        _img = '/api/' + response.data[0].realpath

                        for (let k = 0; k < _self.patents_industryType.length; k++) {
                            if (res.data[i].industry == _self.patents_industryType[k].typecode) {
                                _industryType = _self.patents_industryType[k].typename
                            } else {
                                continue;
                            }
                        }
                        for (let j = 0; j < _self.patents_type.length; j++) {
                            if (res.data[i].patenttype == _self.patents_type[j].typecode) {
                                _patenttype = _self.patents_type[j].typename
                            } else {
                                continue;
                            }
                        }

                         _self.pList.push({
                            id: res.data[i].id,
                            thumb: _img,
                            patentname: res.data[i].patentname,
                            patdetid: res.data[i].patdetid,
                            patentcode: res.data[i].patentcode,
                            industry: _industryType,
                            patenttype: _patenttype,
                            price: res.data[i].price
                        })
                    })
                }
            })
        },

        toDetail(a) {
            let _self = this
            this.$router.push({
                name: 'productDetail',
                params: {
                    patdetid: a,
                    typecode: _self.typecode
                }
            })
        },

        getCenterData() {
            let _self = this

            this.$http.get('/api/IWoaPatentsController.do?apiqueryTsTypeByGroupCodes&groupCodesStr=patents_type,patents_industryType,patents_productstatus')
            .then(function(res) {
                _self.patents_industryType = res.data.patents_industryType
                _self.patents_productstatus = res.data.patents_productstatus
                _self.patents_type = res.data.patents_type
                _self.getData()
            })
        }
    },
    mounted() {
        this.searchvalue2 = this.$route.params.searchvalue
        this.getCenterData()
    }
}
</script>