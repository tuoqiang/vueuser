<template>
	<h1 class="topbar" :class="isvip ? 'topbar-vip' : ''" id="topbar">{{{text}}}</h1>
</template>


<script>
module.exports = {
  props:{
  	'text': '',
  	'isvip': '',
  }
}
</script>

