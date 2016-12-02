<template>
	<div id="form-group-1" class="form-group form-bortop">
		<div class="form-group-in j_err_iconbox" id="j_l_zh">
			<label  for="email" class="label-email label-piccode">{{labelname}}</label>
			<input 	type="email" 
    					class="form-control form-control-email form-control-w" 
    					id="email" 
    					name="email" 
    					:placeholder="iptplaceholder" 
    					value="{{ localaccount || account }}" 
    					v-model="account" 
    					:readonly="readonly" />
			 <i 		class="icon icon01 icon-delete" 
    					id="j-btn-clearInput" 
    					v-show="account || localaccount" 
    					@click=clearIpt
              v-if='!readonly' >
       </i>
		</div>
	</div>
</template>

<script>
import Utils from 'assets/js/utils.js'

module.exports = {
  props:{
  		localaccount:'', // 本地存储中的账号
      iptplaceholder:'',
      labelname:'',
      format:'', // 格式要求
      readonly:'',
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
    'getAccountVal': function(msg){
      this.errormsg = Utils.getCheckAccountErrMsg(( this.account || this.localaccount ), this.format);
      this.$dispatch('child-account-check', this.errormsg);
		  this.$dispatch('child-account', this.account || this.localaccount); 
  	},
  }
}
</script>
