<template>
    <div>
          <div class="goldrightscontainer">
          <div class="goldrightsbox"></div>
          <div class="goldrightstips">点击领取赠送的黄金会员</div>
          <div class="goldrightsarrow"></div>
    </div>
    <div 
          class="goldrightsbtn" 
          :class="isvip ? 'goldrightsbtn_vip' : ''" >
              <a  
                class="j-pb-click" 
                :data-href="gifturl" 
                data-click="gold" 
                data-block="gold" >
              </a>
    </div> 
  </div>
</template>

<script>
module.exports = {
  props:{
  		gifturl:'',
      isvip:false
  }
}
</script>
