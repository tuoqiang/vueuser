<template>
  <a href="javascript:;" id="j-btn-login" class="btn form_btnpos {{{class}}}">{{{text}}}</a>
</template>

<script>

module.exports = {
  props:{
  	"text":{
  		type:String,
  		default:"登录"
  	},
    "class": ""
  }
}
</script>


<style scoped>
.btn_login{
background:#04BE02;
color:#fff;
display:block;
height:45px;
text-align:center;
line-height:45px;
border-radius:10px;
margin-top:25px
}
</style>
