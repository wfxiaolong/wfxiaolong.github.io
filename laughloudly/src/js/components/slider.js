/**
 * Describe: Image Slider
 * Author: Jianxin
 * Date: 2015-11-23
 */

(function($) {

  var Plugin,
    _swipeEventBind, _showCurrentImg, _initNeighborImgs, _initSlider, _sliderImgTpl, _sliderCtrlbarTpl, _ctrlbarEventBind;

  Plugin = (function() {

    function Plugin(element, options) {
      this.settings = $.extend({}, $.fn.dmuiSlider.defaults, options);
      this.$element = $(element);
      this.init();
    }


    Plugin.prototype = {

      constructor: Plugin,

      init: function() {
        var $element, screenW, screenH, settings;
        $element = this.$element;
        settings = this.settings;
        screenW = document.documentElement.clientWidth;
        screenH = document.documentElement.clientHeight;

        $element.on('click', 'img', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var $imgs, index, $container, pageCount;

          $container = $('.dmui-slider-container')
          $imgs = $element.find('img');
          index = $imgs.index($(this));
          pageCount = $imgs.length;

          var tpl = '<div class="dmui-slider-viewport" style="position: fixed; top: 0; left: 0;z-index:9999; overflow: hidden;">'+
                      '<div class="dmui-slider-container" style="background:'+ settings.bg_color +';  position: relative; top: 0; left: 0;">'+
                         _sliderImgTpl($imgs, pageCount)+
                      '</div>'+
                      _sliderCtrlbarTpl(pageCount)+
                    '</div>';
          $element.parent().append(tpl);

          _initViewportSize(pageCount, screenW, screenH);

          _initNeighborImgs($imgs, screenW, screenH, settings.img_datasrc, index);
          _showCurrentImg(index, screenW, settings.slider_effect);
          
          _ctrlbarEventBind();
          _swipeEventBind($imgs, index, screenW, screenH, settings.img_datasrc, settings.slider_effect);

          //解决安卓下滑动事件失效 
          $('body').bind("touchmove", function(e) {
               e.preventDefault();
          });
        });
      }

    };

    return Plugin;

  })();

  _swipeEventBind = function($imgs, index, screenW, screenH, img_datasrc, slider_effect) {
    var current = index;
    var $warp = $(".dmui-slider-container");
    // 判断是否支持css 3d
    var supportsCSS = !!((window.CSS && window.CSS.supports) || window.supportsCSS || false);
    
    $warp.swipeLeft(function(){
      if (current >= $imgs.length-1) {
        return;
      }
      current++;
      $warp.parent().find('.dmui-slider-curPage').html(current+1);
      if (supportsCSS && slider_effect) {
        $warp
          .css('-webkit-transform', 'translate('+-screenW*current+'px, 0)')
          .css('transition', '-webkit-transform .5s ease-in-out');
      }else{
        $warp
          .css('left', -screenW*current);
      }

      _initNeighborImgs($imgs, screenW, screenH, img_datasrc, current);
    });

    $warp.swipeRight(function(){
      if (current <= 0) {
        return;
      }
      current--;
      $warp.parent().find('.dmui-slider-curPage').html(current+1);
      if (supportsCSS && slider_effect) {
        $warp
          .css('-webkit-transform', 'translate('+-screenW*current+'px, 0)')
          .css('transition', '-webkit-transform .5s ease-in-out');
      }else{
        $warp
          .css('left', -screenW*current);
      }

      _initNeighborImgs($imgs, screenW, screenH, img_datasrc, current);
    });
  };

  _showCurrentImg = function(index, screenW, slider_effect) {
    var supportsCSS = !!((window.CSS && window.CSS.supports) || window.supportsCSS || false);

    $('.dmui-slider-curPage').html(index+1);
    if (supportsCSS && slider_effect) {
      $('.dmui-slider-container')
        .css('-webkit-transform', 'translate('+(-screenW*index)+'px, 0)');
    }else{
      $('.dmui-slider-container')
        .css('left', -screenW*index);
    }
  };

  _initNeighborImgs = function($imgs, screenW, screenH, img_datasrc, index) {
    var $sliderimgs = $('.dmui-slider-wrapper img');
    var arr = [index, index+1, index-1];
    for (n in arr){
      var N = arr[n];
      if (N<0 || $imgs.length<=N){
        continue;
      }
      var datasrc = $imgs.eq(N).data(img_datasrc);
      if ($sliderimgs.eq(N).attr("src") === datasrc){
        continue;
      }
      $sliderimgs.eq(N).attr("src", datasrc).on("load",function(){
        var $this = $(this);
        if ($this.height()/$this.width() > screenH/screenW) {
          $this
            .css('height', screenH)
            .css('width', $this.width()/$this.height()*screenH);
        }
      });
    }
  };

  _initViewportSize = function(pageCount, screenW, screenH) {
    $('.dmui-slider-viewport')
      .css("width", screenW)
      .css("height", screenH);
    $('.dmui-slider-container')
      .css("width", screenW * pageCount)
      .css("height", screenH);
    $('.dmui-slider-wrapper')
      .css("width", screenW)
      .css("height", screenH);
  };

  _sliderImgTpl = function($imgs, pageCount) {
    var imgstpl = '';
    $imgs.each(function() {
      imgstpl += '<div class="dmui-slider-wrapper dmui-slider-close" style="display: table-cell; vertical-align: middle; text-align: center;-webkit-backface-visibility: hidden; -ms-backface-visibility: hidden; backface-visibility: hidden; -webkit-perspective: 1000; -ms-perspective: 1000; perspective: 1000;-webkit-transform: translate(0,0);">'+
                    '<div class="dmui-slider-scroller">'+
                      '<img src="'+ $(this).attr("src") +'" style="max-width: 100%">'+
                    '</div>'+
                  '</div>'
    })
    return imgstpl;
  };

  _sliderCtrlbarTpl = function(pageCount) {
    var ctrlbartpl = '<div class="dmui-slider-ctrlbar" style="position: relative;bottom: 60px;left: 0;z-index: 99;width: 100%;line-height: 30px;text-align: center;color: #fff;font-family: Arial;">'+
                        '<a class="dmui-slider-close" style="margin: 0 0 0 15px;float: left; visibility: hidden;width: 72px;height: 30px;background-color: #333;" href="javascript:;">关闭</a>'+
                        '<a style="margin: 0  15px 0 0;float: right;visibility: hidden;width: 72px;height: 30px;background-color: #333;" href="javascript:;" class="dmui-slider-zan">'+
                          '<span class="zan">赞</span>'+
                          '<span data-num="0">2</span>'+
                        '</a>'+
                        '<span class="dmui-slider-curPage">1</span><span class="dmui-slider-pageCount">/'+ pageCount +'</span>'+
                      '</div>'
    return ctrlbartpl;
  };

  _ctrlbarEventBind = function() {
    $('.dmui-slider-viewport').on('click','.dmui-slider-close', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).off();

      $('.dmui-slider-viewport').remove();
      $('body').unbind("touchmove");
    })
  };


  $.fn.dmuiSlider = function(options) {
    return this.each(function() {
      var $this = $(this),
        instance = $.fn.dmuiSlider.lookup[$this.data('dmuiSlider')];
      if (!instance) {
        //zepto的data方法只能保存字符串，所以用此方法解决一下
        $.fn.dmuiSlider.lookup[++$.fn.dmuiSlider.lookup.i] = new Plugin(this, options);
        $this.data('dmuiSlider', $.fn.dmuiSlider.lookup.i);
        instance = $.fn.dmuiSlider.lookup[$this.data('dmuiSlider')];
      }

      if (typeof options === 'string') return instance[options]();
    })
  };

  $.fn.dmuiSlider.lookup = {
    i: 0
  };


  $.fn.dmuiSlider.defaults = {
    bg_color: "#000",
    img_datasrc: "src",
    slider_effect: false
  };

//  $(function() {
//    $('[data-dmuiSlider]').dmuiSlider();
//  });
}(window.Zepto || window.jQuery));