define(['backbone', 'getTpl', 'juicer', 'frozen'], function (Backbone, getTpl, juicer, frozen) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var page = {};

  page.init = function () {
    configBar();
    page.dataArr = [];

    // 设置关键字
    page.keyword = "";

    // 设置历史记录
    page.storage = window.localStorage;
    page.storageKey = "DM_StoreGoodsSearchHistory";
    var history = page.storage.getItem(page.storageKey);
    if (history) {
      page.storageHistory = history.split(',');
    } else {
      page.storageHistory = [];
    }

    page.pageNum = 10;
    var pageView = new page.PageView();
    pageView.bindLoadMore();
  };
  var configBar = function(){
    BAR.clear().tab(0);
    BAR.left('back', "返回", '');
    BAR.center("", "搜索商品", "");
    BAR.ell.click(function(){
      location.href = "#page/index";
    });
    $('.bottombar').hide();
  };
  page.PageView = Backbone.View.extend({
    className: 'search',
    events: {
      'click .js-search': 'search',
      'click .js-clear-history': 'clear_history',
      'click .js-click-history': 'click_history',
      'click .js-goods-click': 'click_gooods'
    },
    initialize: function () {
      var self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(self.el);
      });
      this.render();
    },
    render: function () {
      var _self = this;
      getTpl('index/search', 'page', function (tpl) {
        if (tpl) {
          var html = juicer(tpl, {data:page.dataArr, history:page.storageHistory, keyword:page.keyword});
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    },
    fetch: function (key) {
      if (page.isLoadingMore == 1) return;
      page.isLoadingMore = 1;
      var _self = this;
      var offset = page.dataArr.length;
      var params = {
        keyword : key,
        shop: page.shopid,
        limit: page.pageNum,
        offset: offset
      };
      $('.ui-loading-block').toggleClass("show");
      getJsonCX("/items/search", params, function(re){
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
          if (!page.isLoadingMore && page.dataArr.length>0 && page.keyword != "") {
            self.fetch(page.keyword);
            self.trigger('scrollMore');
          }
        }
      });
    },

    // 搜搜
    search: function() {
      var key = $(".js-search-value").val();  // 设置搜索关键字
      // 加入历史记录
      if(!key) return;
      page.storageHistory.push(key);
      page.storage.setItem(page.storageKey, page.storageHistory);
      var _self = this;
      page.dataArr = [];
      page.keyword = key;
      _self.fetch(key);
    },
    // 清除历史记录
    clear_history: function () {
      page.storageHistory = [];
      page.storage.setItem(page.storageKey, []);
      var _self = this;
      _self.render();
    },
    // 点击历史记录搜索
    click_history: function(e) {
      var _self = this;
      var key = $(e.currentTarget).data('key');
      page.keyword = key;
      page.dataArr = [];
      _self.fetch(key);
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