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
var WECHAT_RE = /MicroMessenger/i;
var CONFIGURL = 'http://static.ptqy.gitv.tv/tv/common/utils/config.js';;
var tapType = ('ontouchend' in window) ? 'touchend' : 'click';			// 确定用户单击操作时的类型
var tvVersionLine = 5.3; 		// 荔枝套餐和白金套餐分界版本

// hu
var HU_NO_VIP_MEMBER			= -1		// 不是会员
var HU_EXPIRE_MEMBER 			= 0			// 封停会员
var HU_SILVER_VIP_MEMBER		= 2			// 白银
var HU_GOLD_VIP_MEMBER		= 3			// 黄金
var HU_PLATINUM_VIP_MEMBER	= 4			// 白金
var HU_PLITCHI_MEMBER			= 5			// 荔枝
var HU_PLATINUM_LITCHI_MEMBER	= '5,4'		// 荔枝白金
var HU_GOLD_LITCHI_MEMBER		= '5,3'		// 荔枝黄金
var HU_SILVER_LITCHI_MEMBER	= '5,2'		// 荔枝白银

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
	URL_PARAMS: 'urlParams',
	BEHAVIOR_LOGIN		: 1 ,			// 登录
	BEHAVIOR_REGISTER 	: 2	,	// 注册
	BEHAVIOR_FINDPWD	: 3	,	// 找回密码
	BEHAVIOR_MODPWD		: 4	,		// 修改密码
	BEHAVIOR_BIND		: 5	,	// 绑定手机号
	tokenError: {
		login: '暂未登录成功<br>请重新扫码登录',
		register: '注册已完成<br>请重新扫码登录',
		resetpwd: '已重置密码<br>请重新扫码登录'
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
		var querystring = location.search.substring(1);
		console.log('h5_moble!  querystring' + querystring);
		return Rxports.getUrlParamsToObj(querystring);
	},

	// 分解url的参数成对象
	// 由于url参数规则不一致，做不同处理
	getUrlParamsToObj: function(querystring){
		var res = null;
		if(!querystring) return res;
		if(querystring.indexOf('redirectUrl') === -1 ) {				// 不存在重定向url
			res = Rxports.getParamsObjByUrl(querystring);
		}else {															// 存在重定向url
			res = Rxports.getParamsObjByUrlAndRedirectUrl(querystring);
		}
		res.qr = Rxports.getS1(querystring);
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
		var o = Rxports.getParamsObjByStrToObj(s);
		var extra = o.extra;
		o.extra = undefined;
		// if(!extra) return o;
		// 如果不存在extra字段返回空对象
		var res = !extra ? {} : Rxports.stringToObj(extra, ';', ':');
		//	个人中心二维码扫码打开登录页时不存在referer
		//	来源页面目前用到的有：chat.html
		!!document.referrer && (res.redirectUrl = document.referrer); 						
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
		var paramsArr = Rxports.splitUrlByRedirectUrl(s); 										// 存放redirectUrl和其他剩余参数（字符串形式）的数组
		var otherParamObj = Rxports.getParamsObjByStrToObj(paramsArr[1]);
		!!otherParamObj &&　(res = otherParamObj);										// 可能不存在，为'',除了redirUrl参数外的其他参数对象,有可能为空
		var url = res.redirectUrl = paramsArr[0]; 										// redirectUrl值
		var o = Rxports.getParamsObjByStrToObj(url.substring(url.indexOf('?') + 1));
		!!o && (fr = Rxports.getParamsObjByStrToObj(decodeURIComponent(o.fr_version)));

		return $.extend( o, fr, res);			
	},

	/**
	 * 目前调用购买页的入口
	 * 1 个人中心扫码登录；2 购买页二维码扫码登录；3；客服页；4 boss支付页；5 vip试用页；6 直接输入login.html
	 */
	getS1: function(s){
		var o = Rxports.getParamsObjByStrToObj(s);
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
		return [Rxports.getDecodeUrl(redirectUrlStr), otherParamStr]; 		// [redirectUrl, 包含剩余参数的字符串]
	},

	getDecodeUrl: function(url){
		return url.indexOf('http://') === 0 ? url : decodeURIComponent(url)
	},

	/**
	 * 把url参数字符串转换成对象
	 * @param 
	 * @return
	 */
	getUrlParamsToObj: function(querystring){
		return Rxports.stringToObj(querystring, '&', '=');
	},

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

	/*
	 * randomWord 产生任意长度随机字母数字组合
	 * randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
	 */
	randomWord: function(){
		var str = '',
    	pos = '',
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
	    // 随机产生
	    if(randomFlag){
	        range = Math.round(Math.random() * (max-min)) + min;
	    }
	    for(var i=0; i<range; i++){
	        pos = Math.round(Math.random() * (arr.length-1));
	        str += arr[pos];
	    }
	    return str;
	},

	getAuthCookie: function(){
		var cookie = this.getCookie('P00001');
		var urlParams = Utils.stringToObj(location.search.substring(1), '&', '=');
		if(!!urlParams && !!urlParams.cok) {
			cookie = urlParams.cok;
			this.setCookie('P00001', urlParams.cok); // 从url传过来的cookie值保存到本地，跨软件扫码会用到，否则第二个页面获取不到cookie值
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
		
			var urlParams = self.urlParams;
			var scene = this.getScene(behavior);
			var block = this.getBlock(behavior);
			var pbBehavior = this.getSceneVal(behavior);
			var timerId = null;
			var cookie = Storage.getCookie('P00001');
			Storage.setSessionStorage('proType', pbBehavior);						// 设置个人中心10s文案类别
			urlParams || (urlParams = Storage.getUrlParamsStorage());				// 获取参数
			if(urlParams && urlParams.token){
				return new Promise(function(resolve, reject){
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
				});
			}else{
				sendUserBehaviorPb();
			}
		
		
		// 发送登录成功日志
		function sendUserBehaviorPb(){
			if(scene != self.SCENE_FINDPWD){ 								// SCENE_FINDPWD 找回密码情况已经发送过
				timerId = setTimeout(function() {							// 最迟TIMEOUT_GO 页面跳转
					Utils.gotoPageByUrl(urlParams);
				}, TIMEOUT_GO);

				Pingback.userBehavior(pbBehavior, function() {
					clearTimeout(timerId);							// 如果pingback发送成功，取消定时器
					Utils.gotoPageByUrl(urlParams);							// 页面立即跳转
				});
			}else{ 													// 找回密码情况不再发用户行为日志
				Utils.gotoPageByUrl(urlParams);
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
			self.openProfilePage();								// 或我的账户页面
		}
	},

	openPageByName: function(pageName) {
		if(!pageName) return false;
		if(!/(^http:|.html)/.test(pageName)) {				// 如果不是http开头或者html结尾的
			pageName += '.html'								// 需要添加后缀.html
		}
		window.location = pageName;
	},

	openProfilePage: function() {
		Utils.openPageByName('profile');
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

	bcd: function(){
		
	},

	bcd: function(){
		
	},

	bcd: function(){
		
	},

	bcd: function(){
		
	},
	
}
	
module.exports = Rxports



































