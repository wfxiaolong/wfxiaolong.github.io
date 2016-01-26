define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var payContent = {};
  payContent.data = {}

  payContent.init = function (data) {
    payContent.data = JSON.parse(decodeURIComponent(data));
    console.log(payContent.data)   
    var _self = this;
    var pageView = new payContent.PageView();
  };
  payContent.PageView = Backbone.View.extend({
    className: 'payContent',
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
      getTpl('order/payContent', 'page', function (tpl) {
        if (tpl) {
          _self.template = _self.template || juicer(tpl);
          var data = {data: payContent.data.bill};
          var html = _self.template.render(data)
          $(_self.el).html(html);
          _self.trigger('render:page');          
        }
      });
    }
  });
  return payContent;
});
