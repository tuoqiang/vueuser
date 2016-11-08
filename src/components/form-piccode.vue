
<template>
	<div  class="form-group form-group-piccode form-group-bt" v-show='needpiccode'>
		<div class="form-group-in form-group-in-nnobor j_err_iconbox" id="j_l_code">
			<label for="piccode" class="label-piccode">验证码：</label>
			<input 	type="text" 
					class="form-control form-control-piccode"  
					name="piccode" 
					placeholder="请输入右侧验证码"
					value="{{ piccode }}" 
					v-model="piccode" 
					/>
			<i class="form-piccode" @click="updatePiccode">
				<img 	
					:src="piccodeUrl" 
					class="j-btn img-responsive j-pb-click"
					data-click="captcha">
			</i>
		</div >
	</div>
</template>


<script>
import Server from 'assets/js/server.js'

module.exports = {
  props:{
  		needpiccode:''
  },
  data() {
    return {
      piccode:'',
      piccodeUrl: Server.HOSTNAMES + 'apis/register/vcode.action?width=120&height=46'
    }
  },
  methods: {
    updatePiccode: function () {
    	this.$dispatch('updatePiccode');
    }
  },
  events: {
    'loginAction': function(){
		this.$dispatch('child-piccode', this.piccode); // 向父组件派发事件：把当前值传给父组件
  	},
  	'updatePiccode': function(){
		this.piccodeUrl = Server.HOSTNAMES + 'apis/register/vcode.action?width=120&height=46&t=' + (+new Date());
		this.piccode = '';
  	}
  }
}
</script>