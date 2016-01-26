define(['backbone', 'getTpl', 'juicer'], function (Backbone, getTpl, juicer) {
  var page = {};

  page.init = function (category) {
    configBar();
    page.dataArr = [];
    page.category = category;
    var qsendView = new page.qsendView();

    juicer.register('toString16', function(data) {    // 转换字符串
      return data.toString(16);
    });
  };
  var configBar = function(){
    BAR.left('back', "返回", '');
    BAR.center("", "闪电送达", "");
    BAR.ell.click(function(){
      location.href = "#page/index";
    });
    $('.bottombar').hide();
  };
  page.qsendView = Backbone.View.extend({
    className: 'qsend',
    events: {
      'click .js-click-shop': 'shopDetail'
    },
    initialize: function () {
      var self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(self.el);
      });
      this.fetch();
    },
    fetch: function () {
      var _self = this;
      var params = {
        category : page.category
      };
      $('.ui-loading-block').toggleClass("show");
      getJsonCX("/shops", params, function(re){
        if(re.state) {
          page.dataArr = re.data;
          _self.render();
        }
      });
    },
    render: function () {
      var _self = this;
      getTpl('quickshop/send', 'page', function (tpl) {
        if (tpl) {
          var html = juicer(tpl, {data:page.dataArr});
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    },
    shopDetail: function (e) {
      var index = $(e.currentTarget).data('index');
      var object = encodeURIComponent(JSON.stringify(page.dataArr[index]));
      location.href = "#params/qshop&"+page.category+"&"+object;
    }

  });

  return page;
});
