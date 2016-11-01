<template>
	<div  class="form-group form-group-piccode form-group-bt" id="j-group-piccode">
		<div class="form-group-in form-group-in-nnobor j_err_iconbox" id="j_l_code">
			<label for="piccode" class="label-piccode">验证码：</label>
			<input type="text" class="form-control form-control-piccode"  id="piccode" name="piccode" placeholder="请输入右侧验证码">
			<!-- <i class="icon icon-piccodeerr icon-eye-login" id="j-btn-piccodeerr"></i> -->
			<i id="j-piccode-parent" class="form-piccode"><img src="http://passport.ptqy.gitv.tv/apis/register/vcode.action?width=120&height=46" alt="" class="j-btn img-responsive j-pb-click" data-page="login" id="j-btn-piccode" data-click="captcha"></i>
		</div >
	</div>
</template>


<script>

import Lib from 'assets/Lib.js'

module.exports = {
  props:{
  	"text":{
  		type:String,
  		default:""
  	}
  }
}

</script>


<style scoped>

</style>
