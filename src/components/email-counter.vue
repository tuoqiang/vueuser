<template>
	<div>
		<div class="form-phonetxt3">已发送<span class="spancol">修改请求链接至此邮箱</span><br><span id="emailtext">{{localaccount}}</span></div>
        <div 
            class="pwd-email-btn j-btn j-pb-click" 
            data-click="again" 
            data-block="mailcode" 
          	:class="btnclass"
            :data-click="dataclick"
            :data-block="datablock"
          	@click="sendemailagain" >
              {{countdowntext}}
        </div>
	</div>
</template>

<script>
import Utils from 'assets/js/utils.js'

module.exports = {
  props:{
  	'localaccount':'',
  	'datahref':'',
    'dataclick':'',
    'datablock':'',
  },
  data() {
    return {
      phonecode:'',
      disableBtnTime:0,		// 倒计时1分钟
      countdowntext: '5s',
      btnclass:'btn-resend',
    }
  },
  methods: {
  	'sendemailagain'(){
  		if(this.disableBtnTime > 0){ return false;}
  		this.$dispatch('send-email-again');
  	},
  },
  events: {
    'startEmailCountdown': function(){
    	var self = this;
      var disableBtnTime = 5;
      Utils.emailTimerId = setInterval(function() {
      	 if(disableBtnTime-- > 0) {
      		self.countdowntext = disableBtnTime + 's';
          self.disableBtnTime = disableBtnTime;
          self.btnclass = 'disable';
      	}else {
      		clearInterval(Utils.emailTimerId);				// 清除验证码60s定时器
          Utils.emailTimerId = null;
          self.btnclass = 'btn-resend';
      		self.countdowntext = '重新获取';
      	}
      }, 1000);
    },
  }
}
</script>
