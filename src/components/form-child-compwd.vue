<template>
  
    <input 
        :type="pwdtype" 
        class="form-control" 
        placeholder="{{placeholder}}"
        value="{{ pwd }}" 
        v-model="pwd" >
    <i  class="icon icon-eye icon-passwd-see" 
        @click="showPwd" 
        :class='pwdtype=="password" ? "icon-passwd-see" : ""' 
        v-show="pwd.length>1" >
    </i>
    
</template>

<script>
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
    'getChildrenCompwdVal': function(){
      if(!this.pwd){ 
          this.errormsg='确认密码不能为空';
        }else{
          this.errormsg='';
        }
        this.$dispatch('children-compwd-check', this.errormsg);
        this.$dispatch('children-compwd', this.pwd);
    }
  }
}
</script>