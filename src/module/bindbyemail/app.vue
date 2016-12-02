<template>
  	<topbar text="绑定手机号"></topbar>
    <error-msg 
        :errmsg='errmsg' 
        v-if="errmsg">
    </error-msg>
  	<form class="container form-container" action="#" autocomplete="off" id="j-form" style="margin-top:0.25rem;">
      <!-- 通过邮箱绑定手机号第一步 -->
      <div  v-show="hash == 'bmemail'" class="hgt2">
        <process-step 
              firstttext="邮箱地址" 
              processclass="pwd-title-step2">
        </process-step>
        <email-counter 
              :localaccount="user.email" 
              dataclick="again" 
              datablock="mail">
        </email-counter>
        <button-common  
              btnclass="btn-primary form_btnpos01" 
              btntext="立即进入邮箱" 
              :datahref="gointoemailurl" 
              dataclick="openmail" 
              datablock="mail">
        </button-common>  
      </div>
      <!-- 通过邮箱绑定手机号第二步 -->
      <div v-show="hash == 'bmphone'" class="hgt2">
        <process-step 
              firstttext="手机号" 
              processclass="pwd-title-step2">
        </process-step>
        <form-account 
              iptplaceholder="请输入手机号" 
              labelname="手机号：" >
        </form-account>
        <form-piccode 
              :needpiccode="true" 
              datapage="bindbyemail" 
              data-block="bind">
        </form-piccode>
        <button-common 
              @click="getPhoneCode" 
              btnclass="btn-primary form_btnpos01" 
              btntext="发送验证信息" 
              dataclick="msg" 
              datablock="bind">
        </button-common>  
      </div>
      <!-- 通过邮箱绑定手机号第三步 -->
      <div v-if="hash == 'bmcode'" class="hgt2">
        <process-step 
              firstttext="手机号" 
              processclass="pwd-title-step3">
        </process-step>
        <phonecode 
              :phone="user.account" 
              regethref="bindbyemail.html#bmphone" 
              phonetxtclass="form-phonetxt2" 
              iptclass="form-group-mt03">
        </phonecode>
        <button-common 
              @click="verifyPhoneCode" 
              btnclass="btn-primary form_btnpos01" 
              btntext="立即验证" 
              dataclick="done" 
              datablock="msgcode">
        </button-common>  
      </div>
    </form>
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
import ProcessStep from 'components/process-step'
import FormAccount from 'components/form-account'
import FormPiccode from 'components/form-piccode'
import Phonecode from 'components/phonecode'
import EmailCounter from 'components/email-counter'

export default {
  data() {
      return {     
          user:{                    // 账号信息
              email:'',
              account: '',
              piccode: '',
              phonecode:'',
          },
          errMsg:{
              accounterrmsg:'',          // 账号错误文案
              piccodeerrmsg:'',            // 图文验证码错误文案
              phonecodeerrmsg:'',            // 6位短信验证码错误文案
          },
          hash:'',                 // 当前hash值
        	errmsg: '',              // 错误文案
          gointoemailurl:''          // 立即进入邮箱链接
      }
  },
  components: {
    	ButtonCommon,
    	Topbar,
    	FormAccount,
    	FormPiccode,
      ErrorMsg,
      Phonecode,
      ProcessStep,
      EmailCounter,
  },
  events: {
      'child-account-check': function (errormsg) {
          this.errMsg.accounterrmsg = errormsg;
      },
      'child-piccode-check': function (errormsg) {
          this.errMsg.piccodeerrmsg = errormsg;
      },
      'child-phonecode-check': function (errormsg) {
          this.errMsg.phonecodeerrmsg = errormsg;
      },
      'child-account': function (account) {
          this.user.account = account;
      },
      'child-piccode': function (piccode) {
          this.user.piccode = piccode;
      },
      'child-phonecode': function(phonecode){
          this.user.phonecode = phonecode;
      },
      'send-email-again': function(){ // 重新发送验证邮件
          this.sendEmailCheck();
      },
  },
  created: function () {
    Utils.setPageHash(this, 'bindbyemail', location.hash);
  },
  ready: function(){
    var self = this;
    var hashChangeCallback = function(){
        console.log('h5_moble! onhashchange come in');
        Utils.setPageHash(self, 'bindbyemail', location.hash);
        Utils.setHashChangeCallback(self, 'bindbyemail', location.hash);
    }
    self.user.email = localStorage.getItem('h5_bind_by_email');
    self.authcookie  = Utils.getAuthCookie();
    self.sendEmailCheck();
    Utils.bindHashChange(hashChangeCallback);  // 绑定hash值变化时的回调函数
    Utils.setEvents();
    Pingback.init('retrieve');
  },
  methods: {
      sendEmailCheck(){
        var self = this;
        var data = {
          authcookie:self.authcookie,
          email: self.user.email,
          type:20,
          redirect: Utils.PAGEDOMAIN + 'bindbyemail.html#bmphone?v=' + Storage.getSessionStorage(Utils.URL_PARAMS).av
        };
        Utils.sendEmailRequest(self, data).then(function(res){  
            self.$broadcast("startEmailCountdown");
            self.gointoemailurl = 'http://mail.' + self.user.email.split('@')[1];
            localStorage.setItem('tv_gointoEmailBtnUrl', self.gointoemailurl);
            localStorage.setItem('tv_account_byemail', self.user.email);
        }, function(res) {
            self.errmsg= Utils.showErrorMsg(res);
            Pingback.errLogger(e.code, 'mail');
        });
      },
      getPhoneCode(){
        var self = this;
        self.$broadcast("getAccountVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
        self.$broadcast("getPiccodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
        self.errmsg = (self.errMsg.accounterrmsg || self.errMsg.piccodeerrmsg);
        if(self.errmsg){ return false;}  // 前端校验
        var data = {
            account: self.user.account,
            piccode: self.user.piccode
        };
        Utils.getPhonecode(self, data, Utils.REQUEST_BIND).then(function(){
            location.hash = "bmcode";
        },function(res){});
      },
      verifyPhoneCode(){
        var self = this;
        self.$broadcast("getPhonecodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
        self.errmsg = self.errMsg.phonecodeerrmsg;
        if(self.errmsg){ return false;}  // 前端校验
        var data = {
            account: self.user.account,
            phonecode: self.user.phonecode
        };
        Utils.verifyPhoneCode(self, data, Utils.REQUEST_BIND).then(function(res){
            var bindyemailToken = encodeURIComponent(Storage.getBindByEmailToken());
            var data2 = {
                type:22,
                token: bindyemailToken,
                authcookie: self.authCookie,
                account: self.user.account,
                passwd: null
            }
            Utils.bindaccount(self, data2).then(function(res) {
              Storage.setSessionStorage('proType', Utils.getSceneVal(Utils.BEHAVIOR_BIND));
              var timerId = setTimeout(function() {               // 最迟TIMEOUT_GO 页面跳转
                  Utils.openProfilePage();
              }, 500);
              Pingback.userBehavior('phone_mail', function() {
                clearTimeout(timerId);                    // 如果pingback发送成功，取消定时器
                Utils.openProfilePage();
              });
            }, function(res) {
              self.errmsg= Utils.showErrorMsg(res);
              Pingback.errLogger(e.code, 'msgcode');  
            });
        },function(res){
            self.errmsg= Utils.showErrorMsg(res);
            Pingback.errLogger(e.code, 'msgcode');  
        });
      },
  }  
}
</script>





