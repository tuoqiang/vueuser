<template>
  	<topbar text="个人中心" :isvip="isvip"></topbar>
    <error-msg 
        :errmsg='errmsg' 
        v-if="errmsg">
    </error-msg>
    <user-info 
        :username="username" 
        :username="username" 
        :userstatus="userstatus" 
        :userphoto="userphoto" >
    </user-info>
    <profile-bg 
        :imgsrc="viprightimg.url" 
        :imgalt="viprightimg.alt">
    </profile-bg>
    <button-common 
        btnclass="btn-openvip j-gold" 
        :btntext="btn.btntext" 
        :datahref="btn.datahref">
    </button-common>  
    <toast  
        content="只差一步<br>请在电视上输入激活码"
        cancelbtntxt="知道啦"
        v-if="isvipact.isshow">   
    </toast>
    <gift-vip 
        @click="hideGiftBox" 
        v-if="giftvip.isshow" 
        :isvip="isvip" 
        :gifturl="giftvip.gifturl">
    </gift-vip>
</template>

<script>
import Lib from 'assets/js/lib.js'
import Utils from 'assets/js/utils.js'
import Config from 'assets/js/config.js'
import Server from 'assets/js/server.js'
import Storage from 'assets/js/storage.js'
import Pingback from 'assets/js/pingback.js'
import ButtonCommon from 'components/button-common'
import ErrorMsg from 'components/error-msg'
import Topbar from 'components/topbar'
import Toast from 'components/toast'
import UserInfo from 'components/user-info'
import GiftVip from 'components/gift-vip'
import ProfileBg from 'components/profile-bg'

export default {
  data() {
      return {     
          isvip: false,                // 是否是vip
          username: 'GITV_',             // 用户名
          userstatus: '',             // 用户状态
          userphoto: '',              // 用户头像
          errmsg:'',                // 错误文案
          btn: {                    // 按钮文案和链接
            datahref:'',
            btntext:''
          },
          viprightimg: {            // 底图
            url: '',
            alt: ''
          },
          isvipact: {             // F项目需求
            act: '',
            isshow:false
          },
          giftvip:{               // 领取黄金权益
            giftviptimerId:null,
            gifturl:'',
            isshow:false,
          }
      }
  },
  components: {
    	ButtonCommon,
    	Topbar,
      ErrorMsg,
      Toast,
      GiftVip,
      UserInfo,
      ProfileBg,
  },
  ready: function(){
  	  console.log('ready run');
      var self = this;
      var timer = null;
      var vipRightImgArr = [];
      var btnText = {
        'becomeVip' : '成为会员',
        'addFee' : '续费',
        'newQiyiVip' : '新会员首月15元'
      }
      var authCookie = Utils.getAuthCookie();
      !authCookie && Utils.openPageByName('login');
      Server.getUserInfo(self, { authcookie: authCookie, fields: 'userinfo,qiyi_vip,tv_vip_info'}).then(function(res){
        console.log('Server.getUserInfo request success');
        var userinfo = res.userinfo;
        var vipinfo = Utils.stringToInt(res.qiyi_vip_info);
        var tvinfo = Utils.stringToInt(res.tv_vip_info);
        var tvVersion = Utils.getTvVersion(localStorage.getItem('versionApk')) || 6.4; // 当前两位版本号(在没有值得情况下暂时定为5.4)
        var userType = Utils.getUserTpye(res); 
        var vip = self.isvip = Utils.isVip(userType, tvVersion);
        var stopVip = Utils.isStopVip(userType);
        var protype = parseInt(Storage.getSessionStorage('proType')); 
        var avatar = vip ? 'avatarvip' : 'avatar';              // 显示用户头像，会员和非会员
        var ui = Utils.getUi(Utils.hasVipInfo(res));            // ui=0：未购买过荔枝VIP或未登录；ui=1：已购买过荔枝VIP 

        console.log('vip = ' + vip);
        console.log('stopVip = ' + stopVip); 

        Server.fetchConfig(self).then(function(res){  // 获取config.js中的配置数据
          vipRightImgArr = Utils.setVipRightsImg(ui, res);
          self.viprightimg.url = vipRightImgArr[0];
          self.viprightimg.alt = vipRightImgArr[1];
        },function(failRes){});
        
        self.username += !!userinfo.phone ? (userinfo.phone.substring(0, 3) + '****' + userinfo.phone.substring(7)) : (userinfo.nickname);
        self.userstatus = (stopVip ? '帐号存在安全风险，请修改密码或联系客服' : (!!protype ? Utils.showPageTipsBeforeFive(protype) : Utils.showPageTipsAfterFive(tvinfo)));
        self.userphoto = 'http://static.ptqy.gitv.tv/tv/user/images/' + avatar + '.png';  // 显示用户头像，会员和非会员
        self.btn.btntext = (ui === 0 ? btnText.newQiyiVip : (vip ? btnText.addFee : btnText.becomeVip));
        self.btn.datahref = Utils.getVipUrl(tvVersion, userType);
        self.isvipact.act = (Storage.getSessionStorage(Utils.URL_PARAMS) && Storage.getSessionStorage(Utils.URL_PARAMS).isvipact); // 如果存在isvipact，则肯定来自F项目（含激活流程）的二维码页
        console.log('Storage.getSessionStorage(Utils.URL_PARAMS).isvipact=' + self.isvipact.act );
       
        !stopVip && setTimeout(function(){Utils.showPageTipsAfterFive(tvinfo);}, 5000); // 5s后文案变化
        !Storage.getSessionStorage('vipacttoast') && self.$dispatch('showActBox');      // F项目弹框
        
        (function fetchGiftVip() {
            Server.getGiftVip(self ,{ P00001: authCookie, platform: '8126425670975517' })
            .then(function(res) {
              console.log('Server.getGiftVip request success');
              if(res.code === 'A00000'){ // 只要返回A00000，肯定就还没有领取
                self.giftvip.isshow = true;
                self.giftvip.gifturl = res.data.gift_receive_url;
                self.giftvip.giftviptimerId = setTimeout(fetchGiftVip, 540000);
              }else{
                clearTimeout(self.giftvip.giftviptimerId);
              }
            }, function(res) {
                console.log('Server.getGiftVip request fail');
                self.errmsg = Utils.showErrorMsg(res);   
            });
        })();  

        Utils.setEvents();
        Pingback.init('account', userinfo.uid, userType);   // 如果用户未开通过vip, 传-1值
        Pingback.pageLoaded('loginsuc', ui);         
      },function(res){
          console.log('Server.getUserInfo request fail');
          self.errmsg = Utils.showErrorMsg(res); 
          Pingback.errLogger(e.code, 'loginsuc');
      });
  },
  methods: {
      hideGiftBox: function(){
          this.giftvip.isshow = false;
      },
  },
  events: {
    'showActBox': function(){
        if(this.isvipact.act == 1){                    // isvipac可能取值0:没有权益;  1:有权益未激活。
          console.log('showActBox =' + this.isvipact.act);
          Storage.setSessionStorage('vipacttoast', 1); // 确保在当前会话级页面中toast只弹一次，种个本地存储
          this.isvipact.isshow = true;
        }
    }
  }  
}
</script>