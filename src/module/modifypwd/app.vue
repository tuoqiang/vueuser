<template>
  	<topbar text="修改密码"></topbar>
    <error-msg :errmsg='errmsg' v-if="errmsg"></error-msg>
  	<form class="container form-container" action="#" autocomplete="off" id="j-form" style="margin-top:0.25rem;">
     
      <!-- 手机修改密码第一步 -->
      <div v-if="hash == 'mphone'" class="hgt2">
        <process-step firstttext="手机号" processclass="pwd-title-step1"></process-step>
        <form-account iptplaceholder="请输入手机号" labelname="手机号：" readonly="readonly" :localaccount="user.account"  ></form-account>
        <form-piccode :needpiccode="true" ></form-piccode>
        <button-common @click="getPhoneCode" btnclass="btn-primary form_btnpos01" btntext="发送验证信息"></button-common>  
      </div>

      <!-- 手机修改密码第二步 -->
      <div v-show="hash == 'mcode'" class="hgt2">
        <process-step firstttext="手机号" processclass="pwd-title-step2"></process-step>
        <phonecode :phone="user.account" :regethref="regethref" phonetxtclass="form-phonetxt2" iptclass="form-group-mt03"></phonecode>
        <button-common @click="verifyPhoneCode" btnclass="btn-primary form_btnpos01" btntext="立即验证"></button-common>  
      </div>

      <!-- 手机-邮箱修改密码第三步 -->
      <div v-if="hash == 'mpwd'" class="hgt3 pr">
        <process-step firstttext="手机号" processclass="pwd-title-step3"></process-step>
        <form-pwd fatherclass="form-bortop" labelname="原密码：" iptplaceholder="请输入密码" modelpwd="oldpwd"></form-pwd>
        <form-pwd labelname="新密码：" iptplaceholder="8-20位字母、数字或字符的组合" modelpwd="pwd"></form-pwd>
        <form-pwd fatherclass="form-group-bt" fatherinclass="form-group-in-nnobor" labelname="确认密码：" iptplaceholder="请再次输入密码"  modelpwd="compwd"></form-pwd> 
        <button-common @click="fpwd" btnclass="btn-primary form_btnpos01" btntext="完成"></button-common>  
      </div>

      <!-- 邮箱修改密码第一步 -->
      <div v-if="hash == 'memail'" class="hgt2">
        <process-step firstttext="邮箱地址" processclass="pwd-title-step1"></process-step>
        <form-account iptplaceholder="请输入邮箱" labelname="邮&nbsp;&nbsp;箱："  readonly="readonly" :localaccount="user.account"></form-account>
        <button-common @click="sendEmail" btnclass="btn-primary form_btnpos01" btntext="发送验证信息"></button-common>  
      </div>

      <!-- 邮箱修改密码第二步 -->
      <div  v-show="hash == 'memailr'" class="hgt2">
        <process-step firstttext="邮箱地址" processclass="pwd-title-step2"></process-step>
        <email-counter :localaccount="user.account"></email-counter>
        <button-common  @click="fpwd" btnclass="btn-primary form_btnpos01" btntext="立即进入邮箱" :datahref="gointoemailurl"></button-common>  
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
import ButtonCommonA from 'components/button-common-a'
import ButtonCommon from 'components/button-common'
import ErrorMsg from 'components/error-msg'
import Topbar from 'components/topbar'
import ProcessStep from 'components/process-step'
import FormAccount from 'components/form-account'
import FormPwd from 'components/form-pwd'
import FormPiccode from 'components/form-piccode'
import Phonecode from 'components/phonecode'
import EmailCounter from 'components/email-counter'

