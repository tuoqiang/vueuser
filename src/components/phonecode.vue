<template>
	<div id="rcode" class="hashbox" style="height:1.74rem;">
		<div class="form-phonetxt">已发送验证码到此手机号<br><span id="cellphoneNum">{{phonenum}}</span></div>
		<div class="form-group form-bortop form-borbot form-bortop-pos1" data-step="iptVerificatiCode">
			<div class="form-group-in form-group-in-nnobor j_err_iconbox" id="j_r_phonecode">
				<label for="phonecode" class="label-phonecode">验证码：</label>
				<input type="tel" 
						class="form-control form-control-phonecode" 
						maxlength="6"
						name="phonecode" 
						placeholder="请输入验证码"
						v-model="phonecode" 
						value="{{ phonecode }}" 
							>
				<a  :data-href="datahref" class="formcommon_a j-pb-click" :class=" countdown > 0 && countdown != 5 ? 'disable' : 'btn-resend' " >{{countdowntext}}</a>
			</div>
		</div>
	</div>
</template>


<script>
import Utils from 'assets/js/utils.js'

module.exports = {
  props:{
  	'phonenum':'',
  	'datahref':'',
  },
  data() {
    return {
      phonecode:'',
      countdown:5,		// 倒计时1分钟
      countdowntext: '重新获取',
    }
  },

  events: {
    'getIptVal': function(){
    	this.errormsg = Utils.checkPhonecode(this.phonecode);
      	this.$dispatch('child-phonecode-check', this.errormsg);
    	this.$dispatch('child-phonecode', this.phonecode); 
    },
    'startCountdown': function(){
    	var self = this;
    	var countdown = 5;
    	self.phonenum = Utils.getEncryptPhone(self.phonenum, 7);		
		Utils.codeTimerId = setInterval(function() {
			if(countdown-- > 0) {
				self.countdowntext = countdown + 's';
				self.countdown = countdown;
			}else {
				clearInterval(Utils.codeTimerId);				// 清除验证码60s定时器
				Utils.codeTimerId = null;
				self.countdowntext = '重新获取';
			}
		}, 1000);
    },
  },
  destroye: function () {
     /* console.log('destroye run');
      this.countdown = 5;
      this.countdowntext = '重新获取';*/
  },
}
</script>
