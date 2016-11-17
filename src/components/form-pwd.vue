<template>
  <div class="form-group {{fatherclass}}">
    <div class="form-group-in {{fatherinclass}}" id="j_r_pwd">
      <label class="label-piccode labelpwd">{{labelname}}</label>
      <form-pwda v-if="modelpwd == 'pwd'" :pwdtype="pwdtype" :placeholder="iptplaceholder"> </form-pwda>
      <form-pwdb v-if="modelpwd == 'compwd'" :pwdtype="pwdtype" :placeholder="iptplaceholder"> </form-pwdb>
    </div>
  </div>
</template>


<script>
import FormPwda from 'components/form-pwda'
import FormPwdb from 'components/form-pwdb'

module.exports = {
  props:{
  	fatherclass:'',
    fatherinclass:'',
    labelname:'',
    fatherinclass:'',
    iptplaceholder:'',
    modelpwd:''
  },
  components: {
      FormPwda,
      FormPwdb,
  },
  data() {
    return {
      placeholder:'',
      pwdtype:'password',
      pwd:'',
      pwderrormsg:'',
      compwd:'',
      compwderrormsg:'',
      errormsg:'',
    }
  },
  methods: {
    a: function () {
    }
  },
  events: {
    'children-showorhidepwd': function(){
        this.pwdtype == 'password' ? this.pwdtype = 'text' : this.pwdtype = 'password'; 
    },
    'children-pwd-check': function (pwderrormsg) {
        this.pwderrormsg = pwderrormsg;
    },
    'children-pwd': function (pwd) {
        this.pwd = pwd;
    },
    'children-compwd-check': function (compwderrormsg) {
        this.compwderrormsg = compwderrormsg;
    },
    'children-compwd': function (compwd) {
        this.compwd = compwd;
    },
    'getIptVal': function(){
      (this.modelpwd == 'pwd') && this.$broadcast("getPwdVal");       // 父组件广播一个事件，去通知子组件把账号值传过来
      (this.modelpwd == 'compwd') && this.$broadcast("getComPwdVal"); // 父组件广播一个事件，去通知子组件把账号值传过来
      console.log(this.pwd);
      console.log(this.compwd);
      
      (this.modelpwd == 'pwd') &&  this.$dispatch('child-pwd-check', this.pwderrormsg );
      (this.modelpwd == 'compwd') && this.$dispatch('child-compwd-check', this.compwderrormsg );

      (this.modelpwd == 'pwd') &&  this.$dispatch('child-pwd', this.pwd);
      (this.modelpwd == 'compwd') && this.$dispatch('child-compwd', this.compwd);
    	/*if(!this.pwd){ 
          this.errormsg='密码不能为空';
      	}else{
      	  this.errormsg='';
      	}
      	this.$dispatch('child-pwd-check', this.errormsg);
		    this.$dispatch('child-pwd', this.modelpwd);*/
  	 }
  }
}
</script>