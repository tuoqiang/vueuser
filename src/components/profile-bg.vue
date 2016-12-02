<template>
  <div class="vip-container">
      <div class="vip-privilege">
        <img 
              class="img-responsive" 
              :src="imgsrc" 
              :alt="imgalt" >
      </div>
    </div>
</template>

<script>
module.exports = {
  props:{
  		imgsrc:'',
      imgalt:'',
  },
}
</script>
