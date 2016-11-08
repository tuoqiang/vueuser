<template>
	<div id="form-group-1" class="form-group form-bortop">
		<div class="form-group-in j_err_iconbox" id="j_l_zh">
			<label for="email" class="label-email label-piccode">帐&nbsp;&nbsp;&nbsp;&nbsp;号：</label>
			<input 	type="email" 
					class="form-control form-control-email form-control-w" 
					id="email" 
					name="email" 
					placeholder="手机号/邮箱" 
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
module.exports = {
  props:{
  		localaccount:''
  },
  data() {
    return {
      account:''
    }
  },
  methods: {
    clearIpt: function () {
      this.account= '';
      this.localaccount= '';
    }
  },
  events: {
    'loginAction': function(msg){
		this.$dispatch('child-account', this.account || this.localaccount)
  	}
  }
}
</script>
