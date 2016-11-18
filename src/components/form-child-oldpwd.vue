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
    'getChildrenOldpwdVal': function(){
      if(!this.pwd){ 
          this.errormsg='旧密码不能为空';
        }else{
          this.errormsg='';
        }
        this.$dispatch('children-oldpwd-check', this.errormsg);
        this.$dispatch('children-oldpwd', this.pwd);
    }
  }
}
</script>