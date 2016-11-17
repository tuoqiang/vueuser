<template>
  	<topbar text="注册"></topbar>
    <error-msg v-bind:errmsg='errmsg' v-show="errmsg"></error-msg>
  	<form class="form-container contianer_ht1" action="#" autocomplete="on" >
         <!-- 注册第一步 -->
        <div v-show="hash == 'rphone'">
          <form-account iptplaceholder="请输入手机号" labelname="手机号："  ismustphone="true"></form-account>
          <form-piccode :needpiccode="true" ></form-piccode>
          <button-common @click="getPhoneCode" btnclass="btn-primary form_btnpos02" btntext="下一步"></button-common>  
          <button-common @click="" btnclass="formcommon-sty form_btnpos01" btntext="登录"></button-common>
        </div>
        <!-- 注册第二步 -->
    		<div v-show="hash == 'rcode'" >
          <phonecode :phonenum="user.account" datahref="register.html#rphone"></phonecode>
          <button-common @click="sendPhoneCode" btnclass="btn-primary form_btnpos02" btntext="立即注册"></button-common>  
        </div>
        <!-- 注册第三步 -->
        <div v-show="hash == 'rpwd'"  style="height:1.74rem; position:relative;">
          <form-pwd fatherclass="form-bortop" labelname="密码：" iptplaceholder="8-20位字母、数字或字符的组合" modelpwd="pwd"></form-pwd>
          <form-pwd fatherclass="form-group-bt" fatherinclass="form-group-in-nnobor" labelname="确认密码：" iptplaceholder="请再次输入密码"  modelpwd="compwd"></form-pwd> 
          <button-common @click="regist" btnclass="btn-primary form_btnpos01" btntext="完成"></button-common>  
          <p class="contract" style="left: 0.3rem;">我已阅读同意<a href="agreement.html">《注册协议》</a></p>
        </div>
  	</form>
    <toast  content="在电脑或手机上注册过？试试其它方式完成登录吧"
            comformbtntxt="去试试"
            cancelbtntxt="稍后再说"
            v-show="isRegistered">   
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
          hash:'',                 // 当前hash值
          urlParams: '',           // 安卓穿透字段
        	errmsg: '',              // 错误文案
          tipsmsg: false,          // 从购买页扫码而来时的引导文案
          resneedpiccode: false,   // res.code='P00107'接口返回需要piccode错误码
          needpiccode: false,      // 需要piccode标志位
          submitCount: 0,         // 服务器返回错误次数
          isRegistered: false,     // 手机号已经注册过
          errorpage:'',           // 登录失败页面文案
          ismustphone: true,
          accounterrmsg:'',          // 账号错误文案
          piccodeerrmsg:'',            // 图文验证码错误文案
          phonecodeerrmsg:'',            // 6位短信验证码错误文案
          pwderrmsg:'',            // 密码错误文案
          compwderrmsg:'' ,             // 确认密码错误文案
      }
  },
  components: {
    	ButtonCommon,
    	Topbar,
    	LoginTips,
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
      'child-pwd-check': function (errormsg) {
          this.pwderrmsg = errormsg;
      },
      'child-compwd-check': function (errormsg) {
          this.compwderrmsg = errormsg;
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
      !location.hash && (location.hash = '#rphone'); // 默认打开注册第一步
      this.hash = location.hash.replace('#','');
  },
  ready: function(){
    var self = this;
    var hashChangeCallback = function(){
        console.log('h5_moble! onhashchange come in');
        var curHash = location.hash;
        self.hash = curHash.replace('#','');
        $('body').scrollTop(0);
       
        if(curHash === '#rphone'){ // 只有在rphone页才会重新获取图文验证码
          clearInterval(Utils.codeTimerId);
          Utils.codeTimerId = null;       // 清除验证码60s定时器
          self.$broadcast("updatePiccode");
        }
    }
    Utils.bindHashChange(hashChangeCallback);  // 绑定hash值变化时的回调函数
    
  },
  methods: {
      //登陆操作
      getPhoneCode(){
          var self = this;
          this.$broadcast("getIptVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          if(Utils.submitingFlag) {
              self.errmsg='请求中，稍后再试！';
              return false;
          }
          if(self.accounterrmsg || self.piccodeerrmsg){  // 前端校验
            self.errmsg = (self.accounterrmsg || self.piccodeerrmsg);
            return false;
          } 
          var data = {
              account: this.user.account,
              piccode: this.user.piccode
          };
          Utils.submitingFlag = true;
          Utils.phonecodeHandler(self, data, Utils.REQUEST_REGISTER).then(function(){
              Utils.submitingFlag = false;
              location.hash = "rcode";
              self.$broadcast("startCountdown");
          },function(res){
              Utils.submitingFlag = false;
              self.errmsg= Utils.showErrorMsg(res);
              self.isRegistered = (res.code === 'P00404');
              (res.code === 'P00107') && self.$broadcast("updatePiccode");
          });
      },
      sendPhoneCode(){
          var self = this;
          this.$broadcast("getIptVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          if(Utils.submitingFlag) {
              self.errmsg='请求中，稍后再试！';
              return false;
          }
          if(self.phonecodeerrmsg){  // 前端校验
              self.errmsg = self.phonecodeerrmsg;
              return false;
          } 
          var data = {
              account: this.user.account,
              phonecode: this.user.phonecode
          };
          Utils.submitingFlag = true;
          Utils.phoneCodeVerify(self, data, Utils.REQUEST_REGISTER).then(function(res){
              Utils.submitingFlag = false;
              location.hash = "rpwd";
          },function(res){
              Utils.submitingFlag = false;
              self.errmsg= Utils.showErrorMsg(res);
          });
      },
      regist(){
          var self = this;
          this.$broadcast("getIptVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
          if(Utils.submitingFlag) {
              self.errmsg='请求中，稍后再试！';
              return false;
          }
          if(this.user.pwd != this.user.compwd){
              self.errmsg = '新密码两次输入不相同';
              return false;
          }
          if(self.pwderrmsg || self.compwderrmsg){  // 前端校验
              self.errmsg = (self.pwderrmsg || self.compwderrmsg);
              return false;
          } 
          var data = {
              account: this.user.account,
              pwd: Utils.geta(this.user.pwd),
              phonecode: this.user.phonecode,
          };
          Utils.submitingFlag = true;
          Utils.phoneRegister(self, data).then(function(res){
              Utils.submitingFlag = false;
              Utils.confirmTokenLogin(self,  Utils.BEHAVIOR_REGISTER).then(function(suc){}, function(fail){   
                self.errorpage = Utils.tokenError[Utils.getScene(Utils.BEHAVIOR_LOGIN)]// 如果存在redirectUrl，则token失效继续跳转走后面的逻辑                              
              });
          },function(res){
              Utils.submitingFlag = false;
              self.errmsg= Utils.showErrorMsg(res);
          });
      }
  }  
}
</script>





