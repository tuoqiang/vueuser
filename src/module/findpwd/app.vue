<template>
  	<topbar text="找回密码"></topbar>
    <error-msg :errmsg='errmsg' v-if="errmsg"></error-msg>
  	<form class="container form-container" action="#" autocomplete="off" id="j-form" style="margin-top:0.25rem;">
      <!-- 手机或邮箱找回密码标题 -->
      <div v-if="hash == 'findex'">
        <div class="form-phonetxt" style="top:-0.03rem;">请选择您找回密码的方式：</div>
        <div class="form-group form-bortop form-group-mt01" >
          <div class="form-group-in">
            <button-common-a @click="gotoFPwdByPhone" btntext="手机找回密码" ></button-common-a>
          </div>
        </div>
        <div class="form-group form-group-bt form-group-mt02" >
          <div class="form-group-in form-group-in-nnobor">
            <button-common-a @click="gotoFPwdByEmail" btntext="邮箱找回密码" ></button-common-a>
          </div>
        </div>
      </div>

      <!-- 手机找回密码第一步 -->
      <div v-if="hash == 'fphone'" class="hgt2">
        <process-step firstttext="手机号" processclass="pwd-title-step1"></process-step>
        <form-account iptplaceholder="请输入手机号" labelname="手机号：" format="phone" ></form-account>
        <form-piccode :needpiccode="true" ></form-piccode>
        <button-common @click="getPhoneCode" btnclass="btn-primary form_btnpos01" btntext="发送验证信息"></button-common>  
      </div>

      <!-- 手机找回密码第二步 -->
      <div v-show="hash == 'fcode'" class="hgt2">
        <process-step if="手机号" processclass="pwd-title-step2"></process-step>
        <phonecode :phone="user.account" regethref="findpwd.html#fphone" phonetxtclass="form-phonetxt2" iptclass="form-group-mt03"></phonecode>
        <button-common @click="verifyPhoneCode" btnclass="btn-primary form_btnpos01" btntext="立即验证"></button-common>  
      </div>

      <!-- 手机-邮箱找回密码第三步 -->
      <div v-if="hash == 'fpwd'" class="hgt2">
        <process-step firstttext="手机号" processclass="pwd-title-step3"></process-step>
        <form-pwd fatherclass="form-bortop" labelname="密码：" iptplaceholder="8-20位字母、数字或字符的组合" modelpwd="pwd"></form-pwd>
        <form-pwd fatherclass="form-group-bt" fatherinclass="form-group-in-nnobor" labelname="确认密码：" iptplaceholder="请再次输入密码"  modelpwd="compwd"></form-pwd> 
        <button-common @click="fpwd" btnclass="btn-primary form_btnpos01" btntext="完成"></button-common>  
      </div>

      <!-- 邮箱找回密码第一步 -->
      <div v-if="hash == 'femail'" class="hgt2">
        <process-step firstttext="邮箱地址" processclass="pwd-title-step1"></process-step>
        <form-account iptplaceholder="请输入邮箱" labelname="邮&nbsp;&nbsp;箱：" format="email"></form-account>
        <button-common @click="sendEmail" btnclass="btn-primary form_btnpos01" btntext="发送验证信息"></button-common>  
      </div>

      <!-- 邮箱找回密码第二步 -->
      <div  v-show="hash == 'femailr'" class="hgt2">
        <process-step firstttext="邮箱地址" processclass="pwd-title-step2"></process-step>
        <email-counter :email="user.account"></email-counter>
        <button-common  @click="fpwd" btnclass="btn-primary form_btnpos01" btntext="立即进入邮箱" :datahref="gointoemailurl"></button-common>  
      </div>
    </form>
    <error-page :errorpage="errorpage" v-show="errorpage"></error-page>
</template>

<script>

import Lib from 'assets/js/lib.js'
import Utils from 'assets/js/utils.js'
import Config from 'assets/js/config.js'
import Server from 'assets/js/server.js'
import Storage from 'assets/js/storage.js'
import Pingback from 'assets/js/pingback.js'
import ButtonCommonA from 'components/button-common-a'
import ButtonCommon from 'components/button-common'
import ErrorMsg from 'components/error-msg'
import Topbar from 'components/topbar'
import ProcessStep from 'components/process-step'
import FormAccount from 'components/form-account'
import FormPwd from 'components/form-pwd'
import FormPiccode from 'components/form-piccode'
import ErrorPage from 'components/error-page'
import Phonecode from 'components/phonecode'
import EmailCounter from 'components/email-counter'

