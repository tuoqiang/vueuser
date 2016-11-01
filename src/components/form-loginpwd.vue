<template>
	<div id="form-group-2" class="form-group form-group-bt">
		<div class="form-group-in form-group-in-nnobor j_err_iconbox" id="j_l_pwd">
			<label for="passwd" class="label-passwd label-piccode">密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
			<!-- 密码可以变成明文显示 -->
			<input type="password" class="form-control form-control-pwd" id="passwd" name="passwd" placeholder="请输入密码" />
			<i class="icon icon-eye icon-passwd-see icon-eye-login" id="j-btn-showOrHidePwd"></i>
			<a href="javascript:;" data-href="findpwd.html#findex" class="formcommon_a color-01 j-pb-click" data-click="forgot">忘记密码</a>
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
