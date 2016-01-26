define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;

  var coupon = {};

  coupon.init = function () {    
    var _self = this; 
    _self.params = {campus: localStorage.DM_schoolId, status: 0}   
    configBar();
    function configBar () {
      BAR.left('back', '返回').center('', '我的现金券').right('', '已失效');
      BAR.ell.on('click', function(event) {
        history.back();        
      });
      BAR.elr.on('click', function(event) {
        BAR.left('back', '返回').center('', '已失效现金券');
        _self.params = {campus: localStorage.DM_schoolId, status: 1};
        start();
      });
    }  
    $('body').removeClass().addClass('bg-gray');
    $('.bottombar').hide();
    
    var start = function () {
      getJsonX('/coupons', _self.params, function (re) {
        if(re.state){          
          coupon.data = re.data;        
          var pageView = new coupon.PageView();          
        }
      })
    };

    start();
    
  };
  coupon.PageView = Backbone.View.extend({
    className: 'coupon nobottombar',
    events: {
      'click .js_coupondetail': 'coupondetail'
    },
    initialize: function () {
      var _self = this;
      this.on('render:page', function () {
        $('#loading').hide();
        $('.wraper>div').remove();
        $('.wraper').prepend(_self.el);
      });
      this.render();  
    },
    render: function () {
      var _self = this;
      getTpl('personal/coupon', 'page', function (tpl) {
        if (tpl) { 
          var data = coupon.data; 
          for (var i = 0; i < data.length; i++) {
            data[i].start = data[i].start.substr(0, 10);
            data[i].end = data[i].end.substr(0, 10);
          };  

          _self.template = _self.template || juicer(tpl);
          var html = _self.template.render({data: data});          
          $(_self.el).html(html);
          _self.trigger('render:page');
        }
      });
    },
    coupondetail: function (e) {
      var index = $(e.currentTarget).data('index');
      var params = coupon.data[index];
      location.href = '#params/coupondetail&' + encodeURIComponent(JSON.stringify(params));
    }
  });


  return coupon;
});
