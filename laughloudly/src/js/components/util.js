define(['swiper'], function (Swiper) {
  var Util = {};

  /*
   * 时间戳格式化
   * date：秒, format: 'yyyy-MM-dd hh:mm:ss'
   * 注册函数到juicer：juicer.register('dataFormat', Util.dataFormat);
   */
  Util.dataFormat = function (date, format) {
      var date = new Date(Number(date * 1000));

      var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
      };
      format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
          if(all.length > 1){
            v = '0' + v;
            v = v.substr(v.length-2);
          }
          return v;
        }
        else if(t === 'y'){
          return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
      });
      return format;
    };

  /*
   * 设置link href
   */
  Util.setHref = function(obj) {
    var type = obj.data('type');
    if (type) {
      var hash;
      var api = '';
      if (obj.data('url') && obj.data('url').split('?')[1]) {
        api = obj.data('url').split('?')[1];
        api = api.replace('&app=1', '');
        api = api.replace('&from=browser', '');
      }
      if (type === 'infoMyComment' || type === 'infoMyCollect' || type === 'infoMyUpCommunity' || type === 'infoMyCommunity') { // 这些接口需要加'from=browser'
        hash = '#' + type + '/' + api + '&app=1&from=browser';
      } else if ( type === 'infoList_form') {  // 转换表单列表type与路由一致
        hash = '#list_form' + '/' + api + '&app=1&from=browser';
      } else {  // 后台配置页面生成的接口
        hash = '#' + type + '/' + api + '&app=1';
      }

      obj.attr('href', hash);
    }
  }

  /*
   * 幻灯
   * @pram: obj 幻灯父元素
   * @pram: height_p_width height/ width 高宽比
   */
  Util.dmSwiper = function (obj, height_p_width) {
    var id = 'swiper_' + new Date().getTime();
    var paginationClass = id + '_pagination';

    function resizeSwiper(oSliders, height_p_width) {
      var swiper_w = oSliders.width();
      var swiper_h = swiper_w * height_p_width;
      oSliders.height(swiper_h);
    }

    $swiper = obj.find('.js-swiper');
    $swiper.attr('id', id);
    obj.find('.swiper-pagination').addClass(paginationClass)
    resizeSwiper(obj.find('.js-swiper'),height_p_width);

    // 初始化swiper
    var banner = new Swiper('#' + id, {
      loop: true,
      pagination: '.' +  paginationClass
    });

    if (obj.find('.swiper-pagination-switch').length < 2) {
      obj.find('.swiper-pagination').hide();
    }
  }

  /*
   * 销量格式化
   */
  Util.salesFormat = function (sales) {
    sales = Number(sales);
    if (sales >= 10000) {
      var a = parseInt(sales / 10000);
      var b = Math.round(sales % 10000 / 1000);
      sales = a + '.' + b + '万';
    }

    return sales
  }

  /*
   * 图片1:1显示
   */
  Util.setPicProportion = function (selector) {
    $(selector).each(function(i,item) {
      item = $(item);
      var img = item.find('img'),
          itemWidth = item.parent().width() * 0.31;
      item.css({
        width: itemWidth + 'px',
        height: itemWidth +'px'
      });
      img.on('load',function() {
        var height = img.height(),
            width = img.width();
        if(height < width) {
          img.css({
            height:'100%',
            width:"auto",
            maxWidth: '640px'
          });
        } else {
          img.css({
            height:'auto',
            width:'100%'
          });
        }
      });
     });
  }
  return Util;
});
