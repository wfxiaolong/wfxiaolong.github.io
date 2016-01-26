define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var Faq = {};
  Faq.data = {};

  Faq.init = function () {    
    var _self = this;
    $('body').removeClass().addClass('bg-gray');
    configBar(); 
    var pageView = new Faq.PageView();
  };

  function configBar (){
    BAR.center('', '常见问题').left('back', '返回'); 
    BAR.ell.on('click', function(event) {
      history.back();      
    });     
  };

  Faq.PageView = Backbone.View.extend({
    className: 'Faq',
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
      getTpl('personal/faq', 'page', function (tpl) {
        if (tpl) {
          _self.template = _self.template || juicer(tpl);
          var html = _self.template.render({data: Faq.data})
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    }
  });
  return Faq;
});
