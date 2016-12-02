<template>
  <div >
    <div class="pwd-title-step" :class="processclass">
      <div class="pwd-process pwd-process-1">1.{{firstttext}}</div>
      <div class="pwd-process pwd-process-2">2.验证</div>
      <div class="pwd-process pwd-process-3">3.完成</div>
    </div>  
  </div>
</template>

<script>

module.exports = {
  props:{
  	firstttext:'',
    processclass:'',
  },
}
</script>