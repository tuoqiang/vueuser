<template>
	<div   v-show="(pwderrorcount >= 2 || isregistered) && isshowtoast " >
		<div class="toastcover"></div>
		<div class="toastcontaner">
			<div class="toastcontent">
				{{{content}}}
			</div>
			<div  class="toastbtnbox">
				<div 
              v-if="comformbtntxt" 
              class="toastbtn j-pb-click j-btn" 
              data-click="ok" 
              data-block="forgot" 
              @click="gotoFindpwd"  >
					       {{comformbtntxt}}
				</div>
				<div  
              class="toastbtn j-pb-click j-btn " 
              data-click="cancel" 
              data-block="forgot" 
              :class="comformbtntxt ? 'toastbtn-left' : 'toastbtnonly'" 
              @click="hideToast"  >
      					{{cancelbtntxt}}
      	</div>
			</div>
		</div>
	<div>
</template>

<script>
import Pingback from 'assets/js/pingback.js'
module.exports = {
  props:{
  		content:'',
  		comformbtntxt:'',
  		cancelbtntxt:'',
    	pwderrorcount:0,
    	isregistered:false,
  },
  data() {
      return {     
          isshowtoast:false,
      }
  },
  methods: {
    gotoFindpwd: function () {
      window.location = "findpwd.html#findex";
    },
    hideToast: function () {
      this.isshowtoast = false;
    },
  },
  events: {
    'sendToastShowPb': function(){
     	console.log('this.pwderrorcount = ' + this.pwderrorcount);
     	this.isshowtoast = true;
     	Pingback.pageLoaded('forgot');
     }
  }
}
</script>
