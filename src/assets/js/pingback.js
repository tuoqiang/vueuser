
import Storage from 'assets/js/storage.js'

var logType = ['506261_20', '506261_21', '506261_5', '506261_0'];
var ua = navigator.userAgent;
var rootUrl = 'http://msg.ptqy.gitv.tv/tmpstats.gif?';
var WECHAT_RE = /MicroMessenger/i;
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

var Rxports = {
	initParams: null,

	init: function(currpage, pu, userType, isNewE) {
		var self = this;
		var session = null;
		self.currpage = currpage;
		/*var hu = self.hu(vip);				// 会员标识*/
		var hu = self.getHuByUserType(userType);
		
		if(typeof pu === 'object' && pu !== null) {
			session = pu;
			pu = '';
		}else {
			session = (self.getUrlParamsStorage() || {});		// 获取的会话信息

			
			// 更新storage
			if(!!pu && userType != undefined) {
				
				Storage.setSessionStorage(URL_PARAMS, $.extend(session, { pu: pu, hu:hu }));
				if(isNewE === 'getNewE'){
					session.e = Pingback.getEventId();
					Storage.setSessionStorage(URL_PARAMS, session);
				}
			}
		}
		self.initParams = {
			ua: self.ua,
			hwver: self.hwver(),
			iswechat: self.iswechat(),
			u: self.getDeviceId(),
			re: self.resolution(),
			s1: (session.qr || 'NA'),							// 页面来源
			tvver: (session.version || session.av || ''),	// 版本号
			tvmacid: (session.mac_address || self.getMacByDid(session.device_id) || self.getMacByDid(session.deviceid) || ''),		// 设备ID
			tvuuid: (session.uuid || session.ui || ''),		// UUID
			tventer_type: session.enter_type,				// TV购买页进入方式
			tvqtcurl: session.qtcurl,						// TV购买二维码所在页面 
			tvblock: session.block,							// TV购买类型
			state: session.state || '',						// fr_version.state 直播状态字段
			tvfrom: session.from,							// 购买页入口来源
			tvwindow_disable: session.wd,					// 是否禁用小窗口
			tvs2: session.s2,								// fr_version.s2
			tvqpid: session.aid,							// fr_version.tvid
			tvr: session.aid,	 							// fr_version.aid
			tvp2: session.p2,	 							// fr_version.p2
			tvhwver: session.hw || session.hwver,			// fr_version.hwver 购买页传hw；个人中心传hwver
			tvc1: session.c1,								// fr_version.c1
			e:session.e    									// 全局唯一事件id
		};

		self.initParams.tvwindow_disable = (session.qr == 'loginQR' ? undefined : self.initParams.tvwindow_disable);   // 从个人中心扫码获得参数中屏蔽掉wd，不传wd字段
		// 记录用户登录ID和会员标识
		self.initParams.pu = (session.pu || session.uid || pu || '');				// 如果undefined会被过滤掉
		if(session.hu == 0 || !!session.hu){
			self.initParams.hu = session.hu;
		}else{
			self.initParams.hu = hu;
		}
		
		if(session.qr === 'loginbuyQR'){ // 从购买页来的登录注册流程所有日志增加会员类型字段tvhu。
			self.initParams.tvhu = hu;
		}

		if(session.qr === 'loginQR' && (currpage === 'bind' || currpage === 'change' || currpage === 'pps')){ // 绑定手机号入口来源,目前只有从个人中心且是绑定流程时，取固定值'account'
			self.initParams.bindsrc = 'account';
		}

		if(self.currpage === 'trymid' || self.currpage === 'phone_act'){  
			self.initParams.s1 = session.block;
			self.initParams.bindsrc = 'vipact';
		}
		if(self.currpage === 'trymid'){  
			Storage.setCookie('F00002', self.initParams.u);  // 把移动设备deviceid种到F00002中
		}

		// isvipac可能取值0:没有权益;  1:有权益未激活。
		if(!!session.isvipact || session.isvipact == 0){ // 如果存在isvipact，则肯定来自F项目（含激活流程）的二维码页
			self.initParams.tvisvipact = session.isvipact;
		}
	},

	// 点击:
	click: function(rseat, block, callback) {
		// 同步发送点击日志
		var obj = {};
		!!block && (obj.block = block);
		this._send($.extend({ type: '506261_20', rpage: this.currpage, block: this.currpage, rseat: rseat }, obj), callback);
	},

	// 展示:
	pageLoaded: function(block, isNewVip, callback) {
		var obj = {};
		!!block && (obj.block = block); 	// 如果传递了block的值，则替换pingback.init时设置的block的值
		(!!isNewVip || isNewVip === 0) && (obj.ui = isNewVip); 	
		this._send($.extend({ type: '506261_21', qtcurl: this.currpage, block: this.currpage }, obj), callback);
	},

	// 用户行为:
	userBehavior: function(a, callback) {
		console.log('h5_moble userBehavior come in');
		console.log('h5_moble userBehavior a =' + a);
		var pu = (this.initParams.pu || Storage.getCookie('P00003') || '');
		this._send({ type: '506261_5', a: a, pu: pu }, callback);
	},

	// 错误日志:
	errLogger: function(code, block) {
		code && (typeof code === 'object') && (code = code.code); 
		this._send({ type: '506261_0', ec: this.currpage, block: block, pfec: code });
	},

	/**
	 * 发送统计数据
	 * @param  {[type]} params [description]
	 * @param  {[type]} type   [description]
	 * @return {[type]}        [description]
	 */
	_send: function(params, callback) {
		// 合并参数对象:
		params = $.extend({ rn: this._randomString() }, this.initParams, params);
		console.log('pingback: ', params);
		// 发送数据参数:
		var url = rootUrl + this._formatParams(params);
		console.log('H5-Pingback:' + url);
		if(params.a == 7){
			console.log('H5-Pingback: login url is:' + url);
		}
		var Img = new Image();
		Img.onload = Img.onerror = function() {
			callback && callback.call(null);
		}
		Img.src = url;	
	},

	_formatParams: function(params) {
		var a = [];
		for(var k in params) {
			// 如果value不存在, 设置其值为空
			var value = params[k];
			a[a.length] = k + '=' + (value === undefined ? '' : value);
		}
		return a.join('&');
	},

	/**
	 * 生成指定长度的随机字符串(最多16位)
	 * @param  {int} len 字符串长度，默认12
	 * @return {string}     随机字符串
	 */
	_randomString: function(len) {
		len || (len = 12);
		return Math.random().toString(36).slice(2, len + 2);
	},

	// 生成32位事件id-e
	getEventId : function() {
		return this.randomWord(false, 32);
	},

	// 硬件型号: 区分iphone/iPad/Android
	hwver: function() {
		var devices = ['unknown', 'iPhone', 'iPad', 'Android'];
		for(var li = devices.length; li-- > 1; ) {
			var re = new RegExp(devices[li], 'i');
			if ( re.test(this.ua) ) return devices[li];
		}
		return devices[0];
	},

	/**
	 * 判断是否是微信浏览器打开
	 * @return {int} 1或0
	 */
	iswechat: function() {
		return +(WECHAT_RE.test(this.ua));
	},

	// 获取手机分辨率
	resolution: function() {
		var dpr = window.devicePixelRatio
			, w = screen.width || window.innerWidth
			, h = screen.height || window.innerHeight
		;
		return (w * dpr | 0) + 'x' + (h * dpr | 0);
	},

	/**
	 * 获取设备id
	 * 随机字符串 + 当前时间
	 * localStorage永久存储
	 */
	getDeviceId: function() {
		var GUID = window.localStorage.getItem('GUID');
		if(!GUID) {
			GUID = this._randomString() + (+ new Date());
			Storage.isLocalStorageSupported() && Storage.setStorage('GUID', GUID);
		}
		return GUID;
	},
	// 会员状态标识:
	hu: function(vi) {
		if(!vi) return '';			// 未登录，取值为空
		if(vi === -1) return vi;	// 用户不是会员
		if(vi.vipType > 0 && vi.surplus > 0 && (vi.status === 2 || vi.status === 0)) return 0;	// 爱奇艺封停会员
		if( vi.status === 1 && (vi.surplus > 0 || vi.surplus === '')) {
			if(vi.vipType === 4) return 4;				// 白金会员
			if(vi.vipType === 1) return 3;				// 黄金会员
			if(vi.vipType === 3) return 2;				// 白银会员
		}else {
			return -1;				// 普通用户
		}
	},

	/**
	 * getHuByUserType
	 * 
	 */
	getHuByUserType: function(userType) {
		/*, HU_NO_VIP_MEMBER		= -1		// 不是会员
		, HU_EXPIRE_MEMBER 			= 0			// 封停会员
		, HU_SILVER_VIP_MEMBER		= 2			// 白银
		, HU_GOLD_VIP_MEMBER		= 3			// 黄金
		, HU_PLATINUM_VIP_MEMBER	= 4			// 白金
		, HU_PLITCHI_MEMBER			= 5			// 荔枝
		, HU_PLATINUM_LITCHI_MEMBER	= '5,4'		// 荔枝白金
		, HU_GOLD_LITCHI_MEMBER		= '5,3'		// 荔枝黄金
		, HU_SILVER_LITCHI_MEMBER	= '5,2'		// 荔枝白银*/

		/*, NO_VIP_MEMBER 			= 0			// 不是会员
		, EXPIRE_MEMBER 			= 1 		// 封停会员
		, VIP_MEMBER 				= 2 		// 会员，购买页没有该类型会员
		, GOLD_VIP_MEMBER 			= 3 		// 黄金
		, SILVER_VIP_MEMBER 		= 4 		// 白银
		, PLATINUM_VIP_MEMBER 		= 5 		// 白金
		, PHONE_MONTH_VIP_MEMBER 	= 6 		// 包月，购买页没有该类型会员
		, LITCHI_VIP_MEMBER 		= 7 		// 荔枝
		, TV_VIP_MEMBER 			= 8 		// 荔枝白金
		, GOLD_LITCHI_MEMBER		= 9 		// 荔枝黄金
		, SILVER_LITCHI_MEMBER		= 10 		// 荔枝白银*/

		var huArr = [
			HU_NO_VIP_MEMBER, 
			HU_EXPIRE_MEMBER, 
			'', 
			HU_GOLD_VIP_MEMBER, 
			HU_SILVER_VIP_MEMBER, 
			HU_PLATINUM_VIP_MEMBER,
			'',
			HU_PLITCHI_MEMBER,
			HU_PLATINUM_LITCHI_MEMBER,
			HU_GOLD_LITCHI_MEMBER,
			HU_SILVER_LITCHI_MEMBER
		];
		if(huArr[userType] == 0 || !!huArr[userType]){
			return huArr[userType];
		}else{
			return '';
		}
		
	},

	/**
	 * 获取UrlParams storage值
	 * @return {[type]} [description]
	 */
	getUrlParamsStorage: function(){
		var storage = Storage.getSessionStorage(this.URL_PARAMS);
		console.log('UrlParams localStorage: ', storage);
		return storage;
	},

	getMacByDid : function(did) { 															// 5.0之前did一个下划线，5.0之后did两个下划线，兼容处理
		console.log(did);
		if(!did) return null;
		if(((did.split('_')).length-1) > 1) return did.substring(0, did.lastIndexOf('_'));			// 如果包含两个下划线则取前面
		return did; 																				// 否则直接返回
	},

	/*
	 * randomWord 产生任意长度随机字母数字组合
	 * randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
	 */
	randomWord: function(randomFlag, min, max){
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

	
}

module.exports = Rxports