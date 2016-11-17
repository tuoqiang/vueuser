<template>
	<div id="form-group-1" class="form-group form-bortop">
		<div class="form-group-in j_err_iconbox" id="j_l_zh">
			<label for="email" class="label-email label-piccode">{{labelname}}</label>
			<input 	type="email" 
					class="form-control form-control-email form-control-w" 
					id="email" 
					name="email" 
					:placeholder="iptplaceholder" 
					value="{{ localaccount || account }}" 
					v-model="account" 
					
					/>
			<i 		class="icon icon01 icon-delete" 
					id="j-btn-clearInput" 
					v-show="account || localaccount" 
					@click=clearIpt></i>
		</div>
	</div>
</template>


<script>

import Utils from 'assets/js/utils.js'

module.exports = {
  props:{
  		localaccount:'',
      ismustphone:false, // 是否必填
      iptplaceholder:'',
      labelname:'',
      ismustemail:false,
      format:''
  },
  data() {
    return {
      account:'',
      errormsg:'',
    }
  },
  methods: {
    clearIpt: function () {
      this.account= '';
      this.localaccount= '';
    }
  },
  events: {
    'getIptVal': function(msg){
      this.errormsg = Utils.getCheckAccountErrMsg(( this.account || this.localaccount ), this.format);
      this.$dispatch('child-account-check', this.errormsg);
		  this.$dispatch('child-account', this.account || this.localaccount); 
  	},
  }
}
</script>
