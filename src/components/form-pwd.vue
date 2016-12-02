<template>
  <div class="form-group" :class="fatherclass">
    <div class="form-group-in" class="fatherinclass">
        <label class="label-piccode labelpwd">{{labelname}}</label>
        <form-child-oldpwd 
                            v-if="modelpwd == 'oldpwd'" 
                            :pwdtype="pwdtype" 
                            :placeholder="iptplaceholder">
        </form-child-oldpwd>
        <form-child-pwd     
                            v-if="modelpwd == 'pwd'" 
                            :pwdtype="pwdtype" 
                            :placeholder="iptplaceholder">
        </form-child-pwd>
        <form-child-compwd  
                            v-if="modelpwd == 'compwd'" 
                            :pwdtype="pwdtype" 
                            :placeholder="iptplaceholder">
        </form-child-compwd>
    </div>
  </div>
</template>

<script>
import FormChildOldpwd from 'components/form-child-oldpwd'
import FormChildPwd from 'components/form-child-pwd'
import FormChildCompwd from 'components/form-child-compwd'

module.exports = {
  props:{
  	fatherclass:'',
    fatherinclass:'',
    labelname:'',
    iptplaceholder:'',
    modelpwd:''
  },
  components: {
    FormChildOldpwd,
    FormChildPwd,
    FormChildCompwd,
  },
  data() {
    return {
      placeholder:'',
      pwdtype:'password',
      oldpwd:'',
      oldpwderrormsg:'',
      pwd:'',
      pwderrormsg:'',
      compwd:'',
      compwderrormsg:'',
    }
  },
  events: {
    'children-showorhidepwd': function(){
        this.pwdtype == 'password' ? this.pwdtype = 'text' : this.pwdtype = 'password'; 
    },
    'children-oldpwd-check': function (oldpwderrormsg) {
        this.oldpwderrormsg = oldpwderrormsg;
    },
    'children-oldpwd': function (oldpwd) {
        this.oldpwd = oldpwd;
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
    'getOldpwdVal': function(){
        (this.modelpwd === 'oldpwd') && this.$broadcast("getChildrenOldpwdVal");
        (this.modelpwd === 'oldpwd') && this.$dispatch('child-oldpwd-check', this.oldpwderrormsg );
        (this.modelpwd === 'oldpwd') && this.$dispatch('child-oldpwd', this.oldpwd);
	   },
    'getPwdVal': function () {
        (this.modelpwd === 'pwd') && this.$broadcast("getChildrenPwdVal");
        (this.modelpwd === 'pwd') && this.$dispatch('child-pwd-check', this.pwderrormsg );
        (this.modelpwd === 'pwd') && this.$dispatch('child-pwd', this.pwd);
    },
    'getCompwdVal': function () {
        (this.modelpwd === 'compwd') && this.$broadcast("getChildrenCompwdVal");
        (this.modelpwd === 'compwd') && this.$dispatch('child-compwd-check', this.compwderrormsg );
        (this.modelpwd === 'compwd') && this.$dispatch('child-compwd', this.compwd);
    },
  }
}
</script>