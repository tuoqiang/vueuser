<template>
  
      <input :type="pwdtype" 
              class="form-control" 
              placeholder="{{placeholder}}"
              value="{{ pwd }}" 
              v-model="pwd" 
              >
      <i class="icon icon-eye icon-passwd-see" 
          :class='pwdtype=="password" ? "icon-passwd-see" : ""' 
          @click="showPwd" 
          v-show="pwd.length>1"></i>
      
    
</template>


<script>

import Utils from 'assets/js/utils.js'

module.exports = {
  props:{
  	pwdtype:'',
    placeholder:'',
  },
  data() {
    return {
      pwd:'',
      errormsg:'',
    }
  },
  methods: {
    showPwd: function(){
      this.$dispatch('children-showorhidepwd');
    }
  },
  events: {
    'getPwdVal': function(){
      this.errormsg = Utils.getCheckPwdErrMsg(this.pwd);
    	this.$dispatch('children-pwd-check', this.errormsg);
	    this.$dispatch('children-pwd', this.pwd);
  	}
  }
}
</script>