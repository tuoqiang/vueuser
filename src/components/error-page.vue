<template>
	<div class="mark mark-white">
		<div class="mark-content">
			<p class="bounceInDown animated">{{errorpage}}</p>
		</div>
	</div>
</template>


<script>
module.exports = {
  props:{
  	'errorpage':''
  }
}
</script>
