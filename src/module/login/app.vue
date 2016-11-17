<template>
  	<topbar text="登录">登录</topbar>
    <error-msg v-bind:errmsg='errmsg' v-show="errmsg"></error-msg>
  	<login-tips text="登录后可一键成为VIP会员" v-show="tipsmsg && !errmsg"></login-tips>
  	<form class="form-container contianer_ht1" action="#" autocomplete="on" >
    		<form-account iptplacehold="手机号或邮箱" labelname="账号：" :localaccount="user.account"></form-account>
    		<form-loginpwd :needpiccode="needpiccode" ></form-loginpwd>
    		<form-piccode :needpiccode="needpiccode" ></form-piccode>
    		<button-common @click="loginAction" btnclass="btn-primary form_btnpos02" btntext="登陆" dataclick="login"></button-common>	
    		<button-common datahref="register.html#rphone" btnclass="formcommon-sty form_btnpos01" btntext="立即注册" dataclick="signup" ></button-common>	
  	</form>
    <toast  content="登录不上？试试找回密码吧"
            comformbtntxt="去试试"
            cancelbtntxt="稍后再说"
            v-show="pwdErrorCount > 2">   
    </toast>
    <error-page :errorpage="errorpage" v-show="errorpage"></error-page>
</template>

<script>

import Lib from 'assets/js/lib.js'
import Utils from 'assets/js/utils.js'
import Config from 'assets/js/config.js'
import Server from 'assets/js/server.js'
import Storage from 'assets/js/storage.js'
import Pingback from 'assets/js/pingback.js'
import ButtonCommon from 'components/button-common'
import ErrorMsg from 'components/error-msg'
import Topbar from 'components/topbar'
import LoginTips from 'components/login-tips'
import FormAccount from 'components/form-account'
import FormLoginpwd from 'components/form-loginpwd'
import FormPiccode from 'components/form-piccode'
import Toast from 'components/toast'
import ErrorPage from 'components/error-page'

export default {
  data() {
      return {     
          user:{                    // 账号信息
              account: '',
              pwd: '',
              piccode: ''
          },
          urlParams: '',           // 安卓透传字段
        	errmsg: '',              // 错误文案
          tipsmsg: false,          // 从购买页扫码而来时的引导文案
          resneedpiccode: false,   // res.code='P00107'接口返回需要piccode错误码
          needpiccode: false,      // 需要piccode标志位
          submitCount: 0,         // 服务器返回错误次数
          pwdErrorCount: 0,       // 密码错误次数
          errorpage:'',            // 登录失败页面文案
          accounterrmsg:'',          // 登录失败页面文案
          pwderrmsg:'',              // 登录失败页面文案
          piccodeerrmsg:'',            // 登录失败页面文案
      }
  },
  components: {
    	ButtonCommon,
    	Topbar,
    	LoginTips,
    	FormAccount,
    	FormLoginpwd,
    	FormPiccode,
      ErrorMsg,
      Toast,
      ErrorPage
  },
  events: {
      'child-account-check': function (errormsg) {
          this.accounterrmsg = errormsg;
      },
      'child-pwd-check': function (errormsg) {
          this.pwderrmsg = errormsg;
      },
      'child-piccode-check': function (errormsg) {
          this.piccodeerrmsg = errormsg;
      },
      'child-account': function (account) {
          this.user.account = account;
      },
      'child-pwd': function (pwd) {
          this.user.pwd = pwd;
      },
      'child-piccode': function (piccode) {
          this.user.piccode = piccode;
      }
  },
  created: function () {
      console.log('created run')
      var urlParams = this.urlParams = Utils.getUrlParams();
      console.log(urlParams);
      if(urlParams) {																					
      		Storage.setSessionStorage(Utils.URL_PARAMS, urlParams);
      		Storage.setStorage('versionApk', urlParams.av);             // 把apk版本号记录下来，为改密，找密第三步用
      		(urlParams.qr == 'loginbuyQR') && (this.tipsmsg = true);    // 购买->登录->H5收银台的路径。登录页面显示引导文案
    	}
  },
  ready: function(){
  	  console.log('ready run')
      var localaccount = localStorage.getItem('h5_tv_account'); // 读取本地储存中账号信息
      if(!!localaccount){
        this.user.account = decodeURIComponent(localaccount);
      }
      Utils.setEvents();
      Pingback.init('login', this.urlParams);
      Pingback.pageLoaded();
  },
  methods: {
      //登陆操作
      loginAction(){
          var self = this;
          self.$broadcast("getIptVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          if(self.accounterrmsg || self.pwderrmsg || self.piccodeerrmsg){  // 前端校验
            self.errmsg = (self.accounterrmsg || self.pwderrmsg || self.piccodeerrmsg);
            return false;
          } 
          var data = {
              email: this.user.account,
              passwd: Utils.geta(this.user.pwd),
              piccode: this.user.piccode,
              request_id: Math.random().toString(36).slice(2, 14)
          };
          Server.userLogin(this, data).then(function (res) {
              console.log('Server.userLogin request success:'+ res);
              localStorage.setItem('h5_tv_account', encodeURIComponent(self.user.account));         // 把当前登录成功的帐号保存到本地，下次打开登录页时读取显示
              Utils.confirmTokenLogin(self,  Utils.BEHAVIOR_LOGIN).then(function(suc){}, function(fail){   
                self.errorpage = Utils.tokenError[Utils.getScene(Utils.BEHAVIOR_LOGIN)]// 如果存在redirectUrl，则token失效继续跳转走后面的逻辑                              
              });
          }, function (res) {
              console.log('Server.userLogin request fail:' + res);
              self.errmsg = Utils.showErrorMsg(res);      
              self.resneedpiccode = (res.code === 'P00107');   // 如果服务器返回code为P00107，显示图片验证码控件
              var errneedpiccode = (++self.submitCount >= 2)   // 如果服务器返回错误3次以上，显示图片验证码控件
              if(self.resneedpiccode || errneedpiccode) {
                 self.needpiccode = true; 
              }
              self.needpiccode && self.$broadcast("updatePiccode");
              (res.code === 'P00117') && (++self.pwdErrorCount >= 2); // 密码错误三次以上显示找回密码弹框
              Pingback.errLogger(res.code, 'login');
          });
      },
  }  
}
</script>





