define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var orderEdit = {};

  orderEdit.init = function () {   
    var _self = this;
    var pageView = new orderEdit.PageView();
  };
  orderEdit.PageView = Backbone.View.extend({
    className: 'orderEdit',
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
      getTpl('order/orderEdit', 'page', function (tpl) {
        if (tpl) {
          $(_self.el).html(tpl);
          _self.trigger('render:page');
        }
      });
    }
  });
  return orderEdit;
});
