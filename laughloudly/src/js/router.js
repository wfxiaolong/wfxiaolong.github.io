define(['components/util','config/GlobalConfig', 'components/netoperate', 'components/network', 'components/storageOpt', 'components/animate',
      'app/index/pageCustom','app/index/search','app/index/login', 'app/quickshop/detail', 'app/quickshop/shop',
      'app/quickshop/send', 'app/personal/coupon', 'app/personal/coupondetail', 'app/personal/userCenter', 'app/personal/myorder',
      'app/personal/serve', 'app/personal/myorderlist', 'app/personal/faq', 'app/personal/myinfo', 'app/personal/share', 'app/order/paySuccess',
      'app/order/payContent', 'app/order/payWay', 'app/order/useCoupon', 'app/order/order', 'app/order/orderEdit', 'app/order/address',
      'app/order/cart', 'app/supermarket/goodslist', 'app/supermarket/goodsdetails', 'app/supermarket/classify', 'app/position/city', 
      'app/position/school', 'app/personal/manaAddress', 'app/personal/chooseAddress'],
  function (Util, GlobalConfig, netoperate, network, storageOpt, animate, index, search, login, qdetail, qshop, qsend, coupon, coupondetail, userCenter, myorder, serve, myorderlist, faq, myinfo, share, paySuccess, payContent, payWay, useCoupon, order, orderEdit, address, cart, goodslist, goodsdetails, classify, city, school, manaAddress, chooseAddress) {

    window.APP = window.APP || {};
    var APP = window.APP;
    var Router = Backbone.Router.extend({
      routes: {
        '': 'pageIndex',
        '404': 'page404',
        'page/:target': 'method',
        'params/:params': 'methodWithParams',
      },
      initialize: function () {        
        var _self = this;
        var global = new GlobalConfig(); 

        document.getElementsByTagName('html')[0].style.fontSize = global.rootFontSize;
        this.renameDocTitle(APP.globalConfig.appName);
        this.on('change:page', this.pageChange);
        this.pageChange();   

        // 初始化购物车角标
        if(getCartCountClever() === false){
          customRequestCX('cart' +'?fields=count&', "", function(re){
            if(re.state){
              var count = re.data.count;  
              setCartCount(count);                      
              $('.bottombar li').eq(2).addClass('msg').attr('data-msg', count)
            }else{
              $.tips({content: re.msg})
            }
          }, function (err) {
            console.log(err)
          }, 'GET')
        }else{
          if(getCartCountClever()){
            $('.bottombar li').eq(2).addClass('msg').attr('data-msg', getCartCountClever())
          }          
        }        

        // 操作topbar和bottombar
        window.BAR = window.BAR || {}; 
        var BAR = window.BAR;
        BAR.ell = $('.topbar .back');
        BAR.elc = $('.topbar .title');
        BAR.elr= $('.topbar .top-right');
        BAR.tab = function (index) {
          $('#navbar li a').removeClass('on');
          $('#navbar li').eq(index).find('a').addClass('on');
          return BAR;
        };
        BAR.left = function () {
          this.ell.find('i').first().addClass('icon-' + arguments[0]);
          this.ell.find('span').text(arguments[1]);
          this.ell.find('i').last().addClass('icon-' + arguments[2]);
          return this;
        };
        BAR.center = function () {
          this.elc.find('i').first().addClass('icon-' + arguments[0]);
          this.elc.find('span').text(arguments[1]);
          this.elc.find('i').last().addClass('icon-' + arguments[2]);
          return this;
        };
        BAR.right = function () {
          this.elr.find('i').first().addClass('icon-' + arguments[0]);
          this.elr.find('span').text(arguments[1]);
          this.elr.find('i').last().addClass('icon-' + arguments[2]);
          return this;
        };
        BAR.clear = function () {
          var html = '<i class="icon-laugh"></i> <span></span> <i class="icon-laugh"></i>';
          this.ell.html(html).off();
          this.elc.html(html).off();
          this.elr.html(html).off();   
          $('.topbar, .bottombar').show();       
          return this;
        };
        BAR.hide = function() {
          $('.topbar').hide();
        };
        return BAR;   
      },
      pageChange: function () {
        clearAllRequest();          //中断之前的所有网络请求
        $(' body').removeClass();
        $(' body').addClass('bg-white');
        $('#loading').show();
        $('.wraper>div').remove();
        $(window).off();
        $('.wraper').off();
        if (!APP.ua.browser.damaiapp) {
          window.scrollTo(0, 0);
        }      
        window.BAR && window.BAR.clear();        
      },      
      renameDocTitle: function (title) {  // 重命名文档标题
        var $body = $('body');
        document.title = title;
        // hack在微信等webview中无法修改document.title的情况
        var $iframe = $('<iframe src="/favicon.ico" frameborder="0" height="0" width="0" scrolling="no" style="display: none;"></iframe>');
        if (APP.ua.os.ios && APP.ua.browser.wechat) {
          $iframe.on('load',function() {
            setTimeout(function() {
              $iframe.off('load').remove();
            }, 0);
          }).appendTo($body);
        }
      },      
      page404: function () {
        this.trigger('change:page');
        this.renameDocTitle('404'); 
        $('.topbar, .bottombar').hide();       
        $('#loading').hide();

        var View404 = Backbone.View.extend({
          template: '<div class="tips404"> <h1>404</h1> <p>页面未找到</p> </div>',
          render: function () {
            $(this.el).html(this.template);
            return this;
          }
        });
        var view404 = new View404();        
        $('.wraper').prepend(view404.render().el);
      },

      /// method
      method: function (method) {
        this.pageChange();
        var target = eval(method);
        target.init();
      },

      /// methodWithParams
      methodWithParams: function (params) {
        this.pageChange();
        var data = params.split("&");
        var method = data[0];
        data.shift();
        var target = eval(method);        
        target.init.apply(null, data);
      }

     });

    return Router;
});