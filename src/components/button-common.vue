<template>
  <a href="javascript:;" id="j-btn-login" class="btn form_btnpos {{btnclass}}">{{btntext}}</a>
</template>


<script>
module.exports = {
  props:{
  	'btntext':'',
    'btnclass': ''
  }
}
</script>
