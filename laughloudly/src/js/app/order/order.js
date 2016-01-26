define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var page = {};

  page.init = function (order) {
    configBar();
    page.order = JSON.parse(decodeURIComponent(order));
    console.log(page.order)
    $('body').removeClass().addClass('bg-gray')
    var pageView = new page.PageView();

    page.timeArr = [];
    page.shops = {};

    for (var i = 0; i < page.order.shops.length; i++) {
      var shop = page.order.shops[i];
      page.shops[shop.objectId] = {
        "delivery": "",  // 参见「获取店铺配送时间」
        "remarks": ""
      }
    };
  };
  var configBar = function(){
    BAR.left('back', "返回", '').center("", "订单确认");
    BAR.ell.click(function(){
      window.history.go(-1);
    });
    $('.bottombar').hide();
  };
  page.PageView = Backbone.View.extend({
    className: 'order nobottombar',
    events: {
      'click .js-change-default-address': 'changeAddress',
      'click .js-goods-details': 'goodsDetails',
      'click .js-send-time': 'getSendTime',
      'click .js-pay-way': 'payWay',
      'click .js-btn-pay': 'submit',
      'click .js-select-send-time button': 'select',
      'blur .js-remarks': 'remarks'
    },
    initialize: function () {
      var _self =this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper').prepend(_self.el);        
      });
      this.fetchAddr();      
    },
    render: function () {
      var _self = this;
      getTpl('order/order', 'page', function (tpl) {
        if (tpl) {
          var html = juicer(tpl,{data:page.order, addr: page.addr});
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    },
    fetchAddr: function() {
      var _self = this;
      getJsonCX("/addresses/using",'', function(re){
        if(re.state) {
          page.addr = re.data;
        }
        _self.render();
      }, function(){
        $.tips({content: "获取不到默认地址信息"});
      })
    },
    changeAddress: function() {
      location.href = "#page/manaAddress";
    },
    goodsDetails: function () {
      var data = page.order.shops[0].items;
      location.href = "#params/myorderlist&" + encodeURIComponent(JSON.stringify(data));
    },
    getSendTime: function (e) {
      var index = $(e.currentTarget).data('index');
      var objectid = $(e.currentTarget).data('objectid');
      if (page.timeArr[index] != null) {
        var data = page.timeArr[index];
        html = '';
        for(var i = 0, len = data.length;i < len;i++) {
          html += '<button data-id="'+ objectid + '" data-index="'+ index + '">'+data[i]+'</button>';
        }
        html += '<button>取消</button>';
        $('.js-select-send-time').html(html);
        $('.ui-actionsheet').addClass('show');
        return ;
      }
      var url = '/shops/'+objectid+'/delivery?';
      customRequestCX(url, '', function(re){
        if(re.state){
          // 修改下拉列表的信息
          page.timeArr[index] = re.data;
          var data = re.data,
          html = '';
          for(var i = 0, len = data.length;i < len;i++) {
            html += '<button data-id="'+ objectid + '" data-index="'+ index + '">'+data[i]+'</button>';
          }
          html += '<button>取消</button>';
          $('.js-select-send-time').html(html);
          $('.ui-actionsheet').addClass('show');
        }
      }, function(){});
    },
    select: function (e) {
      var id = $(e.currentTarget).data('id'),
          index = $(e.currentTarget).data('index'),
          val = $(e.currentTarget).text();
      if(id){
        page.shops[id]['delivery'] = val;  
        $('.ui-actionsheet').removeClass('show');
        $('.js-time-show').eq(index).text(val);
      }else{
        $('.ui-actionsheet').removeClass('show');
      }
      
    },
    remarks: function (e) {
      var id = $(e.currentTarget).data('id'),
          index = $(e.currentTarget).data('index'),
          val = $(e.currentTarget).val();
      page.shops[id]['remarks'] = val; 
    },
    payWay: function(){
      var data = encodeURIComponent(JSON.stringify(page.order));
      location.href = "#params/payWay&"+data;
    },
    submit: function () {      
      var params = { 
        address: page.addr.objectId,
        shops: { }
      };
      for(var key in page.shops){
        if(page.shops[key].delivery === ''){
          $.tips({content: '请选择配送时间'})
          return ;
        }
      }
      params.shops = _.extend({}, page.shops)
      
      postJsonCX('/orders/'+ page.order.objectId , params, function (re) {
        if(re.state){
          var data = encodeURIComponent(JSON.stringify(re.data));
          location.href = "#params/payContent&" + data;
        }else{
          $.tips({content: re.msg});
        }        
      }, function (err) {
        console.log(err)
      })

    }
  });
  return page;
});
