<template>
  <a href="javascript:;"
  	 class="btn form_btnpos j-pb-click"  
     :class = "btnclass"
  	 :data-href="datahref"
  	 :data-click="dataclick"
  	 >
  	 {{btntext}}
  </a>
</template>


<script>
module.exports = {
  props:{
  	'btntext':'',
    'btnclass': '',
    'datahref':'',
    'dataclick':'',
  }
}
</script>
