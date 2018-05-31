<template>
    <div>
        <!-- <van-nav-bar
            title="列表"
            left-arrow
            right-text="筛选"
            @click-right="onClickRight"
            @click-left="onClickLeft"/> -->

        <van-nav-bar
            title="列表"
            left-arrow
            @click-right="onClickRight"
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
                v-for="(item,index) in pList"
                :key=index
                :thumb="item.thumb">
                <div slot="desc" style="margin-top: 10px" @click="toDetail(item.pid)">
                    <span style="font-size: 10px; float: left">申请号：{{ item.patentcode }}</span><br>
                    <span style="font-size: 10px; float: left">行业分类：{{ item.industry }}</span><br>
                    <span style="font-size: 10px; float: left">专利类型：{{ item.patenttype }}</span>
                </div>
                <div slot="footer">
                    <van-button size="small" type="danger" @click="buy(item.pid)">购买</van-button>
                </div>
            </van-card>
        </van-list>

        <!-- <van-popup v-model="show" position="right" :overlay="true">
            <van-tree-select
                :items="items"
                :main-active-index="mainActiveIndex"
                :active-id="activeId"
                @navclick="onNavClick"
                @itemclick="onItemClick"
            />
        </van-popup> -->
    </div>
</template>

<script>
export default {
    data() {
        return{
            show: false,
            loading: false,
            finished: false,
            page: 1,
            searchvalue: '',
            typecode: '',
            imageURL: '',
            pList: [],
            items: [
                {
                    text: '专利类型',
                    children: [
                        {
                            text: '全部',
                            id: 1
                        },
                        {
                            text: '发明专利',
                            id: 2
                        },
                        {
                            text: '实用新型',
                            id: 3
                        },
                        {
                            text: '外观设计',
                            id: 4
                        },
                    ]
                },
                {
                    text: '行业分类',
                    children: [
                        {
                            text: '全部',
                            id: 5
                        },
                        {
                            text: '交通/运输/包装',
                            id: 6
                        },
                        {
                            text: '农林渔牧/食品',
                            id: 7
                        },
                        {
                            text: '化工/冶金/生物',
                            id: 8
                        },
                        {
                            text: '纺织/造纸',
                            id: 9
                        },
                        {
                            text: '建筑/采挖/照明',
                            id: 10
                        },
                        {
                            text: '机械/加工/设备',
                            id: 11
                        },
                        {
                            text: '服装/日用/家电',
                            id: 1002
                        },
                        {
                            text: '通信/电子/数码',
                            id: 12
                        },
                        {
                            text: '医疗/保健/美容',
                            id: 13
                        },
                        {
                            text: '能源/动力/电力',
                            id: 14
                        },
                        {
                            text: '其他',
                            id: 15
                        },
                    ]
                },
                {
                    text: '法律状态',
                    children: [
                        {
                            text: '全部',
                            id: 16
                        },
                        {
                            text: '受理',
                            id: 17
                        },
                        {
                            text: '公开',
                            id: 18
                        },
                        {
                            text: '其他',
                            id: 19
                        },
                    ]
                },
            ],
            mainActiveIndex: 0,
            activeId: 1,
            patents_industryType: [],
            patents_productstatus: [],
            patents_type: []
        }
    },
    methods: {
        getData() {
            let _self = this
            _self.typecode = this.$route.params.typecode

            this.$http.get('/api/IWoaPatentsController.do?apiQueryPatents&page=1&pageSize=10&typecode=' + _self.typecode)
            .then(function(res) {
                for (let i = 0; i < res.data.length; i++) {
                    _self.$http.get('/api/IWoaPatentsController.do?apiQueryPictureByPatentsid&patentsid=' + res.data[i].pid)
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
                            pid: res.data[i].pid,
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

        // 返回操作
        onClickLeft() {
            window.location.href = '/#/HelloWorld?id=' + localStorage.getItem('userId')
        },

        onClickRight() {
            this.show = true
        },

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

        onNavClick(index) {
            this.mainActiveIndex = index;
        },
        onItemClick(data) {
            this.activeId = data.id;
        },

        onLoad() {
            let _self = this
            _self.page = _self.page + 1

            setTimeout(() => {
                _self.$http.get('/api/IWoaPatentsController.do?apiQueryPatents&page='+_self.page+'&pageSize=10&typecode=' + _self.typecode)
                .then(function(res) {
                    if (res.data.length > 0) {
                        for (let i = 0; i < res.data.length; i++) {
                            _self.$http.get('/api/IWoaPatentsController.do?apiQueryPictureByPatentsid&patentsid=' + res.data[i].pid)
                            .then(function(response) {
                                let _img = ''
                                _img = '/api/' + response.data[0].realpath
                                _self.pList.push({
                                    thumb: _img,
                                    patentname: res.data[i].patentname,
                                    patentcode: res.data[i].patentcode,
                                    industry: res.data[i].industry,
                                    patenttype: res.data[i].patenttype,
                                    price: res.data[i].price
                                })
                            })
                        }
                    } else {
                        _self.loading = false
                        _self.finished = true;
                    }
                })
            }, 500);
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
        this.getCenterData()
    }
}
</script>

<style>
    .van-popup--right {
        height: 100%;
        width: 65%;
        font-size: 14px;
    }
    .van-tree-select__content{
        margin-left: 83px;
    }
    .van-tree-select__nav{
        width: auto;
    }
</style>
