<template>
  	<topbar text="变更手机号"></topbar>
    <error-msg :errmsg='errmsg' v-if="errmsg"></error-msg>
  	<form class="container form-container" action="#" autocomplete="off" id="j-form" style="margin-top:0.25rem;">
      <!-- 变更手机号第一步 -->
       <div v-if="hash == 'bpfirst'" style="height:1.84rem;">
        <process-step firstttext="手机号" processclass="pwd-title-step1"></process-step>
        <form-account iptplaceholder="请输入手机号" labelname="手机号：" readonly="readonly" :localaccount="user.oldaccount" ></form-account>
        <form-piccode :needpiccode="true" ></form-piccode>
        <button-common @click="getPhoneCode" btnclass="btn-primary form_btnpos01" btntext="发送验证信息"></button-common>  
      </div>

      <!-- 变更手机号第二步 -->
      <div v-show="hash == 'bpsecond'" style="height:1.84rem;">
        <process-step firstttext="手机号" processclass="pwd-title-step2"></process-step>
        <phonecode :phone="user.account" regethref="changephone.html#bpfirst" phonetxtclass="form-phonetxt2" iptclass="form-group-mt03"></phonecode>
        <button-common @click="verifyPhoneCode" btnclass="btn-primary form_btnpos01" btntext="立即验证"></button-common>  
      </div>

      <!-- 变更手机号第三步 -->
      <div v-if="hash == 'bpthird'" style="height:1.84rem;">
        <process-step firstttext="手机号" processclass="pwd-title-step2"></process-step>
        <form-account iptplaceholder="请输入手机号" labelname="手机号：" format="phone" ></form-account>
        <form-piccode :needpiccode="true" ></form-piccode>
        <button-common @click="getPhoneCode2" btnclass="btn-primary form_btnpos01" btntext="发送验证信息"></button-common>  
      </div>

      <!-- 变更手机号第四步 -->
      <div v-show="hash == 'bpfourth'" style="height:1.84rem;">
        <process-step if="手机号" processclass="pwd-title-step2"></process-step>
        <phonecode :phone="user.account" regethref="changephone.html#bpfourth" phonetxtclass="form-phonetxt2" iptclass="form-group-mt03"></phonecode>
        <button-common @click="verifyPhoneCode2" btnclass="btn-primary form_btnpos01" btntext="立即验证"></button-common>  
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
import LoginTips from 'components/login-tips'
import FormAccount from 'components/form-account'
import FormPiccode from 'components/form-piccode'
import Phonecode from 'components/phonecode'

export default {
  data() {
      return {     
          user:{                    // 账号信息
              oldaccount: '',
              oldpiccode: '',
              oldphonecode:'',
              account: '',
              piccode: '',
              phonecode:'',
          },
          errMsg:{
              accounterrmsg:'',          // 账号错误文案
              piccodeerrmsg:'',            // 图文验证码错误文案
              phonecodeerrmsg:'',            // 6位短信验证码错误文案
              oldpiccodeerrmsg:'',    
              oldphonecodeerrmsg:'',    
          },
          hash:'',                 // 当前hash值
        	errmsg: '',              // 错误文案
          authcookie:'', // p000001
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
  },
  events: {
      'child-oldpiccode-check': function (errormsg) {
          this.errMsg.oldpiccodeerrmsg = errormsg;
      },
      'child-oldphonecode-check': function (errormsg) {
          this.errMsg.oldphonecodeerrmsg = errormsg;
      },
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
      'child-oldaccount': function (account) {
          this.user.oldaccount = account;
      },
      'child-piccode': function (piccode) {
          this.user.oldpiccode = piccode;
      },
      'child-phonecode': function(phonecode){
          this.user.oldphonecode = phonecode;
      },
  },
  created: function () {
      console.log('created run');
      Utils.setPageHash(this, 'changephone', location.hash);
  },
  ready: function(){
    var self = this;
    self.user.oldaccount = localStorage.getItem('h5_bind_by_phone');
    self.authcookie  = Utils.getAuthCookie();
    var hashChangeCallback = function(){
        Utils.setPageHash(self, 'changephone', location.hash);
        Utils.setHashChangeCallback(self, 'changephone', location.hash);
    }
    Utils.bindHashChange(hashChangeCallback);  // 绑定hash值变化时的回调函数
    Utils.setEvents();
    Pingback.init('retrieve');
  },
  methods: {
      //登陆操作
      getPhoneCode(){
          var self = this;
          self.$broadcast("getPiccodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.errMsg.oldpiccodeerrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          var data = {
              account: self.user.oldaccount,
              piccode: self.user.oldpiccode,
          };
          Utils.getPhonecode(self, data, Utils.REQUEST_CHANGEPHONE).then(function(){
              location.hash = "bpsecond";
              self.$broadcast("startCountdown");
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
              self.$broadcast("updatePiccode");
          });
      },
      verifyPhoneCode(){
          var self = this;
          self.$broadcast("getPhonecodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.errMsg.oldphonecodeerrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          var data = {
              account: self.user.oldaccount,
              phonecode: self.user.oldphonecode
          };
          Utils.verifyPhoneCode(self, data, Utils.REQUEST_CHANGEPHONE).then(function(res){
              location.hash = "bpthird";
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      },//登陆操作
      getPhoneCode2(){
          var self = this;
          self.$broadcast("getPiccodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = (self.errMsg.accounterrmsg || self.errMsg.piccodeerrmsg);
          if(self.errmsg){ return false;}  // 前端校验
          var data = {
              account: self.user.account,
              piccode: self.user.piccode,
          };
          Utils.getPhonecode(self, data, Utils.REQUEST_CHANGESAVEPHONE).then(function(){
              location.hash = "bpfourth";
              self.$broadcast("startCountdown");
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
              self.$broadcast("updatePiccode");
          });
      },
      verifyPhoneCode2(){
          var self = this;
          self.$broadcast("getPhonecodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.errMsg.phonecodeerrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          var data = {
              account: self.user.account,
              phonecode: self.user.phonecode
          };
          Utils.verifyPhoneCode(self, data, Utils.REQUEST_CHANGESAVEPHONE).then(function(res){
              var changephoneToken = Storage.getChangephoneToken();      // cookie P00012的值，通过验证手机验证码或者验证邮箱通过后种上。
              var data2 = {
                  cellphoneNumber:self.user.account,
                  token: changephoneToken,
                  authcookie: self.authCookie,
                  authCode: self.phonecode,
                  serviceId: 2
              }
              Utils.replacPhone(self, data2).then(function(res) {
                  Storage.setSessionStorage('proType', Utils.getSceneVal(Utils.BEHAVIOR_BIND));
                  var timerId = setTimeout(function() {               // 最迟TIMEOUT_GO 页面跳转
                    Utils.openProfilePage();
                  }, TIMEOUT_GO);

                  Pingback.userBehavior('phone_mail', function() {
                    clearTimeout(timerId);                    // 如果pingback发送成功，取消定时器
                    Utils.openProfilePage();
                  });
                
              }, function(res) {
                  self.errmsg= Utils.showErrorMsg(res);
              });
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      },
  }  
}
</script>





