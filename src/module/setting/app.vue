<template>
  	<topbar text="安全中心"></topbar>
    <error-msg :errmsg='errmsg' v-if="errmsg"></error-msg>
    <div class="btn-w-out btn-w-mt btn-w-bortop">
      <button-common-a  btntext="修改密码" btnclass="btn-mdfpwd" :datahref="modpwdhref"></button-common-a>
    </div>
    <div class="btn-w-out btn-w-borbot">
      <button-common-a @click="gotoBind" :btntext="bind.btnname" btnclass="btn-mdfpwd" :datahref="bind.datahref"></button-common-a>
    </div >
</template>


<script>

import Lib from 'assets/js/lib.js'
import Utils from 'assets/js/utils.js'
import Config from 'assets/js/config.js'
import Server from 'assets/js/server.js'
import Storage from 'assets/js/storage.js'
import Pingback from 'assets/js/pingback.js'
import ButtonCommonA from 'components/button-common-a'
import ErrorMsg from 'components/error-msg'
import Topbar from 'components/topbar'

export default {
  data() {
      return {
          errmsg:'', // 错误文案
          modpwdhref:'', // 修改密码链接
          bind: {        // 绑定业务
            btnname: '',
            type:1,
            datahref:''
          },
          email:'', // 已绑定邮箱
          phone:'', // 已绑定手机号
      }
  },
  components: {
    	ButtonCommonA,
    	Topbar,
      ErrorMsg,
  },
  created: function () {
      console.log('created run');
      var self = this;
      var authCookie = Utils.getAuthCookie();
      !authCookie && Utils.openPageByName('login');
      var urlParams = Utils.getParamsFromPersionQrcode();
      Server.getUserInfo(self, { authcookie: authCookie, fields: 'userinfo'}).then(function(res){
        console.log('Server.getUserInfo request success');
        var userinfo = res.userinfo;
        var userType = Utils.getUserTpye(res); 
        if(urlParams) {                                         
          Utils.setSessionStorage(URL_PARAMS, urlParams);
          Storage.setStorage('versionApk', urlParams.av); //  把apk版本号记录下来，为修改忘记密码第三步用
        }
        self.email = userinfo.email;
        self.phone = userinfo.phone;
        self.modpwdhref = 'modifypwd.html?u=' + (userinfo.phone || userinfo.user_name);
        self.bind.type = Utils.getBindType(userinfo);
        self.bind.btnname = (self.bind.type != 2 ? '绑定手机号' : '变更手机号');
        self.bind.datahref = Utils.getBindHref(self.bind.type);
      },function(res){
          console.log('Server.getUserInfo request fail');
          self.errmsg = Utils.showErrorMsg(res);   
      });
  },
  ready: function(){
  	  console.log('ready run');
      Utils.setEvents();
  },
  methods: {
      gotoBind: function(){
          console.log('h5_moble! gotoBind() run');
          var arr = [this.email, this.phone]; // 在绑定页需要当前邮箱(手机号)，存储到本地
          localStorage.setItem('h5_bind_by_email', arr[this.bind.type-1]);        
      },
  },
}
</script>