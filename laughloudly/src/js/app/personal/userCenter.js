define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var userCenter = {};
  userCenter.data = {};

  userCenter.init = function () {    
    var _self = this;
    $('body').removeClass().addClass('bg-gray');
    configBar(); 
    function configBar (){
      BAR.tab(3).center('', '个人中心');
    }

    userCenter.data.tel = localStorage.DM_PhoneNum;

    var data = {campus: localStorage.DM_schoolId};
    getJsonX('/coupons/count', data, function (re) {
      if(re.state){
        userCenter.data = $.extend(userCenter.data, re.data);
        getJsonX('/orders/count', data, function (re) {
          if(re.state){
            userCenter.data = $.extend(userCenter.data, re.data);
            getJsonX('/points', data, function (re) {
              if(re.state){
                if(re.data.length){
                  userCenter.data = $.extend(userCenter.data, {points: re.data[0].total});
                  var pageView = new userCenter.PageView(); 
                }else{
                  userCenter.data = $.extend(userCenter.data, {points: 0});
                  var pageView = new userCenter.PageView();
                }                               
              }else{
                var pageView = new userCenter.PageView();
              }
            }) 
          }else{
            var pageView = new userCenter.PageView();
          }
        }) 
      }else{    
        var pageView = new userCenter.PageView();
      }
    }) 

  };
  userCenter.PageView = Backbone.View.extend({
    className: 'userCenter',
    events: {
      'click .js-login'      : 'login',
      'click .js-quit'       : 'quit',
      'click .js-mana-addr'  : 'manaAddress'    
    },
    initialize: function () {
      var _self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
      });
      this.render();  
    },
    render: function () {
      var _self = this;
      getTpl('personal/user_center', 'page', function (tpl) {
        if (tpl) {
          _self.template = _self.template || juicer(tpl);
          var html = _self.template.render({data: userCenter.data})
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    },
    login: function () {
      location.href = "#page/login"
    },
    quit: function () { 
      var _self = this;
      var dialog = $.dialog({
        content:'确定要退出登录么？',
        button:["不了", "退出登录"]
      });

      dialog.on("dialog:action",function(e){
        if(e.index == 1) {
          userCenter.data.tel = '';
          localStorage.removeItem('DM_PhoneNum');
          _self.render();
        } 
      });

    },
    manaAddress: function() {
      location.href = '#page/manaAddress';
    }
  });
  return userCenter;
});
