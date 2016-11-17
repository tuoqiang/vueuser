<template>
  <div>
      <div id="goldrightscontainer" class="goldrightscontainer">
      <div id="goldrightsbox" class="goldrightsbox"></div>
      <div id="goldrightstips"  class="goldrightstips">点击领取赠送的黄金会员</div>
      <div id="goldrightsarrow" class="goldrightsarrow"></div>
    </div>
    <div id="goldrightsbtn" class="goldrightsbtn" :class="isvip ? 'goldrightsbtn_vip' : ''"><a id="goldrightsbtnA" class="j-pb-click" :data-href="gifturl" data-click="gold" data-block="gold" ></a></div> 
  </div>
	<!-- -->
</template>

<script>
module.exports = {
  props:{
  		gifturl:'',
      isvip:''
  },
  data() {
    return {
      isShowToast: '',
    }
  },
  methods: {
    gotoFindpwd: function () {
      window.location = "findpwd.html#findex";
    },
    hideToast: function () {
      this.isShowToast = false;
    },
  }
}
</script>
