<template>
	<div v-show="isShowToast">
		<div class="toastcover" id="toastcover" ></div>
		<div class="toastcontaner" id="toastcontaner">
			<div class="toastcontent">
				{{{content}}}
			</div>
			<div id="toastbtnbox" class="toastbtnbox">
				<div v-if="comformbtntxt" class="toastbtn j-pb-click j-btn" @click="gotoFindpwd">
					{{comformbtntxt}}
				</div>
				<div  class="toastbtn j-pb-click j-btn " :class="comformbtntxt ? 'toastbtn-left' : 'toastbtnonly'" @click="hideToast">
					{{cancelbtntxt}}
				</div>
			</div>
		</div>
	<div>
</template>

<script>
module.exports = {
  props:{
  		content:'',
  		comformbtntxt:'',
  		cancelbtntxt:'',
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
