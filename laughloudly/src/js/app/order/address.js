define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var address = {};

  address.init = function () {   
    var _self = this;
    var pageView = new address.PageView();
  };
  address.PageView = Backbone.View.extend({
    className: 'address',
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
      getTpl('order/address', 'page', function (tpl) {
        if (tpl) {
          $(_self.el).html(tpl);
          _self.trigger('render:page');
        }
      });
    }
  });
  return address;
});
