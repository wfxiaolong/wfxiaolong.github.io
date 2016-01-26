define(['backbone', 'getTpl', 'juicer'], function (Backbone, getTpl, juicer) {
  var page = {};

  page.init = function (data) {
    configBar();
    page.shop = JSON.parse(decodeURIComponent(data));   //解析获取到goods对象
    var qdetailView = new page.qdetailView();

    juicer.register('toString16', function(data) {    // 转换字符串
      return data.toString(16);
    });
  };
  var configBar = function(){
    BAR.left('back', "返回", '');
    BAR.center("", "店铺详情", "");
    BAR.ell.click(function(){
      window.history.go(-1);
    });
    $('.bottombar').hide();
  };
  page.qdetailView = Backbone.View.extend({
    className: 'qqdetail',
    events: {
    },
    initialize: function () {
      var self =this;
      this.on('render:qdetail', function () {
        $('#loading').hide();
        $('.wraper').prepend(self.el);
      });
      this.render();
    },
    render: function () {
      var _self = this;
      getTpl('quickshop/detail', 'page', function (tpl) {
        if (tpl) {
          var html = juicer(tpl, {shop:page.shop});
          $(_self.el).html(html);
          _self.trigger('render:qdetail');
        }
      });
    },
  });

  return page;
});
