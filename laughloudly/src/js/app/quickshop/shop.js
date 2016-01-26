define(['backbone', 'getTpl', 'juicer'], function (Backbone, getTpl, juicer) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var page = {};

  page.init = function (windowsId, data) {
    configBar();
    page.windowsId = windowsId;
    page.shop = JSON.parse(decodeURIComponent(data));   //解析获取到goods对象

    page.currentCategory = "";
    page.dataArr = [];
    page.numberPage = 1000;  //不做下拉刷新了

    var qshopView = new page.qshopView();

    juicer.register('toString16', function(data) {    // 转换字符串
      return data.toString(16);
    });
  };
  var configBar = function(){
    $('.topbar, .bottombar').hide();
    $('.bottombar').hide();
  };
  page.qshopView = Backbone.View.extend({
    className: 'qshop notopbar',
    events: {
      'click .js-back': 'goback',
      'click .js-shop-detail': 'shopDetail',
      'click .js-category-click': 'fetchGoods',
      'click .js-goods-click': 'click_gooods'
    },
    initialize: function () {
      var self =this;
      this.on('render:qshop', function () {
        $('#loading').hide();
        $('.wraper').prepend(self.el);
      });
      this.fetch();
    },
    render: function () {
      var _self = this;
      getTpl('quickshop/shop', 'page', function (tpl) {
        if (tpl) {
          var html = juicer(tpl,{shop: page.shop, shopTime:page.shopTime, shopCategory:page.shopCategory, goods:page.dataArr, currentCategory:page.currentCategory});
          $(_self.el).html(html);
          _self.trigger('render:qshop');
        }
      });
    },
    // 获取商品售货时间
    fetch: function() {
      var _self = this;
      var params = '/shops/'+page.shop.objectId+'/delivery';
      getJsonCX(params, '', function(re){
        if(re.state){
          page.shopTime = "";
          for(var i=0;i<re.data.length;i++) {
            if(i == 0){
              page.shopTime += re.data[i];
            } else {
              page.shopTime += " "+re.data[i];
            }
          }
        }
        // 获取商品分类
        var param = new Object();
        param.shops = page.shop.objectId;
        getJsonX('/categories', param, function(cate){
          if (cate.state) {
            if (cate.data.length == 0) {
              var object = new Object();
              object.name = "全部";
              object.objectId = "";
              page.shopCategory = [object];
            } else {
              page.shopCategory = cate.data;
            }
          }
          _self.render();
          // 获取第一个商品分类的商品列表
          _self.fetchGoods();
        }, function(){
          $.tips({content: "获取不到商店的分类信息"});
        });
      }, function(){
        $.tips({content: "获取不到商店的售货时间"});
      });
    },
    shopDetail: function() {
      var value = encodeURIComponent(JSON.stringify(page.shop));
      location.href = "#params/qdetail&"+value;
    },
    /// 获取商品请求
    fetchGoods: function(e){
      page.isLoadingMore = 1;
      var _self = this;
      var requestParams = new Object();
      if (e) {
        // 重新选择分类
        page.dataArr = [];
        requestParams.categories = $(e.currentTarget).data('id');
        page.currentCategory = $(e.currentTarget).data('id');
      } else {
        // 默认获取第一个分类信息，或者下拉刷新，如果没有则返回
        if (page.shopCategory.length == 0) return;
        if (!page.currentCategory) {
          page.currentCategory = page.shopCategory[0].objectId;
          if (page.currentCategory)requestParams.categories = page.currentCategory;
        }
      }
      requestParams.shop = page.shop.objectId;
      requestParams.offset = page.dataArr.length;
      requestParams.limit = page.numberPage;
      getJsonCX('/items', requestParams, function(re){
        page.isLoadingMore = 0;
        if (re.state) {
          page.dataArr =  re.data;
        }
        _self.render();
      }, function(){
        page.isLoadingMore = 0;
        $.tips({content: "获取不到商店的商品"});
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
