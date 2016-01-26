define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var page = {};

  page.init = function (category, data) {
    configBar();
    var _self = this;
    page.category = category;

    page.pageNum = 10;
    page.dataArr = [];
    page.isLoadingMore = 0;

    var pageView = new page.PageView();
    pageView.bindLoadMore();
  };
  var configBar = function(){
    $('.bottombar').hide();
    // 若用户没有定位过学校，则不能离开当前页面
    BAR.left('back', "返回", '');
    BAR.center("", "商品清单", "");
    BAR.ell.click(function(){
      window.history.go(-1);
    });
  };
  page.PageView = Backbone.View.extend({
    className: 'goodslist',
    events: {
      'click .js-goods-click': 'click_gooods'
    },
    initialize: function () {
      var _self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
      });
      _self.fetch();
    },
    render: function () {
      var _self = this;
      getTpl('supermarket/goodslist', 'page', function (tpl) {
        if (tpl) {
          var html = juicer(tpl, {data:page.dataArr});
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    },
    fetch: function () {
      if (page.isLoadingMore == 1) return;
      page.isLoadingMore = 1;
      var _self = this;
      var offset = page.dataArr.length;
      var params = {
        categories : page.category,
        limit: page.pageNum,
        offset: offset
      };
      $('.ui-loading-block').toggleClass("show");
      getJsonCXS("/items", params, function(re){
        $('.ui-loading-block').toggleClass("show");
        page.isLoadingMore = 0;
        if(re.state) {
          page.dataArr = page.dataArr.concat(re.data);
          _self.render();
          if (re.data.length < page.pageNum) {
            _self.trigger('getData:end');
            page.isLoadingMore = 2;
          }
        }
      }, function(){
        $('.ui-loading-block').toggleClass("show");
        page.isLoadingMore = 0;
      });
    },
    // read more
    bindLoadMore: function () { // 滚动到底部加载更多
      var self = this;
      self.on('scrollMore', function () {
        $('.loadmore').html('正在加载...');
      });
      self.on('getData:end', function () {
        $('.loadmore').html('已加载全部');
      });
      $(window).on('scroll', function () {
        var scrollTop = $(this).scrollTop();
        var winHeight = $(this).height();
        var docHeight = $(document).height();

        if (scrollTop + winHeight + 10 > docHeight) {
          if (!page.isLoadingMore && page.dataArr.length>0) {
            self.fetch();
            self.trigger('scrollMore');
          }
        }
      });
    },

    // 点击商品查看详情
    click_gooods: function(e) {
      var index = $(e.currentTarget).data('index');
      var goods = page.dataArr[index];
      location.href = "#params/goodsdetails&"+encodeURIComponent(JSON.stringify(goods));
    }
  });
  return page;
});
