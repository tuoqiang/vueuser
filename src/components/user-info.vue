<template>
  <div>
        <a  
            href="javascript:;" 
            class="userinfo j-pb-click"
            :data-href="PB.href" 
            :data-click="PB.click" 
            :data-block="PB.block" >
              <p  class="user-name user-status color-01">
                  {{username}}
              </p>
              <p  class="user-status color-01 user-hidetxt">
                  {{userstatus}}
              </p>
              <i  class="arrow-r vertical-center"></i>
              <img 
                  :src="userphoto" 
                  class="user-avatar" >
        </a>
  </div>
</template>

<script>
module.exports = {
  props:{
    username:'',
    userstatus:'',
    userphoto:'',
  },
  data() {
    return {  
        PB:{
          href:'setting.html',
          click:'icon',
          block:'loginsuc',
        },
    }
  },
}
</script>
