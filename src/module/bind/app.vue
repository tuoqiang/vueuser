<template>
  	<topbar text="绑定手机号"></topbar>
    <error-msg :errmsg='errmsg' v-if="errmsg"></error-msg>
  	<form class="form-container contianer_ht1" action="#" autocomplete="on" >
    <!-- pps绑定手机号第一步 -->
      <div v-show="hash == 'bphone'" class="hgt2">
          <process-step firstttext="身份识别" processclass="pwd-title-step1"></process-step>
          <form-account iptplaceholder="请输入手机号" labelname="手机号：" format="phone" ></form-account>
          <form-piccode :needpiccode="true" ></form-piccode>
          <button-common @click="getPhoneCode" btnclass="btn-primary form_btnpos01" btntext="发送验证信息"></button-common>  
      </div>
      <!-- pps绑定手机号第二步 -->
      <div v-show="hash == 'bcode'" class="hgt2">
        <process-step firstttext="身份识别" processclass="pwd-title-step2"></process-step>
        <phonecode :phone="user.account" regethref="bind.html#bphone" phonetxtclass="form-phonetxt2" iptclass="form-group-mt03"></phonecode>
        <button-common @click="sendBindRequest" btnclass="btn-primary form_btnpos01" btntext="完成"></button-common>  
      </div>
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

export default {
  data() {
      return {     
          user:{                    // 账号信息
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
          authCookie:'', // P00001
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
  },
  created: function () {
      console.log('created run');
      this.authCookie = Utils.getAuthCookie();
      var URL_BINDPARAMS = 'urlBindParams';
      var curHash = Utils.getHashAndParams()[0];
      var paramsStr = Utils.getHashAndParams()[1];
      this.urlParams = Utils.stringToObj(paramsStr, '&', '=');
      console.log('urlParams' + this.urlParams);
      var s1 = 'pps' ;
      if(this.urlParams && this.urlParams.s1){s1 = this.urlParams.s1; }
      Pingback.init(s1);
      (curHash === '') && (curHash = '#bphone');
      this.hash = curHash.replace('#','');

      if(curHash === '#bphone'){
        this.urlParams && Storage.setSessionStorage(URL_BINDPARAMS, this.urlParams);
        Pingback.pageLoaded('bind');                //  第一步
      }else if(curHash === '#bcode'){
        this.urlParams = (Pingback.getUrlParamsStorage(URL_BINDPARAMS) || {});
      }
  },
  ready: function(){
    var self = this;
    var hashChangeCallback = function(){
        console.log('h5_moble! onhashchange come in');
        Utils.setPageHash(self, 'bind', location.hash);
        Utils.setHashChangeCallback(location.hash)
    }
    Utils.bindHashChange(hashChangeCallback);  // 绑定hash值变化时的回调函数
    
  },
  methods: {
      getPhoneCode(){
          var self = this;
          self.$broadcast("getAccountVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.$broadcast("getPiccodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = (self.errMsg.accounterrmsg || self.piccodeerrmsg);
          if(self.errmsg){ return false; }   // 前端校验
          var data = {
              account: self.user.account,
              piccode: self.user.piccode
          };
          Utils.getPhonecode(self, data, Utils.REQUEST_BIND).then(function(){
              location.hash = "bcode";
              self.$broadcast("startCountdown");
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
              self.$broadcast("updatePiccode");
          });
      },
      sendBindRequest(){
          var self = this;
          var userBehavior = 'phone_pps'; 
          self.$broadcast("getPhonecodeVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          self.errmsg = self.errMsg.phonecodeerrmsg;
          if(self.errmsg){ return false; }   // 前端校验
          var data = {
              cellphoneNumber:self.user.account,
              authcookie: self.authCookie,
              authCode: self.user.phonecode,
              serviceId: 2,
              device_id: Pingback.getDeviceId()
          };
          Utils.sendBindRequest(self, data).then(function(res){
              self.urlParams && self.urlParams.s1 && (userBehavior = self.urlParams.s1) // 来自7天试用活动的绑定
              !self.urlParams && Storage.setSessionStorage('proType', Utils.getSceneVal(Utils.BEHAVIOR_BIND));
              var timerId = setTimeout(function() {             // 最迟TIMEOUT_GO 页面跳转
                Utils.gotoPageByUrl(self.urlParams);
              }, 500);

              Pingback.userBehavior(userBehavior, function() {
                clearTimeout(timerId);                  // 如果pingback发送成功，取消定时器
                Utils.gotoPageByUrl(self.urlParams);
              });
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      },
  }  
}
</script>





