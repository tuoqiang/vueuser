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
	        	function (xhr, errorType, error) {
					console.log('Request Error: ', errorType, error);
					reject({
						code: errorType,
						msg: error
					});
		        }
	        );
        });	
	},

	userLogin: function(currVue, opts){
		return this.fetchData('apis/reglogin/login.action', currVue, opts);
	},

	confirmTokenLogin: function(currVue, opts){
		return this.fetchData('apis/qrcode/token_login_confirm.action', currVue, opts);
	}
	
}
	
module.exports = Rxports