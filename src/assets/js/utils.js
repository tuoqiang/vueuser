import Pingback from 'assets/js/pingback';
import Config from 'assets/js/config';
import Rsautils from 'assets/js/rsautils';
import Storage from 'assets/js/storage';
import Server from 'assets/js/server';

var TIMEOUT_GO = 500;			// 设置页面最迟跳转时间

var SERVICE_ID = 2;				// 服务类型，mobile填1，web填2，帕帕奇填3
var PHONECALL_RG = /^1[0-9]\d{9}$/;
var EMAIL_RG = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
var PASSWORD_RG = /^[A-Za-z0-9_~!@#$%^&*()_+=|<>,.{}:;\]\[-\\\/?"']{8,20}$/;
var CONFIGURL = 'http://static.ptqy.gitv.tv/tv/common/utils/config.js';;
var tapType = ('ontouchend' in window) ? 'touchend' : 'click';			// 确定用户单击操作时的类型
var tvVersionLine = 5.3; 		// 荔枝套餐和白金套餐分界版本
var packagePid = 'adb3376b039b970b'		// 套餐类型， 默认是白金套餐  白金‘adb3376b039b970b’;荔枝'9ff1a15abb9b50b8'
var proText = {
	'protype1' : '密码修改成功',
	'protype7' : '电视端登录后可享更多服务',
	'protype32' : '电视端登录后可享更多服务',
	'protype34' : '密码找回成功',
	'protype10' : '手机号绑定成功'
};



// user_type
var NO_VIP_MEMBER 			= 0			// 不是会员
var EXPIRE_MEMBER 			= 1 		// 封停会员
var VIP_MEMBER 				= 2
var GOLD_VIP_MEMBER 		= 3 		// 黄金
var SILVER_VIP_MEMBER 		= 4 		// 白银
var PLATINUM_VIP_MEMBER 	= 5 		// 白金
var PHONE_MONTH_VIP_MEMBER 	= 6
var LITCHI_VIP_MEMBER 		= 7 		// 荔枝
var TV_VIP_MEMBER 			= 8 		// 荔枝白金
var GOLD_LITCHI_MEMBER		= 9 		// 荔枝黄金
var SILVER_LITCHI_MEMBER	= 10 		// 荔枝白银

// 数据统计常量
var PB_BEHAVIOR_LOGIN		= 7			// 登录
var PB_BEHAVIOR_REGISTER 	= 32		// 注册
var PB_BEHAVIOR_FINDPWD		= 34		// 找回密码
var PB_BEHAVIOR_MODPWD		= 1			// 修改密码
var PB_BEHAVIOR_BIND		= 10		// 绑定手机号

// 数据统计常量
var SCENE_LOGIN		= 'login'			// 登录
var SCENE_REGISTER 	= 'register'		// 注册
var SCENE_FINDPWD	= 'resetpwd'		// 找回密码
var SCENE_MODPWD	= 'modpwd'		// 修改密码
var SCENE_BIND		= 'bind'		// 绑定手机号

/*Rxports.BEHAVIOR_LOGIN		= 1			// 登录
Rxports.BEHAVIOR_REGISTER 	= 2		// 注册
Rxports.BEHAVIOR_FINDPWD	= 3		// 找回密码
Rxports.BEHAVIOR_MODPWD		= 4			// 修改密码
Rxports.BEHAVIOR_BIND		= 5		// 绑定手机号*/



var Rxports = {
	emailTimerId:null,	// 邮箱验证码60s定时器
	codeTimerId:null, // 短信验证码60s定时器
	submitingFlag: false,
	URL_PARAMS: 'urlParams',
	BEHAVIOR_LOGIN		: 1 ,			// 登录
	BEHAVIOR_REGISTER 	: 2	,	// 注册
	BEHAVIOR_FINDPWD	: 3	,	// 找回密码
	BEHAVIOR_MODPWD		: 4	,		// 修改密码
	BEHAVIOR_BIND		: 5	,	// 绑定手机号
	REQUEST_REGISTER: 1,
	REQUEST_FINDPWD: 2,
	tokenError: {
		login: '暂未登录成功<br>请重新扫码登录',
		register: '注册已完成<br>请重新扫码登录',
		resetpwd: '已重置密码<br>请重新扫码登录'
	},
	/**
	 * 获取手机验证码
	 * @param  {[type]} el [description]
	 * @return {[type]}    [description]
	 */
	phonecodeHandler: function(currVue, data, requestType, authcookie) {
		console.log('h5_moble! phonecodeHandler() come in');
		var self = this;
		return new Promise(function (resolve, reject) {
			self.sendPhonecode(currVue, data, requestType, authcookie)
			.then(function(res){
				console.log("h5_moble! Utils.sendPhonecode success");
				resolve(res);	
				/*var usernameId = (pagetype === 'bpthird') ? 'cellphoneNumSecond' : 'cellphoneNum';
				setUsername(data.account, 7, usernameId);*/
			},function(res) {
				console.log("h5_moble! Utils.sendPhonecode fail");
				if(res.code === 'P00404' || res.code === 'P00108'){  							// 108-户不存在; 404-用户已注册--单独发错误日志
					//Pingback.errLogger(e.code, getErrPbBlock());
				}
				if(requestType == 1 && res.code === 'P00404'){								// 手机号已经被注册时，显示忘记密码链接
					//Pingback.pageLoaded('forgot');
				}
				reject(res);
			});
		});	
	},
	sendPhonecode: function (currVue, data, requestType, authcookie) {
		var self = this;
		return new Promise(function (resolve, reject) {
			Server.checkAccount(currVue, { account: data.account }).then(function(res) {
				console.log("h5_moble! Server.checkAccount check success");
				// res: true 注册过，false 未注册过
				// res: 有时会出现对象的情况，所以要明确res的值
				if(requestType === 1 && (res === true)) {				// 手机号已经被注册过
					//Utils.clearCodeTimer($el);
					reject({ code: 'P00404', errType:'manual' });		// P00404手机号已经被注册
				}else if(requestType === 2 && (res === false)) {		// 找回密码的用户不存在
					//Utils.showErrorMsg({ code: 'P00108', errType:'manual'  });
					//Utils.clearCodeTimer($el);
					reject({ code: 'P00108' });
				}else {
					// 向手机发送验证码
					Server.sendPhonecode(currVue, {
							requestType: requestType,
							cellphoneNumber: data.account,
							vcode: data.piccode,
							serviceId: SERVICE_ID,
							authcookie: authcookie
						}
					).then(function(res){
						console.log("h5_moble! Server.sendPhonecode success");
						resolve(res);	
					}, function(e) {
						console.log("h5_moble! Server.sendPhonecode fail");
						reject(e);
					});
				}
			}, function(e) {
				console.log("h5_moble! Server.checkAccount check success");
				reject(e);
			});
		});	
	},

	/**
	 * 验证手机验证码
	 * @param  {[type]} el [description]
	 * @return {[type]}    [description]
	 */
	phoneCodeVerify: function(currVue, data, requestType, authcookie) {
		return new Promise(function (resolve, reject) {
			Server.phoneCodeVerify(currVue, {
				authCode: data.phonecode,
				cellphoneNumber: data.account,
				requestType: requestType,
				serviceId: SERVICE_ID,
				authcookie: authcookie
			}).then(function(res) {					// 手机验证码正确，可以注册
				console.log('h5_moble! Server.phoneCodeVerify check success');
				resolve(res);
			}, function(res) {
				console.log('h5_moble! Server.phoneCodeVerify check fail');
				reject(res);
			});
		});	
	},

	phoneRegister: function(currVue, data, requestType){
		return new Promise(function (resolve, reject) {
			Server.phoneRegister(currVue, {
				cellphoneNumber: data.account,
				password: data.pwd,
				authCode: data.phonecode,
				serviceId: SERVICE_ID
			}).then(function(res) {					// 手机验证码正确，可以注册
				console.log('h5_moble! Server.phoneCodeVerify check success');
				resolve(res);
			}, function(res) {
				console.log('h5_moble! Server.phoneCodeVerify check fail');
				reject(res);
			});
		});	
	},

	sendFpwdRequest: function(currVue, data){
		return new Promise(function (resolve, reject) {
			Server.resetPasswd(currVue, data).then(function(res) {					// 手机验证码正确，可以注册
				console.log('h5_moble! Server.sendFpwRequest success');
				resolve(res);
			}, function(res) {
				console.log('h5_moble! Server.sendFpwRequest fail');
				reject(res);
			});
		});	
	},

	sendEmailRequest: function(currVue, data){
		var self = this;
		return new Promise(function (resolve, reject) {
			Server.findPasswdByEmail(currVue, {
				email: data.email,
				antiCsrf: null,
				type: 16,
				authcookie: null,
				redirect: 'http://cms.ptqy.gitv.tv:8083/module/findpwd.html#fpwd?v='+Storage.getSessionStorage(self.URL_PARAMS).av + '&uuid=' + Storage.getSessionStorage(self.URL_PARAMS).ui
			}).then(function(res) {					// 手机验证码正确，可以注册
				console.log('h5_moble! Server.findPasswdByEmail success');
				resolve(res);
			}, function(res) {
				console.log('h5_moble! Server.findPasswdByEmail fail');
				reject(res);
			});
		});	
	},

	getScene: function(behavior){
		var sceneArr = [SCENE_LOGIN, SCENE_REGISTER, SCENE_FINDPWD, SCENE_MODPWD, SCENE_BIND];
		return sceneArr[behavior-1];
	},

	getSceneVal: function(behavior){
		var sceneArr = [PB_BEHAVIOR_LOGIN, PB_BEHAVIOR_REGISTER, PB_BEHAVIOR_FINDPWD, PB_BEHAVIOR_MODPWD, PB_BEHAVIOR_BIND];
		return sceneArr[behavior-1];
	},

	getBlock: function(behavior){
		var blockArr = [SCENE_LOGIN, SCENE_REGISTER, SCENE_FINDPWD, SCENE_MODPWD, SCENE_BIND];
		return blockArr[behavior-1];
	},

	getUrlParams: function(){
		console.log('getUrlParams run')
		var querystring = location.search.substring(1);
		console.log('h5_moble!  querystring' + querystring);
		console.log('h5_moble!  querystring');
		return this.getUrlParamsToObj(querystring);
	},

	getParamsFromPersionQrcode: function(){
		var res = null;
		var querystring = location.search.substring(1);
		console.log('h5_moble!  querystring' + querystring);
		if(!querystring) return res;
		res = this.stringToObj(querystring, '&', '=');
		var extra = res.extra;
		res.extra = undefined;
		var extraJson = !extra ? {} : this.stringToObj(extra, ';', ':');
		return $.extend(res, extraJson)
	},

	// 分解url的参数成对象
	// 由于url参数规则不一致，做不同处理
	getUrlParamsToObj: function(querystring){
		console.log('getUrlParamsToObj run1111111111111')
		var res = null;
		if(!querystring) return res;
		if(querystring.indexOf('redirectUrl') === -1 ) {				// 不存在重定向url
			res = this.getParamsObjByUrl(querystring);
		}else {															// 存在重定向url
			res = this.getParamsObjByUrlAndRedirectUrl(querystring);
		}
		res.qr = this.getS1(querystring);
		res.e = Pingback.getEventId();
		res.uuid = !res.ui ? res.uuid : res.ui; 						// 从购买二维码为uuid;个人中心二维码为ui
		return res;
	},

	/**
	 * 获取url中的参数
	 * @param  {[type]} s [description]
	 * @return {[type]}   [description]
	 */
	getParamsObjByUrl: function(s){
		console.log('getParamsObjByUrl run')
		var o = this.getParamsObjByStrToObj(s);
		var extra = o.extra;
		o.extra = undefined;
		// if(!extra) return o;
		// 如果不存在extra字段返回空对象
		var res = !extra ? {} : this.stringToObj(extra, ';', ':');
		console.log('res=')
		console.log(res)
		//	个人中心二维码扫码打开登录页时不存在referer
		//	来源页面目前用到的有：chat.html
		!!document.referrer && (res.redirectUrl = document.referrer); 
		console.log('$.extend(o, res)')
		console.log($.extend(o, res))					
		return $.extend(o, res);							// qr:页面来源：s1 
	},

	/**
	 * 获取url（其中包含RedirectUrl：这里的参数也要拆分出来）中参数
	 * token: & redirectUrl:
	 * @param  {[type]} s [description]
	 * @return {[type]}   [description]
	 */
	getParamsObjByUrlAndRedirectUrl: function(s){
		var res = {};
		var paramsArr = this.splitUrlByRedirectUrl(s); 										// 存放redirectUrl和其他剩余参数（字符串形式）的数组
		var otherParamObj = this.getParamsObjByStrToObj(paramsArr[1]);
		!!otherParamObj &&　(res = otherParamObj);										// 可能不存在，为'',除了redirUrl参数外的其他参数对象,有可能为空
		var url = res.redirectUrl = paramsArr[0]; 										// redirectUrl值
		var o = this.getParamsObjByStrToObj(url.substring(url.indexOf('?') + 1));
		!!o && (fr = this.getParamsObjByStrToObj(decodeURIComponent(o.fr_version)));

		return $.extend( o, fr, res);			
	},

	// 把url参数字符串转换成对象
	getParamsObjByStrToObj: function(querystring) {
		return this.stringToObj(querystring, '&', '=');
	},

	/**
	 * 目前调用购买页的入口
	 * 1 个人中心扫码登录；2 购买页二维码扫码登录；3；客服页；4 boss支付页；5 vip试用页；6 直接输入login.html
	 */
	getS1: function(s){
		var o = this.getParamsObjByStrToObj(s);
		if(!!o.s1){
			return o.s1;
		}
		if(o.login_from_suggest){    // 在线客服页面
			return 'suggestfb';
		}
		if(o.extra){
			return 'loginQR';
		}
		if(o.fr_version){
			return 'loginbuyQR';
		}
		return 'NA'
	},

	/**
	 * 根据“redirectUrl”出现的位置分割url中的参数
	 * @param  s str       要分隔的url字符串
	 * @return {array}     例如：[‘url’, ‘a=1&b=2&c=3’]
	 */
	splitUrlByRedirectUrl: function(s){
		var keyword = 'redirectUrl';
		var index = s.indexOf(keyword);
		var redirectUrlStr = s.substring(keyword.length + index + 1);
		var otherParamStr = s.substring(0, index-1 );
		return [this.getDecodeUrl(redirectUrlStr), otherParamStr]; 		// [redirectUrl, 包含剩余参数的字符串]
	},

	getDecodeUrl: function(url){
		return url.indexOf('http://') === 0 ? url : decodeURIComponent(url)
	},

	/**
	 * 把url参数字符串转换成对象
	 * @param 
	 * @return
	 */
	/*getUrlParamsToObj: function(querystring){
		return this.stringToObj(querystring, '&', '=');
	},*/

	/**
	 * 把字符串根据规律转换成对象序列
	 * @param  {[type]} s          有序的字符串
	 * @param  {[type]} separator1 [description]
	 * @param  {[type]} separator2 [description]
	 * @return {[type]}            [description]
	 */
	stringToObj: function(s, separator1, separator2){
		if(!s){return null;}
		var res = {}, 
			a = s.split(separator1),						// 第一次分割, 数组类型
			i = a.length;
		while(i--) {
			var subA = a[i].split(separator2);				// 第二次分割
			if(subA[1] !== undefined) {						// 过滤空值项
				res[subA[0]] = subA[1];						// 左值为key，右值为value
			}
		}
		return res;
	},

	
	getAuthCookie: function(){
		var cookie = Storage.getCookie('P00001');
		var urlParams = this.stringToObj(location.search.substring(1), '&', '=');
		if(!!urlParams && !!urlParams.cok) {
			cookie = urlParams.cok;
			Storage.setCookie('P00001', urlParams.cok); // 从url传过来的cookie值保存到本地，跨软件扫码会用到，否则第二个页面获取不到cookie值
		}
		return cookie;
	},

	

	/**
	 * 密码RSA加密
	 * @param  {[type]} passwd [description]
	 * @return {[type]}        [description]
	 */
	geta: function(passwd) {
		var KEY_MODULUS = 'ab86b6371b5318aaa1d3c9e612a9f1264f372323c8c0f19875b5fc3b3fd3afcc1e5bec527aa94bfa85bffc157e4245aebda05389a5357b75115ac94f074aefcd';
		var KEY_EXPONENT = '10001';
		var key = Rsautils.getKeyPair( KEY_EXPONENT, '', KEY_MODULUS );
		return Rsautils.encryptedString(key, encodeURIComponent(passwd)).replace(/\s/g,'-');
	},

	confirmTokenLogin: function(self, behavior){
		console.log('h5_moble  Utils.confirmTokenLogin run');
			var _self = this;
			var urlParams = (self.urlParams || Pingback.getUrlParamsStorage());
		
			var scene = _self.getScene(behavior);
			var block = _self.getBlock(behavior);
			var pbBehavior = _self.getSceneVal(behavior);
			var timerId = null;
			var cookie = Storage.getCookie('P00001');
			Storage.setSessionStorage('proType', pbBehavior);						// 设置个人中心10s文案类别
			return new Promise(function(resolve, reject){
				if(urlParams && urlParams.token){
					
						Server.confirmTokenLogin(self, {token: urlParams.token, authcookie: cookie}).then(function(res) {	
							sendUserBehaviorPb();
							resolve(res);
						}, function(res) {
							if(!!urlParams.redirectUrl){ 									// 如果存在redirectUrl，则token失效继续跳转走后面的逻辑
								sendUserBehaviorPb();
								resolve(res);
							}else{
								reject(res);
							}
						});
				}else{
					sendUserBehaviorPb();
					resolve();
				}
			});
		// 发送登录成功日志
		function sendUserBehaviorPb(){
			if(scene != _self.SCENE_FINDPWD){ 								// SCENE_FINDPWD 找回密码情况已经发送过
				timerId = setTimeout(function() {							// 最迟TIMEOUT_GO 页面跳转
					_self.gotoPageByUrl(urlParams);
				}, TIMEOUT_GO);

				/*Pingback.userBehavior(pbBehavior, function() {
					clearTimeout(timerId);							// 如果pingback发送成功，取消定时器
					Utils.gotoPageByUrl(urlParams);							// 页面立即跳转
				});*/
			}else{ 													// 找回密码情况不再发用户行为日志
				_self.gotoPageByUrl(urlParams);
			}		
		}
	},

	gotoPageByUrl: function(urlParams){							// 根据Url跳转到不同页面
		var redirectUrl;
		if(urlParams && urlParams.redirectUrl) {
			var url = urlParams.redirectUrl;
			var decodeUrl = url.indexOf('http://') === 0 ? url : decodeURIComponent(url)
			console.log('redirectUrl: ', decodeUrl);
			window.location = decodeUrl;	
		}else {
			this.openProfilePage();								// 或我的账户页面
		}
	},

	/**
	 * 为页面链接添加Pingback统计
	 * 延迟打开页面，确保发出的pingback不会因为页面切换被取消发送
	 */
	setEvents: function() {
		// 为跳转link添加pingback统计:
		var self = this;
		$('.j-pb-click').on(tapType, function(e) {
			e.preventDefault();
			self.delayOpenPage($(this))
		});
	},

	openPageByName: function(pageName) {
		if(!pageName) return false;
		if(!/(^http:|.html)/.test(pageName)) {				// 如果不是http开头或者html结尾的
			pageName += '.html'								// 需要添加后缀.html
		}
		window.location = pageName;
	},

	openProfilePage: function() {
		this.openPageByName('profile');
	},

	showErrorMsg: function(res) {
		console.log('error code: ', res);
		// m如果是字符串，直接显示。
		// 如果是自定义错误码，显示
		// 否则显示服务器返回的错误文本
		var msg = (typeof res === 'string') ? res : this.getErrorMsg(res);
		((typeof res === 'object') && (res.errType === 'manual')) && (msg = msg + '。'); // 区分是接口返回的错误码还是人为启动错误码，人为启动的错误码文案提示会加一个句号
		return msg;
	},

	getErrorMsg : function (res) {
		return Config.errorTexts[res.code] || res.msg;
	},

	/**
	 * 把字段中的数字型字符串转换成数字
	 * @param  {[type]} vipinfo [description]
	 * @return {[type]}         [description]
	 */
	stringToInt : function(vipinfo) {
		console.log('vipinfo: ', vipinfo)
		if(!vipinfo) return vipinfo;
		var a = ['level', 'payType', 'status', 'surplus', 'type', 'vipType'];
		for(var l = a.length; l--;) {
			var ak = a[l];
			vipinfo[ak] = +vipinfo[ak];
		}
		console.log('format vipinfo: ', vipinfo);
		return vipinfo;
	},

	getTvVersion : function(curV){
		if(!curV) return false;
		var arrV = curV.toString().split('.');
		return (arrV[0]+'.'+arrV[1])-0;					// 获取当前版本
	},

	/**
	 * getUserTpye
	 * 
	 */
	getUserTpye : function(data){
		var qyinfo = data.qiyi_vip_info;
		var tvinfo = data.tv_vip_info;
		var userType = NO_VIP_MEMBER; // 默认不是会员

		if(!qyinfo && !tvinfo){ return userType; } // qyinfo,tvinfo不存在，肯定不是会员

		var qy_status = '';
		var qy_viptype = '';
		var qy_surplus = '';
		var tv_status = '';
		var tv_viptype = '';
		if(!!qyinfo){
			qy_status = qyinfo.status;
			qy_viptype = qyinfo.vipType;
			qy_surplus = qyinfo.surplus;
		}
		if(!!tvinfo){
			tv_status = tvinfo.status;
			tv_viptype = tvinfo.vipType;
		}

		// qiyi_vip_info存在，先做userType的判断
		if(!!qyinfo){
			if(qy_viptype == 0 && qy_surplus>0 && (qy_status==2 || qy_status==0)){ 
				userType = EXPIRE_MEMBER;				// 封停会员:tv端只关心白金类型的封停，黄金和白银的封停都不考虑，认为是非会员
			}else if((qy_viptype==1 && qy_surplus>0 && qy_status==1) || (qy_viptype==1 && qy_status==1 && qy_surplus=="")){ 
				userType = GOLD_VIP_MEMBER;				// 黄金会员
			}else if((qy_viptype==3 && qy_surplus>0 && qy_status==1) || (qy_viptype==3 && qy_status==1 && qy_surplus=="")){ 
				userType = SILVER_VIP_MEMBER;			// 白银会员
			}else if((qy_viptype==4 && qy_surplus>0 && qy_status==1) || (qy_viptype==4 && qy_status==1 && qy_surplus=="") ){ 
				userType = PLATINUM_VIP_MEMBER;			// 白金会员
			}else{
				userType = NO_VIP_MEMBER;				// 不是会员
			}
		}
		
		// tv_vip_info存在，再做userType是否是荔枝的判断
		if(!!tvinfo){
			if(tv_viptype == 5 && tv_status == 1 ){
				if(userType == PLATINUM_VIP_MEMBER){
					userType = TV_VIP_MEMBER;			// 荔枝白金	
				}else if(userType == SILVER_VIP_MEMBER){
					userType = SILVER_LITCHI_MEMBER;	// 荔枝白银
				}else if(userType == GOLD_VIP_MEMBER){
					userType = GOLD_LITCHI_MEMBER;		// 荔枝黄金
				}else{
					userType = LITCHI_VIP_MEMBER;		// 荔枝会员
				}
			}
		}

		if(!tvinfo && userType == EXPIRE_MEMBER){      // 不是荔枝会员且是封停状态的白金才是封停；荔枝会员暂时没有封停的状态
			userType = EXPIRE_MEMBER;	
		}


		console.log('userType: ' + userType);
		return userType;
	},

	

	isVip: function (userType, ver) {
		if(ver > tvVersionLine){ 
			if(	userType === PLATINUM_VIP_MEMBER || // 白金，荔枝白金，纯荔枝，荔枝黄金，荔枝白银是会员
				userType === LITCHI_VIP_MEMBER || 
				userType === TV_VIP_MEMBER || 
				userType === GOLD_LITCHI_MEMBER || 
				userType === SILVER_LITCHI_MEMBER 
				/*userType === EXPIRE_MEMBER*/){ 		// 封停
				return true;		
			} 
		}else{
			if(	userType === PLATINUM_VIP_MEMBER || // 白金和荔枝白金是会员
				userType === TV_VIP_MEMBER
				/*userType === EXPIRE_MEMBER*/){		// 封停
				return true;			
			} 
		}
		return false;
	},

	// 判断用户是封停会员
	isStopVip: function(userType){
		return (userType == EXPIRE_MEMBER);
	},

	/**
	 * 根据来源页显示不同的文案
	 * @param  {[type]} vipinfo [description]
	 * @return {[type]}         [description]
	 */
	showPageTipsBeforeFive: function(protype){
		var arr = [PB_BEHAVIOR_MODPWD, PB_BEHAVIOR_LOGIN, PB_BEHAVIOR_BIND, PB_BEHAVIOR_REGISTER, PB_BEHAVIOR_FINDPWD]; 
		var statusTxt = '';
		if($.inArray(protype, arr) != -1){
			 statusTxt = proText['protype' + protype];
		}
		return statusTxt;
	},

	/**
	 * 显示会员或非会员状态文案
	 * @param  {[type]} vipinfo [description]
	 * @return {[type]}         [description]
	 */
	showPageTipsAfterFive: function(tvinfo){
		var statusTxt = '暂时还不是会员';
		var day;
		if(!!tvinfo){
			day = this.getUnixDay(tvinfo.deadline.t);
			if(day > 10){
				statusTxt =  '您的会员到期日:' + tvinfo.deadline.date;
			}else if(day > 0 && day <=10){
				statusTxt =  '您的会员到期剩余:' + day + ' 天';
			}else{
				statusTxt =  '暂时还不是会员';
			}
		}
		return statusTxt;
	},

	getUnixDay: function (dateStr){
	    var timestamp_last = dateStr - +new Date();
	    var day = Math.ceil(timestamp_last/(3600000*24));
	    return day;
	},

	// 拼接跳转到H5收银台页面的url
	getVipUrl: function (curVersion, userType) {
		(curVersion > tvVersionLine) && (packagePid = '9ff1a15abb9b50b8');  // 大于5.4，用理智套餐的pid
		var u = 'http://serv.vip.ptqy.gitv.tv/order/h5-pay.action?pid='+ packagePid +'&platform=8126425670975517&fc=acf43fd4a349feb4&qy_fr=H5-VIP-0201';
		var frVersion = this.getFrVersionValue();
		console.log('frVersion: ' + frVersion);
		if(frVersion) {
			u += '&fr_version=' + this.getFrVersionValue(userType);
		}
		return u;
	},

	// 获取frVersion的值
	getFrVersionValue: function(userType) {
		var storage = Pingback.getUrlParamsStorage();
		console.log('h5_moble!~ storage');
		console.log(storage);
		if(!storage) return false;
		var s = 'enter_type=3&from=mobile_account&tvid=&aid=&c1=&qtcurl=mobile_account&block=mobile_account';
		s += '&version=' + storage.av;
		s += '&uuid=' + storage.ui;
		s += '&hw=' + storage.cv;
		s += '&mac_address=' + Pingback.getMacByDid(storage.device_id);
		s += '&wd=' + storage.wd;
		s += '&p2=' + storage.p2;
		s += '&ab=' + storage.ab_test;
		s += '&state=' + storage.state;
		s += '&hu=' + Pingback.getHuByUserType(userType);
		console.log('h5_moble!~ profile page s = ' + s);
		return encodeURIComponent(s);
	},

	

	/**
	 * 根据是否是会员返回UI
	 * 1)ui=0：未购买过荔枝VIP或未登录；
	 * 2)ui=1：已购买过荔枝VIP 
	 */
	getUi: function(bool) {
		return (bool ? 1 : 0); 
	},

	/**
	 * 根据用户信息获取用户是从来没有购买过奇异果vip还是购买过奇异果（过期或有效）
	 * 值是字符串类型，用于pingback的ui字段
	 * @param  {[type]} vipinfo [description]
	 * @return 0: 是新会员； 1：不是新会员
	 */
	hasVipInfo: function(data) {
		return (!!data.tv_vip_info)
	},

	/**
	 * 获取移动端配置图
	 * @return 数组   移动端配置图url的数组
	 */
	getImgsJson: function(backgroudJson){
		var arr = [];
		for(var i = 0; i < backgroudJson.length; i++){
			if(backgroudJson[i].name === 'mRightDefault' || backgroudJson[i].name === 'mRightSale'){
				arr.push(backgroudJson[i]);
			}
		}
		return arr;
	},

	/**
	 * 设置配置图
	 */
	setVipRightsImg: function(ui, backgroudJson){
		var imgArr = this.getImgsJson(backgroudJson);
		var imgJson = imgArr[(ui === 1 ? 1 : 0)];
		return [imgJson.url, imgJson.desc];
	},
	/**
	 * 注册：检查用户使用的手机号格式
	 * @param  {string} phone:手机号  required:是否必须是手机号
	 * @return {boolean}
	 */
	getCheckPhoneErrMsg: function(phone, ismustphone){
		if(!phone) {
			return "手机号不能为空";
		}
		if(!this.isCellphone(phone) && ismustphone) {
			return "请输入正确的手机号";
		}
		return '';
	},
	/**
	 * 注册：检查用户使用的手机号格式
	 * @param  {string} phone:手机号  required:是否必须是手机号
	 * @return {boolean}
	 */
	getCheckAccountErrMsg: function(value, format){
		if(!value) {
			if(format === 'phone'){
				return "手机号不能为空";
			}else if(format === 'email'){
				return "邮箱不能为空";
			}else{
				return "账号不能为空";
			}
		}
		if(!this.isCellphone(value) && (format==='phone')) {
			return "请输入正确的手机号";
		}else if(!this.isEmail(value) && (format==='email')){
			return "请输入正确的邮箱";
		}
		return '';
	},

	/**
	 * 注册：检查用户使用的手机号格式
	 * @param  {string} phone:手机号  required:是否必须是手机号
	 * @return {boolean}
	 */
	getCheckPwdErrMsg: function(pwd){
		if(!pwd) {
			return '密码不能为空';
		}
		if(!PASSWORD_RG.test(pwd)) {
			return '请输入8~20位字母、数字或字符，至少两种';
		}
		return '';
	},
	/**
	 * 注册：检查手机验证码
	 * @param  {string} value 手机验证码
	 * @return {boolean}      检查通过返回true
	 */
	checkPhonecode: function(phonecode) {
		if(!phonecode) {
			return "手机验证码不能为空";
		}
		if(!/^[0-9]{6}$/.test(phonecode)) {
			return "手机验证码应为6位数字";
		}
		return '';
	},

	/**
	 * 注册：检查用户使用的手机号格式
	 * @param  {string} value 手机号
	 * @return {boolean}
	 */
	checkCellphone: function(data, required) {
		var value = data['account'];
		if(this.isEmptyInput(value, '手机号', required)) return false;
		if(!this.isCellphone(value)) {
			return false;
		}
		return true;
	},

	/**
	 * 检查控件的值是否为空
	 * @param  {string}  value    控件的值
	 * @param  {string}  hints    控件名
	 * @return {Boolean}          [description]
	 */
	isEmptyInput: function(value, hints, required) {
		if(!value) {
			required && this.showErrorMsg( hints + '不能为空！');
			return true;
		}
		return false;
	},

	getEncryptPhone: function (u, i) {
		return u.substring(0, 3) + '****' + u.substring(i); // 设置用户账户信息
	},
									
	isCellphone: function(cellphone) {
		return PHONECALL_RG.test(cellphone);
	},

	isEmail:function(email){
		return EMAIL_RG.test(email);
	},

	/*注册页验证图文验证码函数*/
	checkPiccodeInregister: function(inputVal, required) {
		var arr = ['piccode', 'piccodeold', 'piccodenew'];
		var value;
		for(var i = 0; i < arr.length; i++){
			if(!!inputVal[arr[i]] || inputVal[arr[i]]===''){
				value = inputVal[arr[i]];
				break;
			}
		}
		if(this.isEmptyInput(value, '验证码', required)) return false;
		return true;
	},


	bindHashChange: function(callback){
		if(/iPhone\sOS.*QQ[^B]/.test(navigator.userAgent)) {
	        window.onpopstate = callback;
	      } else {
	        window.onhashchange = callback;
	      }
	},

	getBindType: function(userinfo){
		if(userinfo.uid < 600000000 && userinfo.uid > 10000 && !userinfo.phone){
			return 3;
		}else if(!userinfo.phone){
			return 1;
		}else{
			return 2;
		}
	},

	/**
	 * 设置绑定手机号按钮url的hash
	 */
	getBindHref: function(type){
		var hashArr = ['bindbyemail.html#bmemail', 'changephone.html#bpfirst', 'bind.html#bphone'];
		return hashArr[type-1];
	},

	/**
	 * 为页面链接添加Pingback统计
	 * 延迟打开页面fn
	 */
	delayOpenPage: function($el){
		var self = this;
		var pageName = $el.data('href');							// 页面跳转link
		var clickLink = $el.data('click');							// 用于pingback字段
		var clickBlock = $el.data('block');	
		var timerId = null;
		if(pageName) {
			if( self.codeTimerId !== null ) return false;          // 当codeTimerId存在时，不响应.j-pb-click下的任何点击操作
			timerId = setTimeout(function() {
				console.log(pageName + ' timeout!');
				self.openPageByName(pageName);						// 延迟打开
			}, TIMEOUT_GO);
		}
		clickLink && Pingback.click(clickLink, clickBlock, function() {
			clearTimeout(timerId);
			self.openPageByName(pageName);							// pingback 发送完成打开
		});
	},

	bcd: function(){
		
	},

	bcd: function(){
		
	},
	
}

module.exports = Rxports



































