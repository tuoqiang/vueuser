<template>
  <div class="vip-container" id="j-vip-container">
      <div class="vip-privilege">
        <img id="j-viprights-img" class="img-responsive" :src="imgsrc" :alt="imgalt">
      </div>
      <!-- button 开通会员或续费 -->
      
    </div>
	<!-- -->
</template>

<script>
module.exports = {
  props:{
  		imgsrc:'',
      imgalt:'',
  },
}
</script>
