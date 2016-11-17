<template>
	<div class="form-group" :class='needpiccode ? "" : "form-group-bt"'>
		<div class="form-group-in  j_err_iconbox" :class='needpiccode ? "" : "form-group-in-nnobor"'>
			<label for="passwd" class="label-passwd label-piccode">密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
			<!-- 密码可以变成明文显示 -->
			<input  :type="pwdType" 
					class="form-control form-control-pwd" 
					name="passwd" 
					placeholder="请输入密码" 
					value="{{ pwd }}" 
					v-model="pwd" 
					/>
			<i 		class="icon icon-eye icon-eye-login" 
					:class='pwdType=="password" ? "icon-passwd-see" : ""' 
					@click="showPwd" 
					v-show="pwd.length>1" >
					
			</i>
			<a href="javascript:;" data-href="findpwd.html#findex" class="formcommon_a color-01 j-pb-click" data-click="forgot">忘记密码</a>
		</div >
	</div>
</template>


<script>
module.exports = {
  props:{
  	needpiccode:''
  },
  data() {
    return {
      pwd:'',
      pwdType:'password',
      errormsg:'',
    }
  },
  methods: {
    showPwd: function () {
    	this.pwdType == 'password' ? this.pwdType = 'text' : this.pwdType = 'password'; 
    }
  },
  events: {
    'getIptVal': function(){
    	if(!this.pwd){ 
          this.errormsg='密码不能为空';
      	}else{
      	  this.errormsg='';
      	}
      	this.$dispatch('child-pwd-check', this.errormsg);
		    this.$dispatch('child-pwd', this.pwd);
  	}
  }
}
</script>