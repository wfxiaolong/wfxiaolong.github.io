define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var classify = {};
  classify.dataArr = [];

  classify.init = function () {     
    classify.load_all = false;    
    configBar(); 
    var data = {shops: localStorage.DM_shopId };
    getJsonX('/categories', data, function (re) {
      if(re.state){  
        classify.dataArr = re.data;
        var pageView = new classify.PageView(); 
      }
    })  
  };

  function configBar (){
    BAR.tab(1).center('', '校呵呵手机超市').right('search');
    BAR.elr.on('click', function(event) {
      location.href = "#params/search";      
    });        
  }

  classify.PageView = Backbone.View.extend({
    className: 'classify bg-white',
    events: {
      'click #box_classify li': 'changeItems',
      'click #box_items .js_buy': 'joinToCart',
      'scroll .goods-list-wrap': 'loadMore',
      'click .js-goods-click': 'clickGoodsDetail'
    },
    initialize: function () { 
      var _self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
        _self.bindLoadMore();
      });

      this.render();
    },
    render: function () {
      var _self = this;
      getTpl('supermarket/classify', 'page', function (tpl) {
        if (tpl) {  
          _self.$el.html(tpl)           
          _self.trigger('render:page');
          _self.renderCategories();
        }
      });      
    },  
    renderCategories: function () {
      var tpl = $('#tm_classify').html();
      var html = juicer(tpl, {data: classify.dataArr});
      $("#box_classify").html(html);
      $("#box_classify li").eq(0).click().click();      // 初步断定是：异步加载的问题，先这么无聊的处理。。。
    },
    getItems: function(data){
      var _self = this; 
      $('#crazyLoad').addClass('show');
      getJsonX('items', data , function (re) {
        if(re.state){  
          var data =  re.data;
          if(data.length){
            var tpl = $('#tm_items').html();           
            var html = juicer(tpl, {data: data});                      
            $("#box_items").append(html);
            $('#crazyLoad').removeClass('show');
            classify.data.arr = classify.data.arr.concat(data);
          }else{              
              _self.$('.loadmore').html('已加载全部');
              $('#crazyLoad').removeClass('show');
              classify.load_all = true;               
          }                  
        }
      })      
    },
    changeItems: function(e){
      var _self = this;
      var categoryID = $(e.currentTarget).find('a').data('categoryid');
      classify.data = {
        shop: localStorage.DM_shopId,        
        offset: 0,  // 从第几条记录开始
        limit: 10,   // 取多少条记录
        arr:[]      // 数据集合
      };
      classify.load_all = false;
      $("#box_items, .loadmore").html('');
      $(e.currentTarget).addClass('active').siblings().removeClass('active');      
      _self.getItems(classify.data);
    },    
    joinToCart: function(e){     
      var _self = this;  
      var itemid = $(e.currentTarget).data('id');
      var index = $(e.currentTarget).data('index');      
      customRequestCX('cart/shops/'+ localStorage.DM_shopId +'/items/'+ itemid +'?embed=shops&_method=PUT&', "", function(re){
        if (re.state) {  
          $.tips({content: "已经加入购物车"});          
          var count = re.data.count;
          if (count) {
            var $imgwrap = $('#box_items li').eq(index).find('.img-wrap'), 
                $cart = $('.bottombar .icon-cartfill'),
                w0 = 30;
            // 加入购物车动画 参数：原图片盒子，购物车，动画图片宽度，动画执行完回调函数
            aniAddToCart($imgwrap, $cart, w0, function () {                
                setCartCount(count);  
                $('.bottombar li').eq(2).attr('data-msg', count);
            })
          }
        }
      }, '', 'POST');
    },
    bindLoadMore: function () { // 滚动到底部加载更多
      var _self = this;
      _self.on('scrollMore', function () {
        _self.$('.loadmore').html('正在加载...');
        $('#crazyLoad').addClass('show');
        classify.data.offset = classify.data.limit + classify.data.offset + 1;
        _self.getItems(classify.data);
      });      

      $(window).on('scroll', function () {
        var scrollTop = $(this).scrollTop();
        var winHeight = $(this).height();
        var docHeight = $(document).height();

        if (scrollTop + winHeight + 10 > docHeight && !classify.load_all) {          
          _self.trigger('scrollMore');
        }
      });
    },
    unbindLoadMore: function () {
      $(window).off('scroll');
    },

    // 查看商品详情
    clickGoodsDetail: function(e) {
      var index = $(e.currentTarget).data('index');
      var goods = classify.data.arr[index];
      location.href = "#params/goodsdetails&"+encodeURIComponent(JSON.stringify(goods));
    }
  });
  return classify;
});
