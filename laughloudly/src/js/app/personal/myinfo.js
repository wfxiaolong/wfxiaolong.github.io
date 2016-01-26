define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var myinfo = {};
  myinfo.data = {};

  myinfo.init = function () {    
    var _self = this;
    $('body').removeClass().addClass('bg-gray');
    configBar(); 
    var pageView = new myinfo.PageView();
  };

  function configBar (){
    BAR.center('', '我的账户').left('back', '返回'); 
    BAR.ell.on('click', function(event) {
      history.back();      
    });     
  };

  myinfo.PageView = Backbone.View.extend({
    className: 'myinfo',
    events: {
      //'click .js-type-order': 'typeOrder',
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
      getTpl('personal/myinfo', 'page', function (tpl) {
        if (tpl) {
          _self.template = _self.template || juicer(tpl);
          var html = _self.template.render({data: myinfo.data})
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    }
  });
  return myinfo;
});
