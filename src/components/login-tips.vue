<template>
	<div id="login_guide" class="login_guide">{{{text}}}</div>
</template>


<script>

import Lib from 'assets/Lib.js'

module.exports = {
  props:{
  	"text":{
  		type:String,
  		default:""
  	}
  }
}

</script>


<style scoped>

</style>
