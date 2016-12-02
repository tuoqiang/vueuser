<template>

</template>


<script>

import Lib from 'assets/js/lib.js'
import Utils from 'assets/js/utils.js'
import Config from 'assets/js/config.js'
import Server from 'assets/js/server.js'
import Storage from 'assets/js/storage.js'
import Pingback from 'assets/js/pingback.js'

export default {
  ready: function(){
  	  console.log('ready run');
      var self = this;
      var timerId = null;
      var trial7dayUrl = 'http://www.ptqy.gitv.tv/common/trial7day.html';
      var userinfo;
      var urlParams = this.getUrlParams();
      urlParams.from = decodeURI(urlParams.from);
      var frVersionParams = $.extend({},urlParams);
      var cookie = urlParams.P00001;
      var hu = urlParams.hu;
      var frVersion = getFrVersion(frVersionParams);
      Storage.setCookie('F00001', urlParams.deviceid);  // 把deviceid种到F00001中

      var setTimeoutPageGo = function(){
        var uid = (!userinfo ? '' : userinfo.uid)
        Pingback.init('trymid', $.extend(urlParams, {'uid': uid, 'hu': hu}));
        timerId = setTimeout(function() {             // 最迟TIMEOUT_GO 页面跳转
          gotoVipActivePage(urlParams);
        }, TIMEOUT_GO);

        Pingback.pageLoaded('','', function() {
          clearTimeout(timerId);              // 如果pingback发送成功，取消定时器
          gotoVipActivePage(urlParams);             // 页面立即跳转
        });
      }

      if(cookie){
        Storage.setSessionStorage(URL_PARAMS, urlParams);   // 已登录状态下，把参数本地存储，用于绑定页PB
        Storage.setCookie('P00001', cookie);          // 必须手动种p01,p03
        Server.getUserInfo(self, { authcookie: authCookie, fields: 'userinfo'}).then(function(res){
          console.log('Server.getUserInfo request success');
          userinfo = res.userinfo;
          Storage.setCookie('P00003', userinfo.uid);
          setTimeoutPageGo();
        },function(res){
            console.log('Server.getUserInfo request fail');
            Pingback.errLogger(e.code, 'trymid');
            setTimeoutPageGo();
        });
      }else{
        Utils.setCookie('P00001', '')
        setTimeoutPageGo();
      }
  },
  methods: {
      getUrlParams() {
        var res = null;
        var querystring = location.search.substring(1);
        console.log('h5_moble!  querystring' + querystring);
        if(!querystring) return res;
        res = Utils.stringToObj(querystring, '&', '=');
        return res;
      },
      gotoVipActivePage(urlParams){
        var location = trial7dayUrl + '?token=' + urlParams.token + '&fr_version=' +  frVersion;
        console.log(location);
        window.location = location;
      },
      getFrVersion(){
        frVersionParams.mac_address = 'tv_' + frVersionParams.deviceid.substring(3, frVersionParams.deviceid.lastIndexOf('_'));
        frVersionParams.deviceid = undefined;
        frVersionParams.token = undefined;
        frVersionParams.uid = undefined;
        frVersionParams.P00001 = undefined;
          return encodeURIComponent(Utils.stringify(frVersionParams));
      }
  },
}
</script>