export default {
  data() {
      return {     
          user:{                    // 账号信息
              account: '',
              pwd: '',
              compwd: '',
              piccode: '',
              phonecode:'',
          },
          errMsg:{
              accounterrmsg:'',          // 账号错误文案
              piccodeerrmsg:'',            // 图文验证码错误文案
              phonecodeerrmsg:'',            // 6位短信验证码错误文案
              pwderrmsg:'',            // 密码错误文案
              compwderrmsg:'' ,             // 确认密码错误文案
          },
          hash:'',                 // 当前hash值
        	errmsg: '',              // 错误文案
          errorpage:'',           // 登录失败页面文案
          resetpwdToken:'',      // cookie P00014的值，通过验证手机验证码或者验证邮箱通过后种上。
          gointoemailurl:''          // 立即进入邮箱链接
      }
  },
  components: {
    	ButtonCommon,
      ButtonCommonA,
    	Topbar,
    	FormAccount,
    	FormPiccode,
      ErrorMsg,
      ErrorPage,
      Phonecode,
      FormPwd,
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
      'child-pwd-check': function (errormsg) {
          this.errMsg.pwderrmsg = errormsg;
      },
      'child-compwd-check': function (errormsg) {
          this.errMsg.compwderrmsg = errormsg;
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
      'child-pwd': function(pwd){
          this.user.pwd = pwd;
      },
      'child-compwd': function(compwd){
          this.user.compwd = compwd;
      },
      'send-email-again': function(){   // 重新发送验证邮件事件，在email-counter中触发
          this.sendEmail();
      },
  },
  created: function () {
      console.log('created run');
      Utils.setPageHash(this, 'findpwd', location.hash);
  },
  ready: function(){
    var self = this;
    var hashChangeCallback = function(){
        console.log('h5_moble! onhashchange come in');
        Utils.setPageHash(self, 'findpwd', location.hash);
        Utils.setHashChangeCallback(self, 'findpwd', location.hash);
    }
    Utils.bindHashChange(hashChangeCallback);  // 绑定hash值变化时的回调函数
    Utils.setEvents();
    Pingback.init('retrieve');
  },
  methods: {
      gotoFPwdByPhone(){
        location.hash = 'fphone';
        Pingback.pageLoaded('msg');               // 展示pingback: 手机找回密码第一步页面
      },
      gotoFPwdByEmail(){
        location.hash = 'femail';
        Pingback.pageLoaded('mail');              // 展示pingback: 邮箱找回密码第一步页面
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
          Utils.getPhonecode(self, data, Utils.REQUEST_FINDPWD).then(function(){
              location.hash = "fcode";
              self.$broadcast("startCountdown");
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
              self.$broadcast("updatePiccode");
          });
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
          Utils.phoneCodeVerify(self, data, Utils.REQUEST_FINDPWD).then(function(res){
              self.resetpwdToken = Storage.getRstPwdToken();      // cookie P00014的值，通过验证手机验证码或者验证邮箱通过后种上。
              location.hash = "fpwd";
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      },
      fpwd(){
          var self = this;
          self.$broadcast("getPwdVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.errMsg.pwderrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          self.$broadcast("getCompwdVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.errMsg.compwderrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          if(self.user.pwd != self.user.compwd){
              self.errmsg = '新密码两次输入不相同';
              return false;
          }
          var data = {
              newpass: self.user.pwd,
              token: self.resetpwdToken
          };
          Utils.saveFpwdRequest(self, data).then(function(res){
              Utils.confirmTokenLogin(self,  Utils.BEHAVIOR_FINDPWD).then(function(suc){}, function(fail){   
                self.errorpagetex = Utils.tokenError.findpwd// 如果存在redirectUrl，则token失效继续跳转走后面的逻辑                            
              });
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      },
      sendEmail(){
          var self = this;
          self.$broadcast("getAccountVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.errMsg.accounterrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          var data = {
              email: self.user.account,
              redirect: Utils.PAGEDOMAIN + 'findpwd.html#fpwd?v='+Storage.getSessionStorage(Utils.URL_PARAMS).av + '&uuid=' + Storage.getSessionStorage(Utils.URL_PARAMS).ui,
              type: 16,
              authcookie: null,
          };
          Utils.sendEmailRequest(self, data).then(function(res){
              self.$broadcast("startEmailCountdown");
              self.gointoemailurl = 'http://mail.' + self.user.account.split('@')[1];
              location.hash = "femailr";
              localStorage.setItem('h5_modifyPwd_byemail', 'http://mail.' + self.user.account.split('@')[1]);
              localStorage.setItem('h5_modifyPwd_email', self.user.account); //待： 把邮箱种到本地存储中：作用 当点击立即进入邮箱按钮进入邮箱登录页再返回时，页面中的邮箱已被清空，此时从缓存中读取刚才输入的邮箱
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      },
  }  
}
</script>





