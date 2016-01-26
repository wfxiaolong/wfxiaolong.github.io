define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var Serve = {};
  Serve.data = {};

  Serve.init = function () {    
    var _self = this;    
    configBar();
    var pageView = new Serve.PageView(); 
  };

  function configBar (){
    BAR.center('', '推荐有礼').left('back', '返回'); 
    BAR.ell.on('click', function(event) {
      history.back();      
    });     
  };

  Serve.PageView = Backbone.View.extend({
    className: 'Serve',
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
      getTpl('personal/share', 'page', function (tpl) {
        if (tpl) {

          $(_self.el).html(tpl);
          _self.trigger('render:page');
        }
      });
    }
  });
  return Serve;
});