export default {
  data() {
      return {     
          user:{                    // 账号信息
              account: '',
              oldpwd: '',
              pwd: '',
              compwd: '',
              piccode: '',
              phonecode:'',
          },
          errMsg:{
              piccodeerrmsg:'',            // 图文验证码错误文案
              phonecodeerrmsg:'',            // 6位短信验证码错误文案
              pwderrmsg:'',            // 密码错误文案
              compwderrmsg:'' ,             // 确认密码错误文案
              oldpwderrmsg:'' ,             // 旧密码错误文案
          },
          hash:'',                 // 当前hash值
        	errmsg: '',              // 错误文案
          resetpwdToken:'',      // cookie P00014的值，通过验证手机验证码或者验证邮箱通过后种上。
          gointoemailurl:''  ,        // 立即进入邮箱链接
          regethref:'',//重新获取验证码链接
          urlParams:'',// 链接中参数
          authcookie:'', // p000001
          localaccount:'', // 只读属性，修改密码邮箱地址
      }
  },
  components: {
    	ButtonCommon,
      ButtonCommonA,
    	Topbar,
    	FormAccount,
    	FormPiccode,
      ErrorMsg,
      Phonecode,
      FormPwd,
      ProcessStep,
      EmailCounter,
  },
  events: {
      'child-account-check': function (errormsg) {
          this.accounterrmsg = errormsg;
      },
      'child-piccode-check': function (errormsg) {
          this.piccodeerrmsg = errormsg;
      },
      'child-phonecode-check': function (errormsg) {
          this.phonecodeerrmsg = errormsg;
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
      'child-oldpwd-check': function (errormsg) {
          this.oldpwderrmsg = errormsg;
      },
      'child-pwd-check': function (errormsg) {
          this.pwderrmsg = errormsg;
      },
      'child-compwd-check': function (errormsg) {
          this.compwderrmsg = errormsg;
      },
      'child-oldpwd': function(oldpwd){
          this.user.oldpwd = oldpwd;
      },
      'child-pwd': function(pwd){
          this.user.pwd = pwd;
      },
      'child-compwd': function(compwd){
          this.user.compwd = compwd;
      },
      'send-email-again': function(){ // 重新发送验证邮件
          this.sendEmail();
      },
  },
  created: function () {
      console.log('created run');
      Utils.setPageHash(this, 'modpwd', location.hash);
  },
  ready: function(){
    var self = this;
    var hashChangeCallback = function(){
        console.log('h5_moble! onhashchange come in');
        Utils.setPageHash(self, 'modpwd', location.hash);
        Utils.setHashChangeCallback(self, 'modpwd', location.hash);
    }
    var urlParams = self.urlParams = Utils.parseLocationSearch();
    self.authcookie  = Utils.getAuthCookie();               // hash为mpwd时， 用邮箱更改密码时，需要authcookie
    // 判断页面来源：是否扫码
    if(!!urlParams && urlParams.cok) {                          // 扫码方式：更新密码
      // 存储相关信息到本地
      self.authcookie = urlParams.cok;
      Utils.setCookie('P00001', self.authcookie);              // 隐身模式下，出现没有cookie种下。强制种P00001
      var storage = Utils.stringToObj(urlParams.extra, ';', ':');
      storage && (storage.device_id = urlParams.device_id);
      console.log('localstorage: ', storage);
      Storage.setStorage(Utils.URL_PARAMS, storage);
    }
    (location.hash.substring(0,5) != '#mpwd') && self.setView(urlParams);
    Utils.bindHashChange(hashChangeCallback);  // 绑定hash值变化时的回调函数
    Utils.setEvents();
    Pingback.init('retrieve');
    
  },
  methods: {
      setView(urlParams) {
        console.log('setView run');
        var u = urlParams.u;
        // 根据用户类型不同，显示不同的视图
        if(Utils.isCellphone(u)) {                    // 账户是手机号
          console.log(u);
          self.user.account = Utils.getEncryptPhone(u, 7);
          self.regethref = location.href;
          location.hash = 'mphone';
          Pingback.pageLoaded('msg');             // 展示pingback，手机修改密码第一步页面
        }else if(Utils.isEmail(u)) {          // 账户是邮箱
          self.user.account = Utils.getEncryptEamil(u);
          console.log(self.email);
          location.hash = 'memail';
          Pingback.pageLoaded('mail');              // 展示pingback，邮箱修改密码第一步页面
        }
      },
      getPhoneCode(){
          var self = this;
          self.$broadcast("getPiccodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.piccodeerrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          var data = {
              account: self.urlParams.u,
              piccode: self.user.piccode
          };
          Utils.getPhonecode(self, data, Utils.REQUEST_MODPWD, this.authcookie).then(function(){
              location.hash = "mcode";
              self.$broadcast("startCountdown");
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
              self.$broadcast("updatePiccode");
          });
      },
      verifyPhoneCode(){
          var self = this;
          self.$broadcast("getPhonecodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.phonecodeerrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          var data = {
              account: self.urlParams.u,
              phonecode: self.user.phonecode
          };
          Utils.verifyPhoneCode(self, data, Utils.REQUEST_MODPWD).then(function(res){
              self.resetpwdToken = Storage.getRstPwdToken();      // cookie P00014的值，通过验证手机验证码或者验证邮箱通过后种上。
              location.hash = "mpwd";
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      },
      fpwd(){
          var self = this;
          self.$broadcast("getOldpwdVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.oldpwderrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          self.$broadcast("getPwdVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.pwderrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          self.$broadcast("getCompwdVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.compwderrmsg;
          if(self.errmsg){ return false;}  // 前端校验
          if(self.user.oldpwd === self.user.pwd){
              self.errmsg = '新旧密码不能相同';
              return false;
          }
          if(self.user.pwd != self.user.compwd){
              self.errmsg = '新密码两次输入不相同';
              return false;
          } 
          var data = {
              newpass: self.user.pwd,
              oldpass: self.user.oldpwd,
              token: self.resetpwdToken,
              authcookie: self.authcookie,
          };
          Utils.saveMpwdRequest(self, data).then(function(res){
              Storage.setSessionStorage('proType', Utils.getSceneVal(Utils.BEHAVIOR_MODPWD));
              Pingback.userBehavior('reset_chg');           // 修改密码后发pingback
              Utils.openProfilePage();                // 跳转到个人中心页, 此处没有Pingback
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      },
      sendEmail(){
          var self = this;
          self.$broadcast("getAccountVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          var data = {
              email: self.urlParams.u,
              redirect: Utils.PAGEDOMAIN + 'modifypwd.html#mpwd?v='+Storage.getSessionStorage(Utils.URL_PARAMS).av,
              type:2,
              authcookie:self.authcookie,
          };
          Utils.sendEmailRequest(self, data).then(function(res){
              self.$broadcast("startEmailCountdown");
              self.gointoemailurl = 'http://mail.' + self.urlParams.u.split('@')[1];
              location.hash = "memailr";
              localStorage.setItem('h5_modifyPwd_byemail', 'http://mail.' + self.urlParams.u.split('@')[1]);
              localStorage.setItem('h5_modifyPwd_email', self.urlParams.u); //待： 把邮箱种到本地存储中：作用 当点击立即进入邮箱按钮进入邮箱登录页再返回时，页面中的邮箱已被清空，此时从缓存中读取刚才输入的邮箱
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      },
  }  
}
</script>