import Pingback from 'assets/js/pingback';
import Config from 'assets/js/config';

var Rxports = {
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
		!!referer && (res.redirectUrl = referer); 						
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

	/**
	 * session进行数据存储
	 * 当用户关闭浏览器后，数据将被删除
	 */
	setSessionStorage: function(key, value){
		if(!Rxports.isSessionStorageSupported()) return false;
		if(typeof value === 'object') {
			value = JSON.stringify(value);
		}
		sessionStorage.setItem(key, value);
	},

	getSessionStorage: function(){
		return  JSON.parse(sessionStorage.getItem(key));
	},

	getSessionStorageStr: function(key){
		return  sessionStorage.getItem(key);
	},

	isSessionStorageSupported: function(){
		var testKey = 'test',
        storage = window.sessionStorage;
	    try {
	        storage.setItem(testKey, 'testValue');
	        storage.removeItem(testKey);
	        return true;
	    } catch (error) {
	    	console.log('Your phone not support sessionStorage!!');
	        return false;
	    }
	},

	setStorage: function(k, v){
		if(!Rxports.isLocalStorageSupported()) return false;
		if(typeof v === 'object') v = JSON.stringify(v);
		return localStorage.setItem(k, v);
	},

	getStorage: function(){
		return JSON.parse(localStorage.getItem(key));
	},

	/**
	 * 获取UrlParams storage值
	 * @return {[type]} [description]
	 */
	getUrlParamsStorage: function(){
		var storage = this.getSessionStorage(Config.URL_PARAMS);
		console.log('UrlParams localStorage: ', storage);
		return storage;
	},

	isLocalStorageSupported: function(){
		var testKey = 'test',
        storage = window.localStorage;
	    try {
	        storage.setItem(testKey, 'testValue');
	        storage.removeItem(testKey);
	        return true;
	    } catch (error) {
	    	console.log('Your phone not support localStorage!!');
	        return false;
	    }
	},

	bcd: function(){
		
	},

	bcd: function(){
		
	},

	bcd: function(){
		
	},

	bcd: function(){
		
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



































