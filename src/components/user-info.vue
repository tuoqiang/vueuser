<template>
  <div>
      <a  href="javascript:;" :data-href="PB.href" :data-click="PB.click" :data-block="PB.block"  class="userinfo j-pb-click" >
        <p class="user-name user-status color-01" id="j-username">{{username}}</p>
        <p class="user-status color-01 user-hidetxt" id="j-userstatus">{{userstatus}}</p>
        <i class="arrow-r vertical-center"></i>
        <img :src="userphoto" class="user-avatar" alt="">
      </a>
  </div>
	<!-- -->
</template>

<script>
import Utils from 'assets/js/utils.js'

module.exports = {
  data() {
    return {  
        PB:{
          href:'setting.html',
          click:'icon',
          block:'loginsuc',
        },
    }
  },
  props:{
		username:'',
    userstatus:'',
    userphoto:'',
     
  },
  methods: {
  },
  
}
</script>
