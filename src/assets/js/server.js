var CONFIGURL = 'http://static.ptqy.gitv.tv/tv/common/utils/config.js';
var Rxports = {
	HOSTNAMES: 'http://passport.ptqy.gitv.tv/',

	fetchData: function(url, currVue, opts){
		var self = this;
		opts.agenttype = 44;
		return new Promise(function (resolve, reject) {
			currVue.$http.jsonp( self.HOSTNAMES + url, {params: opts} ).then(
	        	function (res) {
		            if(res.data.code === 'A00000') {
						console.log('Response Success Data: ' ,res);
						resolve(res.data.data);
					}else {
						console.log('Server Error: ', res);
						reject(res.data);
					}
		        }, 	
	        	function (res, errorType, error) {
					console.log('Request Error: ',res);
					if(!res.data){
						reject({
							code: 'tomeout',
							msg: '请求超时, 请重试'
						});
					}
		        }
	        );
        });	
	},

	fetchDataByActvip: function(url, currVue, opts) {
		console.log('Ajax params: ', opts);
		return new Promise(function (resolve, reject) {
			currVue.$http.jsonp( url, {params: opts}  ).then(
	        	function (res) {
		            if(res.data.code === 'A00000') {
						console.log('Response Success Data: ' ,res);
						resolve(res.data.data);
					}else {
						console.log('Server Error: ', res);
						reject(res.data);
					}
		        }, 	
	        	function (res) {
					console.log('Request Error: ',res);
					if(!res.data){
						reject({
							code: 'tomeout',
							msg: '请求超时, 请重试'
						});
					}
		        }
	        );
        });	
	},
	/**
	 * 请求config.js
	 */
	fetchConfig: function() {
		var Deferred = $.Deferred();
		$.ajax({
			url: CONFIGURL,
			dataType: 'jsonp',
			jsonpCallback: 'callback'
		}).done(function( res ) {
			console.log('Response Success Data: ' ,res.backgrounds);
			Deferred.resolve(res.backgrounds);
		});
		return Deferred;
	},

	
	getGiftVip: function(currVue, opts) {
		return this.fetchDataByActvip('http://openapi.vip.ptqy.gitv.tv/act/tvQueryGiftVip.action', currVue, opts);
	},

	/**
	 * 用户登录接口
	 */
	userLogin: function(currVue, opts){
		return this.fetchData('apis/reglogin/login.action', currVue, opts);
	},

	confirmTokenLogin: function(currVue, opts){
		return this.fetchData('apis/qrcode/token_login_confirm.action', currVue, opts);
	},

	getUserInfo: function(currVue, opts) {
		return this.fetchData('apis/user/info.action', currVue, opts);
	},

	/**
	 * 用户获取手机验证码2
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	sendPhonecode: function(currVue, opts) {
		return this.fetchData('apis/phone/send_cellphone_authcode_vcode.action', currVue, opts);
	},

	/**
	 * 验证手机号是否被注册过
	 * @param  {[type]} opts { account: xxxxxx, agenttype: xx }
	 * @return {[type]}      [description]
	 */
	checkAccount: function(currVue, opts) {
		return this.fetchData('apis/user/check_account.action', currVue, opts);
	},

	/**
	 * 验证手机号验证码。用于:
	 * 1. 注册前先要对手机号进行验证
	 * 2. findPasswdByPhone 通过手机号找回密码 种下了cookie p00014
	 * 3. modifypwdByPhone
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	phoneCodeVerify: function(currVue, opts) {
		return this.fetchData('apis/phone/verify_cellphone_authcode.action', currVue, opts);
	},

	/**
	 * 通过手机号注册
	 * password进行了RSA加密
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	phoneRegister: function(currVue, opts) {
		return this.fetchData('apis/reglogin/cellphone_reg.action', currVue, opts);
	},

	/**
	 * 用户重置密码
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	resetPasswd: function(currVue, opts) {
		// opts.https = true;
		return this.fetchData('pages/secure/password/save_pwd.action',currVue, opts);
	},

	/**
	 * 通过邮箱找回密码 种下了cookie p00014
	 * @param  {[type]} opts [description]
	 * @return {[type]}      [description]
	 */
	findPasswdByEmail: function(currVue, opts) {
		return this.fetchData('apis/secure/send_verify_email.action',currVue, opts);
	},
	
}
	
module.exports = Rxports