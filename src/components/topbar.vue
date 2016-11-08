<template>
	<h1 class="topbar" id="topbar">{{{text}}}</h1>
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

