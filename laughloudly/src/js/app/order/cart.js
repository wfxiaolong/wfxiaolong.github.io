define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  var page = {};

  page.init = function () {
    var _self = this;
    var pageView = new page.PageView();
    configBar();
  };
  function configBar (){
    BAR.tab(2).center('', '购物车');
  }
  page.PageView = Backbone.View.extend({
    className: 'cart hassurebar',
    events: {
      //'click .js-type-order': 'typeOrder',
      'click .js-btn-pay': 'btnPay',
      'click .js-class-edit': 'btnEdit',
      'click .js-goods-del': 'btnGoodsDel',
      'click .js-goods-count': 'btnGoodsChangeCount',
      'click .js-shop-check': 'btnShopCheck',
      'click .js-goods-check': 'btnGoodsCheck'
    },
    initialize: function () {
      var _self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);
        $(' body').removeClass();
        $(' body').addClass('bg-gray');
      });
      _self.fetch();
    },
    render: function () {
      var _self = this;
      getTpl('order/cart', 'page', function (tpl) {
        if (tpl) {
          var html = juicer(tpl,{data: page.data});
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    },
    fetch: function() {
      var _self = this;
      getJsonCX("cart",'', function(re){
        if(re.state) {
          page.data = re.data;
        }
        _self.render();
      })
    },
    // 编辑订单按钮
    btnEdit: function(e) {
      var box = $(e.currentTarget).closest('.cartbox');
      if ($(e.currentTarget).text() == "编辑") {
        $(e.currentTarget).text("完成");
        box.removeClass('cart-box-complete');
        box.addClass('cart-box-edit');
      } else {
        $(e.currentTarget).text("编辑");
        box.addClass('cart-box-complete');
        box.removeClass('cart-box-edit');
      }
      var index = $(e.currentTarget).data('index');
    },
    // 删除商品
    btnGoodsDel: function(e) {
      var _self = this;
      var shopid = $(e.currentTarget).data('shopid');
      var goodsid = $(e.currentTarget).data('goodsid');
      customRequestCX('cart/shops/'+shopid+'/items/'+goodsid+'/all?embed=shops&_method=DELETE&', "", function(re){
        if (re.state) {
          $.tips({content: "成功移出购物车"});
          var cell = $(e.currentTarget).closest('.js-table-cell');
          var index = cell.data('index');
          if (!re.data.shops[index]) {
            _self.changeResult(re);
            cell.remove();
            return;
          }
          if (re.data.shops[index].objectId != shopid) {
            _self.changeResult(re);
            cell.remove();
            return;
          }
          _self.changeData(e, re);
          $(e.currentTarget).closest('.cart-body').remove();
        }
      }, function(re){}, 'POST');
    },
    // 修改商品数量
    btnGoodsChangeCount: function(e) {
      var _self = this;
      var target = $(e.currentTarget);
      var type = target.data('type');
      var labCount = $(e.currentTarget).siblings('.js-goods-num');
      var num = labCount.text();
      if(type=='DELETE')if (num==1) return;
      var shopid = target.data('shopid');
      var goodsid = target.data('goodsid');
      customRequestCX('cart/shops/'+shopid+'/items/'+goodsid+'?embed=shops&_method='+type+'&', "", function(re){
        if (re.state) {
          $.tips({content: "修改成功了"});
          var num = labCount.text();
          if (type=='DELETE')num--;
          if (type=='PUT')num++;
          labCount.text(num);
          target.closest('.cart-body').find('.js-goods-num-red').text('X'+num);
          _self.changeData(e, re);
        }
      }, '', 'POST');
    },
    // 修改商店状态
    btnShopCheck: function(e) {
      var _self = this;
      var target = $(e.currentTarget);
      if (target.prop('checked')) {
        var type = "PUT";
      } else {
        var type = "DELETE";
      }
      var shopid = target.data('shopid');
      var index = target.data('index');
      customRequestCX('cart/shops/'+shopid+'/check?embed=shops&_method='+type+'&', "", function(re) {
        if (re.state) {
          if (re.data.shops[index].check == true) {
            target.closest('.js-table-cell').find(".js-checkbox").prop("checked",true);//全选
          } else {
            target.closest('.js-table-cell').find(".js-checkbox").prop("checked",false);//取消全选
          }
          _self.changeData(e, re);
        }
      }, function(){}, 'POST');
    },
    // 修改部分商品状态
    btnGoodsCheck: function(e) {
      var _self = this;
      var target = $(e.currentTarget);
      if (target.prop('checked')) {
        var type = "PUT";
      } else {
        var type = "DELETE";
      }
      var shopid = target.data('shopid');
      var goodsid = target.data('goodsid');
      var index = target.data('index');
      var num = target.data('num');
      customRequestCX('cart/shops/'+shopid+'/items/'+goodsid+'/check?embed=shops&_method='+type+'&', "", function(re) {
        if (re.state) {
          if (re.data.shops[index].items[num].check == true) {
            target.prop('checked', true);
          } else {
            target.prop('checked', false);
          }
          _self.changeData(e, re);
        }
      }, function(){}, 'POST');
    },
    // 统一改变状态
    changeData: function(e, re) {
      e.preventDefault();
      var _self = this;
      var cell = $(e.currentTarget).closest('.js-table-cell');
      var index = cell.data('index');
      cell.find('.js-shop-fees').text('(含运费'+re.data.shops[index].fees+'元)');
      cell.find('.js-shop-result').text('¥ '+re.data.shops[index].result);
      _self.changeResult(re);
    },
    // 改变result
    changeResult: function(re) {
      var result = re.data['result'] ? re.data['result']:0;
      var fees = re.data['fees'] ? re.data['fees']:0;
      var check = re.data['check'] ? re.data['check']:0;
      $('.js-price-result').text('¥ '+result);
      $('.js-fees-result').text('含运费 '+fees+'元');
      $('.js-count-result').text('总计'+check+'件');
    },

    // 结算购物车
    btnPay: function() {
      postJsonCX('/checkout', '', function(re){
        if (re.state) {
          var data = encodeURIComponent(JSON.stringify(re.data));
          location.href = "#params/order&"+data;
        }
      });
    }
  });

  return page;
});
