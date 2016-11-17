<template>
	<div>
		<div class="form-phonetxt3">已发送<span class="spancol">修改请求链接至此邮箱</span><br><span id="emailtext">{{email}}</span></div>
        <div class="pwd-email-btn j-btn j-pb-click" data-click="again" data-block="mailcode" 
        	:class=" disableBtnTime > -1 && disableBtnTime != 5 ? 'disable' : '' "
        	@click="sendemailagain"
        	>{{countdowntext}}
        </div>
	</div>
</template>


<script>
import Utils from 'assets/js/utils.js'

module.exports = {
  props:{
  	'email':'',
  	'datahref':'',
  },
  data() {
    return {
      phonecode:'',
      disableBtnTime :0,		// 倒计时1分钟
      countdowntext: '重新获取',
    }
  },
  methods: {
  	'sendemailagain'(){
  		if(this.disableBtnTime > 0){ return false;}
  		console.log('子组件的sendemailagain')
  		this.$dispatch('send-email-again');
  	},
  },
  events: {
    'getIptVal': function(){
    	this.errormsg = Utils.checkPhonecode(this.phonecode);
      	this.$dispatch('child-phonecode-check', this.errormsg);
    	this.$dispatch('child-phonecode', this.phonecode); 
    },
    'startEmailCountdown': function(){
    	var self = this;
      var disableBtnTime = 5;
      Utils.emailTimerId = setInterval(function() {
      	if(disableBtnTime-- > 0) {
      		self.countdowntext = disableBtnTime + 's';
          self.disableBtnTime = disableBtnTime;
      	}else {
      		clearInterval(Utils.emailTimerId);				// 清除验证码60s定时器
          Utils.emailTimerId = null;
      		self.countdowntext = '重新获取';
      	}
      }, 1000);
    },
  }
}
</script>
