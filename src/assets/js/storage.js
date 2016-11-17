var Rxports = {
	
	// getter setter cookie
	getCookie: function(c_name){
		var cookie = document.cookie;
		// 先查询cookie是否为空，为空就return ""
		if ( cookie.length > 0 ){　　
			var c_start = cookie.indexOf(c_name + "=")　　			// 检查这个cookie是否存在，不存在就为 -1　　
			if (c_start !== -1){
				c_start= c_start + c_name.length + 1;				// 获取到了cookie值的开始位置
				var c_end = cookie.indexOf(";", c_start)　　		// 得到值的结束位置
				if (c_end === -1) c_end = cookie.length;　　
				return unescape(cookie.substring(c_start,c_end))　　// 此处使用了unescape解码
		　　}
		}
		return ""
	},

	setCookie: function(){
		document.cookie = n + '=' + escape(v) + ';path=/;domain=ptqy.gitv.tv';
	},
	
    // 修改密码种token到p00014
	getRstPwdToken: function(){
		return this.getCookie('P00014');
	},

	// 通过变更手机号种token到p00012
	getChangephoneToken: function(){
		return this.getCookie('P00012');
	},

	// 通过邮箱绑定手机号种token到p00023
	getBindByEmailToken: function(){
		return this.getCookie('P00023');
	},

	// getter setter Storage
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

	getSessionStorage: function(key){
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
}
	
module.exports = Rxports



































