define(['backbone', 'getTpl', 'juicer', 'swiper'], function (Backbone, getTpl, juicer, Swiper) {
  window.APP = window.APP || {};
  var APP = window.APP;
  var page = {};

  page.init = function () {
    if(!configBar()) return;  // 判断是否需要微信认证或者登录
    getJsonCXX("/home", "", function(re){
      if (re.state) {
        page.dataArr = [];    // 初始化所有的relative div数据
        page.traverse(re.data);  // 遍历获取所有的视图
        var pageView = new page.PageView();
      }
    });
  };
  var configBar = function(){
    $(' body').removeClass();
    $(' body').addClass('bg-gray');
    BAR.tab(0);
    var storage = window.localStorage;
    if (!storage.DM_schoolName) {
      location.href = "#page/city";
      return false;
    }
    BAR.left('', storage.DM_schoolName, 'drop-down');
    BAR.ell.click(function(){
      location.href = "#page/city";
    });
    BAR.elr.click(function(){
      location.href = "#page/search";
    });
    BAR.right('search');
    return true;
  };
  page.PageView = Backbone.View.extend({
    className: 'homePage custom',
    events: {
      'click .js-transform': 'transform'
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
      var self = this;
      getTpl('index/pageCustom', 'page', function (tpl) {
        if (tpl) {
          var html = juicer(tpl, {data:page.dataArr});
          $(self.el).prepend(html);
          self.trigger('render:page');
          page.rockBanner();
        }
      });
    },
    // 点击了按钮
    transform: function (e) {
        var target = $(e.currentTarget);
        var schemes = target.data("schemes");
        var status = target.data("public");
        if (!status) {
          $.tips({content: "需要先登录判断"});
          return;
        }
        var url = page.transformUrl(schemes);
    }

  });

  // 遍历，获取所有的relative div
  page.traverse = function(data) {
    var width = $('body').width();               // 获取屏幕的宽度
    for (var a=0; a<data.length; a++) {
      var item = data[a];
      page.dataArr[a] = new Object();
      page.dataArr[a].divType = item.type;

      if (1 == item.type) {                        // 添加banner
        page.dataArr[a].divHeight = item.rate *width;
        page.dataArr[a].divTitle = item.title;
        page.dataArr[a].divContent = [];
        page.traBanner(item, a);
      } else if (2 == item.type) {                 // 添加通知栏
        page.dataArr[a].divHeight = item.rate * width;
        page.dataArr[a].divTitle = item.title;
      } else if (3 == item.type) {                 // 自由图形
        // 初始化
        var height = item.rate * width;
        page.dataArr[a].divHeight = height;
        page.dataArr[a].divContent = [];
        point = [0,0];                              // 初始化的位置
        sizeInit = [width, height];                 // 初始化大小
        page.calculate(item, point, sizeInit, a);
      } else if (4 == item.type) {                 // 空白栏
        page.dataArr[a].divHeight = item.height;
      }
    }
  };

  // 循环，获取banner导航栏的所有数据
  page.traBanner = function(data, index) {
    var items = data.children;
    for(var i=0;i<items.length;i++) {
      var item = items[i];
      var object = new Object();
      object.title = item.title;
      object.img = item.image;
      object.schemes = item.schemes;
      object.public = true;
      page.dataArr[index].divContent.push(object);
    }
  };

  // 递归，获取到一个relative div中所有的absolute div
  page.calculate = function(data, point, size, index) {
    var items = data.children;
    for(var i=0;i<items.length;i++) {
      var item = items[i];
      var gap = 0;
      for(var a=0;a<i;a++){
        gap += items[a].rate;
      }

      // 递归
      if(item.children){
        pos = point.concat();
        sizeView = [0,0]
        if(data.orientation == 0) {
          pos[0] = point[0] + gap * size[0];
          sizeView[0] = item.rate * size[0];
          sizeView[1] = size[1];
        }
        if(data.orientation == 1) {
          pos[1] = point[1] + gap * size[1];
          sizeView[0] = size[0];
          sizeView[1] = item.rate * size[1];
        }
        page.calculate(item, pos, sizeView, index);
        continue;
      }

      // 新建DIV
      var object = new Object();
      object.line = data.line;
      object.schemes = item.schemes;
      object.public = true;
      object.img = item.image;
      if(data.orientation == 0) {
        object.x = gap * size[0];
        object.y = 0;
        object.width = item.rate * size[0];
        object.height = size[1];
      } else if (data.orientation == 1) {
        object.x = 0;
        object.y = gap * size[1];
        object.width = size[0];
        object.height = item.rate * size[1];
      }
      object.x += point[0];
      object.y += point[1];
      page.dataArr[index].divContent.push(object);
    }
  };

  // 由schemes转换获取URL
  page.transformUrl = function(schemes) {
    if (schemes.indexOf("http://") > -1 || schemes.indexOf("https://") > -1) {
      location.href = schemes;
      return;
    }
    if(schemes.indexOf("items?categories=") > -1){
      var data = schemes.split("categories=")[1];
      url = "#params/goodslist&" + data;
    } else if(schemes.indexOf("shops?category=") > -1){
      var data = schemes.split("category=")[1];
      url = "#params/qsend&" + data;
    } else {
      return;
    }

    location.href = url;
  };

  // 开始转动banner
  page.rockBanner = function() {
    var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 0,
      loop: true
    });
  };

  return page;
});