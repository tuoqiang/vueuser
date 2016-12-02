<template>
  <a 
      href="javascript:;" 
      class="btn-w btn-mdfpwd j-pb-click color-01" 
      :data-href="datahref" 
      :data-click="dataclick" 
      :data-block="datablock"  
      :class="btnclass">
          {{btntext}}
          <i class="arrow-r vertical-center"></i>
  </a>
</template>

<script>
module.exports = {
  props:{
  	'btntext':'',
    'btnclass': '',
    'datahref': '',
    'dataclick': '',
    'datablock': '',
   }
}
</script>
