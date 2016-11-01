<template>
	<h1 class="topbar" id="topbar">{{{text}}}</h1>
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
