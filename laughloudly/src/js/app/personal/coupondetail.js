define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var coupondetail = {};

  coupondetail.init = function (params) { 
    $('body').removeClass().addClass('bg-gray');
    configBar();
    function configBar () {
      BAR.left('back', '返回').center('', '现金券详情');
      BAR.ell.on('click', function(event) {
        history.back();        
      });
    }  
    $('.bottombar').hide(); 
    coupondetail.data = JSON.parse(params);   
    var pageView = new coupondetail.PageView();
  };
  coupondetail.PageView = Backbone.View.extend({
    className: 'coupondetail nobottombar',
    events: {
      // 'click .js_coupondetaildetail': 'coupondetaildetail'
    },
    initialize: function () {
      var _self = this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
      });
      this.render();  
    },
    render: function () {
      var _self = this;
      getTpl('personal/coupondetail', 'page', function (tpl) {
        if (tpl) { 
          var data = coupondetail.data;
          _self.template = _self.template || juicer(tpl);
          var html = _self.template.render(data)          
          $(_self.el).prepend(html);
          _self.trigger('render:page');
        }
      });
    }
  });


  return coupondetail;
});
