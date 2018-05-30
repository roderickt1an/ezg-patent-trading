<template>
	<div>
		<van-nav-bar
            title="绑定手机"
            left-arrow
            @click-left="onClickLeft"/>

		<van-field
		    v-model="phone"
		    label="手机号"
		    placeholder="请输入手机号"
		  />
		  <van-cell-group>
		  <van-field
		    center
		    v-model="sms"
		    label="短信验证码"
		    placeholder="请输入短信验证码"
		    icon="clear"
		    @click-icon="sms = ''"
		  >
		    <van-button slot="button" size="small" type="primary" @click="getYZM">获取验证码</van-button>
		  </van-field>
		</van-cell-group>

		<van-cell-group style="position: fixed;bottom: 0;left: 0;right: 0">
			<van-button type="primary" bottom-action :disabled="isDisable" @click="bangding">立即绑定</van-button>
		</van-cell-group>
	</div>
</template>

<script>
export default {
    data() {
    	return{
    		phone: '',
    		sms: '',
    		yzm: '',
    		isDisable: true
    	}
    },
    watch: {
    	sms(a) {
    		let _self = this
    		if (a == _self.yzm) {
    			_self.isDisable = false
    		}
    	}
    },
    methods: {
    	onClickLeft() {
    		this.$router.go(-1)
    	},

    	getYZM() {
    		let _self = this
    		if(_self.phone != '') {
    			_self.$http.get('/api/IWoaPatentsController.do?apigetPhoneVerify&userid=' + localStorage.getItem('userId') + '&usertel=' + _self.phone)
    			.then(function(res) {
    				_self.yzm = res.data
    				_self.$toast.success('验证码已发送')
    			})
    		}
    	},

    	bangding() {
    		let _self = this

    		this.$http.get('/api/IWoaPatentsController.do?apisavePatentsUserTel&userid=' + localStorage.getItem('userId') + '&usertel=' + _self.phone)
    		.then(function(res) {
    			_self.$toast.success(res.data.msg)
                _self.$router.push({
                    name: 'orderList'
                })
    		})
    	}
    }
}
</script>