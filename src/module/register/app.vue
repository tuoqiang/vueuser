<template>
  	<topbar text="注册"></topbar>
    <error-msg 
        :errmsg='errmsg' 
        v-if="errmsg">
    </error-msg>
  	<form class="form-container contianer_ht1" action="#" autocomplete="on" >
        <!-- 注册第一步 -->
        <div v-show="hash == 'rphone'">
            <form-account 
                  iptplaceholder="请输入手机号" 
                  labelname="手机号："  
                  format="phone">
            </form-account>
            <form-piccode 
                  :needpiccode="true" 
                  datapage="signup" 
                  datablock="signup" >
            </form-piccode>
            <button-common 
                  @click="getPhoneCode" 
                  btnclass="btn-primary form_btnpos02" 
                  btntext="下一步" 
                  dataclick="next" 
                  datablock="signup" >
            </button-common>  
            <button-common 
                  datahref="login.html" 
                  btnclass="formcommon-sty form_btnpos01" 
                  btntext="登录" 
                  dataclick="signup" 
                  datablock="signup" >
            </button-common>
        </div>
        <!-- 注册第二步 -->
    		<div v-show="hash == 'rcode'" class="hgt1">
            <phonecode 
                  :phone="user.account" 
                  regethref="register.html#rphone" 
                  phonetxtclass="form-phonetxt"  
                  iptclass="form-bortop-pos1" 
                  dataclick="again" 
                  datablock="msg">
            </phonecode>
            <button-common 
                  @click="verifyPhoneCode" 
                  btnclass="btn-primary form_btnpos02" 
                  btntext="立即注册" 
                  dataclick="setpwd" 
                  datablock="msg">
            </button-common>  
        </div>
        <!-- 注册第三步 -->
        <div v-show="hash == 'rpwd'" class="hgt1 pr" >
            <form-pwd 
                  fatherclass="form-bortop" 
                  labelname="密码：" 
                  iptplaceholder="8-20位字母、数字或字符的组合" 
                  modelpwd="pwd">
            </form-pwd>
            <form-pwd 
                  fatherclass="form-group-bt" 
                  fatherinclass="form-group-in-nnobor" 
                  labelname="确认密码：" 
                  iptplaceholder="请再次输入密码"  
                  modelpwd="compwd">
            </form-pwd> 
            <button-common 
                  @click="regist" 
                  btnclass="btn-primary form_btnpos01" 
                  btntext="完成" 
                  dataclick="signupdone" 
                  datablock="setpwd">
            </button-common>  
            <p class="contract lft3">我已阅读同意<a href="agreement.html">《注册协议》</a></p>
        </div>
  	</form>
    <toast  
            content="在电脑或手机上注册过？试试其它方式完成登录吧"
            comformbtntxt="去试试"
            cancelbtntxt="稍后再说"
            :isregistered="isRegistered">   
    </toast>
    <error-page 
            :errorpagetex="errorpagetex" 
            v-if="errorpagetex">
    </error-page>
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
import FormAccount from 'components/form-account'
import FormPwd from 'components/form-pwd'
import FormPiccode from 'components/form-piccode'
import Toast from 'components/toast'
import ErrorPage from 'components/error-page'
import Phonecode from 'components/phonecode'

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
              accounterrmsg:'',        // 账号错误文案
              piccodeerrmsg:'',        // 图文验证码错误文案
              phonecodeerrmsg:'',      // 6位短信验证码错误文案
              pwderrmsg:'',            // 密码错误文案
              compwderrmsg:'' ,        // 确认密码错误文案
          },
          hash:'',                 // 当前hash值
          urlParams: '',           // 安卓穿透字段
        	errmsg: '',              // 错误文案
          isRegistered: false,     // 手机号已经注册过
          errorpage:'',           // 登录失败页面文案
      }
  },
  components: {
    	ButtonCommon,
    	Topbar,
    	FormAccount,
    	FormPiccode,
      ErrorMsg,
      Toast,
      ErrorPage,
      Phonecode,
      FormPwd,
  },
  events: {
      'child-account-check': function (errormsg) {
          this.erraccounterrmsg = errormsg;
      },
      'child-piccode-check': function (errormsg) {
          this.piccodeerrmsg = errormsg;
      },
      'child-phonecode-check': function (errormsg) {
          this.phonecodeerrmsg = errormsg;
      },
      'child-pwd-check': function (errormsg) {
          this.pwderrmsg = errormsg;
      },
      'child-compwd-check': function (errormsg) {
          this.compwderrmsg = errormsg;
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
  },
  created: function () {
      console.log('created run');
      
  },
  ready: function(){
    var self = this;
    var hashChangeCallback = function(){
        console.log('h5_moble! onhashchange come in');
        Utils.setPageHash(self, 'register', location.hash);
        Utils.setHashChangeCallback(self, 'register', location.hash);
    }
    Utils.bindHashChange(hashChangeCallback);  // 绑定hash值变化时的回调函数
    Utils.setEvents();
    Pingback.init('signup');
    Utils.setPageHash(this, 'register', location.hash);
  },
  methods: {
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
          Utils.getPhonecode(self, data, Utils.REQUEST_REGISTER).then(function(){
              location.hash = "rcode";
          },function(res){
              self.isRegistered = (res.code === 'P00404');
              self.isRegistered && self.$broadcast("sendToastShowPb");
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
          Utils.verifyPhoneCode(self, data, Utils.REQUEST_REGISTER).then(function(res){
              location.hash = "rpwd";
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
              Pingback.errLogger(res.code, 'msg');
          });
      },
      regist(){
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
              account: self.user.account,
              pwd: Utils.getRsaVal(self.user.pwd),
              phonecode: self.user.phonecode,
          };
          Utils.phoneRegister(self, data).then(function(res){
              Utils.confirmTokenLogin(self,  Utils.BEHAVIOR_REGISTER).then(function(suc){}, function(fail){   
                self.errorpagetex = Utils.tokenError.register// 如果存在redirectUrl，则token失效继续跳转走后面的逻辑                              
              });
          },function(res){
              self.errmsg= Utils.showErrorMsg(res);
          });
      }
  }  
}
</script>





