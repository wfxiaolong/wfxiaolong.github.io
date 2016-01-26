define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var page = {};

  page.init = function (order) {
    var _self = this;

    configBar();
    page.order = JSON.parse(decodeURIComponent(order));

    var pageView = new page.PageView();
  };
  var configBar = function(){
    BAR.left('back', "返回", '').center("", "支付方式");
    BAR.ell.click(function(){
      window.history.go(-1);
    });
    $('.bottombar').hide();
  };
  page.PageView = Backbone.View.extend({
    className: 'payWay',
    events: {
      'click .js-type-order': 'typeOrder',
    },
    initialize: function () {
      var _self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
        $(' body').removeClass();
        $(' body').addClass('bg-gray');
        
      });
      this.render();
    },
    render: function () {
      var _self = this;
      getTpl('order/payWay', 'page', function (tpl) {
        if (tpl) {
          var data = page.order;
          
          _self.template = _self.template || juicer(tpl);
          var html = _self.template.render({data: data});
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    },
    typeOrder: function(e) {
      var _self = this;

      var dateNode = $(e.currentTarget),                    //li节点
          dateNodeParent = $(e.currentTarget.parentNode);   //ul节点
      var checkoutId = page.order.objectId,                 //订单ID
          paymentId = dateNodeParent.data('paymentid'),     //其实是哪家店的支付ID
          key = dateNode.data('key');                       //支付方式
      var url = '/checkout/' + checkoutId + '/payments/' + paymentId + '/' + key + '?&_method=PUT&';

      customRequestCX(url, '', function (re) {
        if (re.state) {
          console.log(re.data);
          page.order = re.data;
          _self.render();
        }
      }, '', 'POST');

    }
  });
  return page;
});
