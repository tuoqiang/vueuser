<template>
	<topbar text="登录">登录</topbar>
	<login-tips text="登录后可一键成为VIP会员"></login-tips>
	<form class="container form-container" action="#" id="j-form" autocomplete="on" style="height:2.26rem;">
		<form-account></form-account>
		<form-loginpwd></form-loginpwd>
		<form-piccode></form-piccode>
		<button-common @click="loginAction" class="btn-primary  form_btnpos02" text="登陆"></button-common>	
		<button-common @click="" class="formcommon-sty form_btnpos01" text="立即注册"></button-common>	
	</form>
</template>

<script>

import Lib from 'assets/js/lib.js'
import Commmon from 'assets/js/common.js'
import Config from 'assets/js/config.js'
import ButtonCommon from 'components/button-common'
import Topbar from 'components/topbar'
import LoginTips from 'components/login-tips'
import FormAccount from 'components/form-account'
import FormLoginpwd from 'components/form-loginpwd'
import FormPiccode from 'components/form-piccode'

export default {
  data() {
    return {
    	appname:Lib.Config.appname,
    	logo:Lib.Config.logo,
    	user:{
    		UserName:'lanchenglv.com',
    		PassWord:'lanchenglv.com'
    	},
    	loginerror:'',
    	//是否记住密码
    	remember_paw:1,
		login_height:500
    }
  },
  components: {
	ButtonCommon: ButtonCommon,
	Topbar: Topbar,
	LoginTips: LoginTips,
	FormAccount: FormAccount,
	FormLoginpwd: FormLoginpwd,
	FormPiccode: FormPiccode
  },
  created: function () {
    console.log('created run')
    var urlParams = Commmon.getUrlParams();
    console.log(urlParams);
    if(urlParams) {																					
		// 此处是保存urlParams storage的地方
		Commmon.setSessionStorage(Config.URL_PARAMS, urlParams);
		Commmon.setStorage('versionApk', urlParams.av); //  把apk版本号记录下来，为修改忘记密码第三步用
		// urlParams.qr == 'loginbuyQR' && $('#login_guide').show();   // 购买->登录->H5收银台的路径。登录页面显示引导文案
	}
  },
  compiled: function () {
    console.log('compiled run')
    
  },
  ready(){
  	console.log('ready run')
  	
  },
  destroyed(){
  	console.log('destroyed run')
  	
  },
  methods: {
	//登陆操作
    loginAction(){
		this.loginerror = "登陆成功，请稍等...";
		setTimeout(()=>{
			window.location.href = "welcome.html";
		},1000);
	},
	
	//记住密码
	rememberPassword(){
		return this.remember_paw ? '&#xe6dd;' : '&#xe601;';
	}
  }  
}
</script>

<style scoped>

</style>





