<template>
	<div id="login_guide" class="login_guide">{{{text}}}</div>
</template>


<script>
module.exports = {
  props:{
  	"text":{
  		type:String,
  		default:""
  	}
  }
}
</script>
