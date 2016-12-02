<template>
	<div>
		<div :class="phonetxtclass">已发送验证码到此手机号<br><span>{{phone}}</span></div>
		<div class="form-group form-bortop form-borbot" :class="iptclass">
			<div class="form-group-in form-group-in-nnobor j_err_iconbox">
				<label for="phonecode" class="label-phonecode">验证码：</label>
				<input  
                type="tel" 
                class="form-control form-control-phonecode" 
                maxlength="6"
                name="phonecode" 
                placeholder="请输入验证码"
                v-model="phonecode" 
                value="{{ phonecode }}" >
				<a      
                class="formcommon_a j-pb-click" 
                :data-href="regethref" 
                :class="btnclass" 
                :data-click="dataclick"
                :data-block="datablock" >
                  {{countdowntext}}
        </a>
			</div>
		</div>
	</div>
</template>

<script>
import Utils from 'assets/js/utils.js'

module.exports = {
  props:{
  	'phone':'',
  	'regethref':'',
    'iptclass':'',
    'phonetxtclass':'',
    'dataclick':'',
    'datablock':'',
  },
  data() {
    return {
      phonecode :'',
      countdowntext: '5s',
      btnclass:'btn-resend'
    }
  },
  events: {
    'getPhonecodeVal': function(){
      	this.errormsg = Utils.checkPhonecode(this.phonecode);
        this.$dispatch('child-phonecode-check', this.errormsg);
      	this.$dispatch('child-phonecode', this.phonecode); 
    },
    'startCountdown': function(){
      	var self = this;
      	var countdown = 5;
      	self.phone = Utils.getEncryptPhone(self.phone, 7);		
        Utils.codeTimerId = setInterval(function() {
          if(countdown-- > 0) {
            self.countdowntext = countdown + 's';
            self.countdown = countdown;
            self.btnclass = 'disable';
          }else {
            clearInterval(Utils.codeTimerId);				// 清除验证码60s定时器
            Utils.codeTimerId = null;
            self.btnclass = 'btn-resend';
            self.countdowntext = '重新获取';
          }
        }, 1000);
    },
  },
}
</script>
