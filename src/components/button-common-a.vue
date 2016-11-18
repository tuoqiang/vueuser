<template>
  <a href="javascript:;" :data-href="datahref" class="btn-w btn-mdfpwd j-pb-click color-01 {{btnclass}}" >
    {{btntext}}
    <i class="arrow-r vertical-center"></i>
  </a>
</template>


<script>
module.exports = {
  props:{
  	'btntext':'',
    'btnclass': '',
    'datahref':''
  }
}
</script>
