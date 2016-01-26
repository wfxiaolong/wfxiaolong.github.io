define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var page = {};

  page.init = function (data) {    
    configBar();
    var _self = this;
    page.data = JSON.parse(data);
    
    page.isLoadingMore = 0;

    var pageView = new page.PageView();    
  };
  var configBar = function(){
    $('.bottombar').hide();
    BAR.left('back', "返回", '');
    BAR.center("", "商品清单", "");
    BAR.ell.click(function(){
      window.history.go(-1);
    });
  };
  page.PageView = Backbone.View.extend({
    className: 'goodslist nobottombar',
    events: {
      
    },
    initialize: function () {
      var _self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
      });
      _self.render();
    },
    render: function () {
      var _self = this;
      getTpl('personal/myorderlist', 'page', function (tpl) {
        if (tpl) {
          console.log(page.data)
          var html = juicer(tpl, {data: page.data});
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    }    
  });
  return page;
});
