define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var page = {};

  // data object转string 后进行encode的字符串
  page.init = function (data) {
    configBar();
    page.goods = JSON.parse(decodeURIComponent(data));   //解析获取到goods对象    
    page.goodsCount = getCartCountClever();
    var _self = this;
    var pageView = new page.PageView();

  };
  var configBar = function(){
    BAR.hide();
    $('body').removeClass().addClass('bg-gray');
    $('.bottombar').hide();
  };
  page.PageView = Backbone.View.extend({
    className: 'goodsdetails notopbar',
    events: {
      'click .js-minus-goods': 'minusGoods',
      'click .js-add-goods': 'addGoods',
      'click .js-buy-goods': 'buyGoods',
      'click .js-opt-pay-normal': 'payType',
      'click .js-addGoods-cart': 'addGoodsCart'
    },
    initialize: function () {
      var _self =this;
      $('.wraper').removeClass("has-")
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
        page.rockBanner();
      });
      this.render();
    },
    render: function () {
      var _self = this;
      getTpl('supermarket/goodsdetails', 'page', function (tpl) {
        if (tpl) {
          var html = juicer(tpl,{data:page.goods, goodsCount:page.goodsCount});
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    },
    minusGoods: function(){
      var num = Number($('.js-num-goods').text()) - 1;
      if (num<1) {
        $(".js-opt-normal").removeClass('hide');
        $(".js-opt-pay").addClass('hide');
        return;
      }
      $('.js-num-goods').text(num);
    },
    addGoods: function() {
      var num = Number($('.js-num-goods').text()) + 1;
      $('.js-num-goods').text(num);
    },
    // 立即购买
    buyGoods: function() {
      var num = $('.js-num-goods').text();
      var obj = page.goods.objectId;
      var str = "{\""+obj+"\":\""+num+"\"}";
      var params = JSON.parse(str);

      postJsonCX('/checkout', params, function(re){
        if (re.state) {
          var data = encodeURIComponent(JSON.stringify(re.data));
          location.href = "#params/order&"+data;
        }
      }, function(re){
        $.tips({content: re.msg});
      });

    },
    // 切换立即购买
    payType: function() {
      $(".js-opt-normal").addClass('hide');
      $(".js-opt-pay").removeClass('hide');
    },    
    // 加入购物车
    addGoodsCart: function() {
      var _self = this;
      customRequestCX('cart/shops/'+page.goods.shop.objectId+'/items/'+page.goods.objectId+'?embed=shops&_method=PUT&', "", function(re){
        if (re.state) {
          $.tips({content: "已经加入购物车"});
          var count = re.data.count;
          if (count) {
            var $imgwrap = $('.swiper-slide-active'),          
                $cart = $('.js-cart-goods'),
                w0 = 30;
            aniAddToCart($imgwrap, $cart, w0, function () {
                setCartCount(count);  
                $('.js-goods-count').text(getCartCountClever());
            })            
          }
        }
      }, function(re){
        $.tips({content: re.msg});
      }, 'POST');
    }
  });

  // 开始转动banner
  page.rockBanner = function() {
    var swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 0,
      loop: true,
      onSlideChangeEnd: function(swiper){
        var index = swiper.activeIndex;
        if (index < swiper.length) {
          index += 1;
        } else if (index == page.goods.images.length +1) {
          index = 1;
        } else if (index == 0) {
          index = page.goods.images.length;
        }
        $("#active-num").text(index);
      }
    });
  };

  return page;
});
